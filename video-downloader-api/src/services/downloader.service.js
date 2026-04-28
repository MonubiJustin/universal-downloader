const YTDlpWrap = require("yt-dlp-wrap").default;


const ytDlp = new YTDlpWrap("yt-dlp");

const getVideoInfo = async (url) => {
  const parsed = await ytDlp.execPromise([
    url,
    '--cookies', process.env.COOKIES_PATH,
    '--dump-json',
    '--no-playlist'
  ]);
  const metadata = JSON.parse(parsed);

  const formats = parsed.formats || [];
  let bestVideo = null;

  // HANDLE YOUTUBE DOWNLOADS
  if (parsed.extractor == "youtube") {
    bestVideo = formats
      .filter(f => f.ext === "mp4" && f.url && f.acodec != "none")
      .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
  } else {
  bestVideo = formats
    .filter((f) => f.ext === "mp4" && f.url)
    .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
  
  }

 
  // console.log(bestVideo);

  return {
    title: parsed.title,
    platform: parsed.extractor,
    uploader: parsed.uploader,
    duration: parsed.duration,
    thumbnail: parsed.thumbnail,
    downloadUrl: bestVideo?.url || null,
    quality: bestVideo?.height ? `${bestVideo.height}p` : null,
  };
};

const getFormats = async (url) => {
  const metadata = await ytDlp.getVideoInfo(url);
  const formats = metadata.formats || [];


  
  return {
    title: metadata.title,
    platform: metadata.extractor,
    formats: formats
      .filter((f) => f.url)
      .map((f) => ({
        formatId: f.format_id,
        quality: f.height ? `${f.height}p` : f.format_note || "audio only",
        ext: f.ext,
        filesize: f.filesize || null,
        url: f.url,
      })),
  };
};


const getAudio = async (url) => {
  const metadata = await ytDlp.getVideoInfo(url);
  let formats = metadata.formats || [];

  const bestAudio = formats
    .filter(f => f.url && f.vcodec === 'none' && f.acodec !== 'none')
    .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
  
  if (!bestAudio) {
    throw new Error("No suitable audio format found for this video.");
  }

  return {
    format_id: bestAudio.format_id,
    ext: bestAudio.ext,
    acodec: bestAudio.acodec,
    abr: bestAudio.abr,
    asr: bestAudio.asr,
    audio_channels: bestAudio.audio_channels,
    url: bestAudio.url
  };
}


module.exports = {
    getFormats,
  getVideoInfo,
    getAudio
}

