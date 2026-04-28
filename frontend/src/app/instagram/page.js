import DownloadForm from "@/components/DownloadForm";

export const metadata = {
  title: "Instagram video Downloader — Download Reels & Stories Free | Grabr",
  description: "Download Instagram reels, videos, and stories for free. High quality MP4 downloads. No login required. Fast and secure.",
};

export default function InstagramPage() {
  const faqs = [
    {
      q: "How to download Instagram Reels?",
      a: "Simply copy the link of the Reel, paste it into the Grabr input box above, and click Download.",
    },
    {
      q: "Is it free to use?",
      a: "Yes, Grabr is 100% free to use. You can download as many videos as you want without any restrictions.",
    },
    {
      q: "Do I need to log in to my Instagram account?",
      a: "No, you don't need to log in or provide any personal information. Just paste the public link.",
    },
    {
      q: "What is the quality of the downloaded videos?",
      a: "We always try to provide the highest available quality, usually in HD (1080p) format.",
    },
  ];

  return (
    <div className="container mx-auto px-4 pt-20 pb-32">
      <section className="text-center space-y-8 mb-16">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Instagram Reel Downloader —<br />
            <span className="text-purple-500">Free & Fast</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Download your favorite Instagram Reels and videos instantly. 
            Grabr allows you to save high-quality content directly to your device 
            without any software installation.
          </p>
        </div>

        <DownloadForm />
      </section>

      <section className="max-w-3xl mx-auto mt-24 space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-white/40 mt-2">Everything you need to know about downloading Instagram content.</p>
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
