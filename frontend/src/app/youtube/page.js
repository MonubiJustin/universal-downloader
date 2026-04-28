import DownloadForm from "@/components/DownloadForm";

export const metadata = {
  title: "YouTube Video Downloader — Fast MP4 & MP3 Downloads | Grabr",
  description: "Download YouTube videos in high quality for free. Support for MP4, MP3, and more. No software required. Fast and secure downloads.",
};

export default function YouTubePage() {
  const faqs = [
    {
      q: "Is it legal to download YouTube videos?",
      a: "Downloading videos for personal use is generally tolerated, but you should always respect the creator's copyright and terms of service.",
    },
    {
      q: "Can I download 4K YouTube videos?",
      a: "Yes, Grabr supports high resolution downloads including 1080p, 2K, and 4K when available.",
    },
    {
      q: "Do I need to install an extension?",
      a: "No extensions or software are needed. Our tool works entirely in your web browser.",
    },
    {
      q: "Can I convert YouTube videos to MP3?",
      a: "Yes, once you paste the link, choose the 'Audio' or 'MP3' format from the format selection list.",
    },
  ];

  return (
    <div className="container mx-auto px-4 pt-20 pb-32">
      <section className="text-center space-y-8 mb-16">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            YouTube Video Downloader —<br />
            <span className="text-purple-500">Fast & High Quality</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Safe and fast YouTube video downloader. Save any video from YouTube 
            locally in formats like MP4, WebM, or MP3 with just a click.
          </p>
        </div>

        <DownloadForm />
      </section>

      <section className="max-w-3xl mx-auto mt-24 space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-white/40 mt-2">Common questions about our YouTube downloader.</p>
        </div>

        <div className="grid gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl glass space-y-2">
              <h3 className="text-lg font-bold text-white">{faq.q}</h3>
              <p className="text-white/50 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
