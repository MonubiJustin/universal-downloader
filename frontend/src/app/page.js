import DownloadForm from "@/components/DownloadForm";

export default function Home() {
  const platforms = [
    "YouTube",
    "Instagram",
    "TikTok",
    "Facebook",
    "Twitter",
    "Reddit",
    "Vimeo",
  ];

  return (
    <div className="container mx-auto px-4 pt-20 pb-32">
      <section className="text-center space-y-8 mb-16">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Download Any Video.<br />
            <span className="text-purple-500">Any Platform.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto">
            Paste a link from YouTube, Instagram, TikTok, Facebook and more. 
            Fast, free, and no sign-up required.
          </p>
        </div>

        <DownloadForm />

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {platforms.map((platform) => (
            <span
              key={platform}
              className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-sm text-white/40 font-medium"
            >
              {platform}
            </span>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        {[
          {
            title: "Lightning Fast",
            desc: "Our high-speed servers fetch and process your videos in seconds.",
          },
          {
            title: "HD Quality",
            desc: "Download videos in the highest available quality, up to 4K resolution.",
          },
          {
            title: "Private & Secure",
            desc: "We don't store your data or track your downloads. Fully anonymous.",
          },
        ].map((feature, i) => (
          <div key={i} className="p-8 rounded-2xl glass space-y-3">
            <h3 className="text-lg font-bold text-white">{feature.title}</h3>
            <p className="text-white/50 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
