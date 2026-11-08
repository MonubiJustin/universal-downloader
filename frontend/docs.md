# Frontend/backend integration

The frontend is an audio-first YouTube downloader. It sends YouTube URLs to an
Express API; it never calls `youtube-dl-exec` or `yt-dlp` directly.

## Backend stack

The backend is expected to use Bun, Express 5, TypeScript, Zod, and
`youtube-dl-exec`, which wraps the `yt-dlp` extraction engine. Extraction,
format selection, conversion, temporary files, and download streaming are
backend responsibilities.

Configure the frontend with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_YOUTUBE_API_PREFIX=/api/youtube
```

`NEXT_PUBLIC_YOUTUBE_API_PREFIX` defaults to `/api/youtube`. The current
repository backend mounts its existing info route at
`/api/v1/youtube/info`; set the prefix to `/api/v1/youtube` until the backend
is aligned with the proposed contract below.

## Retrieve video information

### `POST /api/youtube/info`

Request:

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

Expected success response:

```json
{
  "success": true,
  "data": {
    "id": "VIDEO_ID",
    "title": "Example Song",
    "duration": 240,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "formats": [
      {
        "formatId": "251",
        "extension": "webm",
        "codec": "opus",
        "bitrate": 160,
        "filesize": 3500000
      }
    ]
  }
}
```

| Field | Meaning |
| --- | --- |
| `id` | The YouTube video identifier. |
| `title` | The title displayed in the result view. |
| `duration` | Duration in seconds, or `null` when unavailable. |
| `thumbnail` | An absolute thumbnail URL, or `null`. |
| `formats` | Audio-only formats discovered by the extractor. |
| `formats[].formatId` | Backend/extractor format identifier. |
| `formats[].extension` | Source container extension, such as `m4a` or `webm`. |
| `formats[].codec` | Source audio codec. |
| `formats[].bitrate` | Approximate audio bitrate in kbps, or `null`. |
| `formats[].filesize` | Size in bytes, or `null`. |

The frontend intentionally does not display `formats` or let users choose a
format. The backend must select the best available audio automatically.

Non-2xx responses should use a consistent envelope:

```json
{
  "error": {
    "code": "INVALID_URL",
    "message": "A valid YouTube URL is required."
  }
}
```

Useful codes include `INVALID_URL`, `MEDIA_NOT_FOUND`,
`MEDIA_UNAVAILABLE`, `RATE_LIMITED`, `EXTRACTOR_ERROR`, and
`EXTRACTOR_TIMEOUT`. The frontend presents the returned message for invalid,
unsupported, unavailable, and failed requests.

## Download audio

### `POST /api/youtube/download`

Proposed request:

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

The backend should select the best available audio and return either:

1. A direct streamed response with an audio `Content-Type` and
   `Content-Disposition`, or
2. A JSON job/file response containing a backend-controlled `downloadUrl`.

The final response contract is **not agreed or implemented yet**. The frontend
service layer supports a streamed audio response and a ready JSON response, but
does not invent a URL, expose `yt-dlp` URLs, or pretend that queued jobs are
complete. If the backend returns `queued` or `processing`, it must also provide
a polling or event contract before the UI can report completion.

For a JSON response, the proposed shape is:

```json
{
  "data": {
    "id": "download-id",
    "status": "ready",
    "title": "Example Song",
    "filename": "Example Song.mp3",
    "mimeType": "audio/mpeg",
    "size": 7340032,
    "duration": 240,
    "downloadUrl": "https://api.example.com/api/youtube/file/download-id",
    "expiresAt": "2026-11-08T10:00:00.000Z"
  }
}
```

The backend must decide whether downloads are synchronous streams or
asynchronous jobs, how long generated files remain available, the output
container/bitrate policy, and whether a file endpoint is needed. It should
validate URLs with Zod, use bounded extractor timeouts, disable playlists
unless explicitly supported, avoid open proxy behavior, and avoid returning
cookies, raw `yt-dlp` output, filesystem paths, or temporary extractor URLs.

## Frontend behavior and assumptions

- Initial state shows one YouTube URL field and a `Get audio` action.
- While metadata is loading, the action is disabled and the UI shows progress.
- A successful info response shows the thumbnail, title, duration, and a
  single primary `Download audio` action.
- The UI communicates that the best available audio is selected automatically.
- Download failures are shown inline and do not clear the retrieved video.
- No video downloads, video quality controls, format selectors, or optional
  settings are exposed.
- The frontend currently assumes the API returns JSON metadata and accepts
  either the documented `{ success, data }` envelope or a direct data object.
- The frontend does not currently call a formats endpoint.

Before integration, the backend must align the route prefix, normalize the
metadata field names (`extension`, not `extention`), implement the download
endpoint, and finalize its response contract.
