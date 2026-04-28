import DownloadForm from "@/components/DownloadForm";

export const metadata = {
  title: "Facebook Video Downloader — Save FB Videos in HD | Grabr",
  description: "Download Facebook videos in high quality for free. Support for public and private videos. Fast, secure, and no sign-up required.",
};

export default function FacebookPage() {
  const faqs = [
    {
      q: "How to download Facebook videos?",
      a: "Copy the Facebook video link, paste it into Grabr, and click Download. You will see options for SD and HD quality.",
    },
    {
      q: "Can I download private Facebook videos?",
      a: "Our tool works best with public videos. For private videos, you may need a different approach depending on the privacy settings.",
    },
    {
      q: "Is Grabr safe for my device?",
      a: "Yes, we don't require any software downloads or registration, making it one of the safest ways to download videos online.",
    },
    {
      q: "Do you store the videos I download?",
      a: "No, we do not store any videos. We only facilitate the connection between your browser and the video source.",
    },
  ];

  return (
    <div className="container mx-auto px-4 pt-20 pb-32">
      <section className="text-center space-y-8 mb-16">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Facebook Video Downloader —<br />
            <span className="text-purple-500">Free & Secure</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Download Facebook videos effortlessly. Save videos from your feed 
            or shared posts in high quality with our simple web tool.
          </p>
        </div>

        <DownloadForm />
      </section>

      <section className="max-w-3xl mx-auto mt-24 space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-white/40 mt-2">Questions about saving Facebook videos.</p>
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
