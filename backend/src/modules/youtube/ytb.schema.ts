import { z } from "zod";

export const videoInfoSchema = z.object({
  url: z
    .url()
    .trim()
    .refine(
      (v) => {
        const hostname = new URL(v).hostname;

        return ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(hostname);
      },
      {
        message: "Please provide a valid youtube url",
      },
    ),
});

export type VideoInfoRequest = z.infer<typeof videoInfoSchema>;
