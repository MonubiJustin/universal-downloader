import DownloadForm from "@/components/DownloadForm";

export default function Home() {
  return (
    <main className="page-shell">
      <div className="ambient-glow" aria-hidden="true" />
      <section className="hero-section">
        <div className="brand-mark" aria-label="Sonora home">
          <span className="brand-icon" aria-hidden="true">◒</span>
          <span>sonora</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">YouTube audio, simplified</p>
          <h1>Keep the sound.<br /><span>Leave the noise.</span></h1>
          <p className="hero-description">
            Turn any YouTube video into high-quality audio in a few seconds.
            No formats to compare, no settings to get lost in.
          </p>
        </div>
        <DownloadForm />
      </section>
      <footer className="page-footer">
        <span><span className="footer-dot" aria-hidden="true" /> Best available audio, automatically</span>
        <span>Made for listening</span>
      </footer>
    </main>
  );
}
