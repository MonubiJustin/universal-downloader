import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Grabr — Download Any Video Free | YouTube Instagram TikTok",
  description: "Free online video downloader. Paste any link from YouTube, Instagram, TikTok, Facebook and 1000+ sites. No signup. No software.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0a0a0a] text-white selection:bg-purple-500/30">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tighter text-white">
              Grabr<span className="text-purple-500">.</span>
            </span>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
