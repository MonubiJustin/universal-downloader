import DownloadForm from "@/components/DownloadForm";

export const metadata = {
  title: "TikTok Video Downloader — No Watermark | Grabr",
  description: "Download TikTok videos without watermark for free. High quality MP4 downloads. Fast, easy and works on all devices.",
};

export default function TikTokPage() {
  const faqs = [
    {
      q: "Can I download TikTok videos without watermark?",
      a: "Yes, our tool automatically attempts to fetch the version of the video without the TikTok watermark.",
    },
    {
      q: "Does it work on mobile?",
      a: "Absolutely! Grabr is fully responsive and works perfectly on iPhone, Android, and tablets.",
    },
    {
      q: "How many videos can I download?",
      a: "There are no limits. You can download as many TikTok videos as you like, for free.",
    },
    {
      q: "Where are the videos saved?",
      a: "Videos are usually saved in your device's 'Downloads' folder or your browser's default download location.",
    },
  ];

  return (
    <div className="container mx-auto px-4 pt-20 pb-32">
      <section className="text-center space-y-8 mb-16">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            TikTok Video Downloader —<br />
            <span className="text-purple-500">No Watermark</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            The easiest way to download TikTok videos without the watermark. 
            Just paste the TikTok link and save the video in HD MP4 format.
          </p>
        </div>

        <DownloadForm />
      </section>

      <section className="max-w-3xl mx-auto mt-24 space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-white/40 mt-2">Learn more about downloading TikTok videos.</p>
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
