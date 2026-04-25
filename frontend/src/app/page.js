import Header from '@/components/Header';
import DownloadForm from '@/components/DownloadForm';

export default function Home() {
    return (
        <main className="min-h-screen py-10">
            <div className="container mx-auto max-w-6xl">
                <Header />
                <div className="mt-12">
                    <DownloadForm />
                </div>
                
                <footer className="mt-24 text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} Universal Downloader. Built with speed and privacy in mind.</p>
                </footer>
            </div>
        </main>
    );
}
