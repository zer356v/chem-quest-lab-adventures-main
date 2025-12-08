import { Download, Monitor } from "lucide-react";

export default function DownloadSection() {
  return (
    <section className="w-full py-24 bg-gradient-to-b from-[#0a0a0a] to-[#121212] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Download Reactron Virtual Lab
        </h2>

        <p className="text-gray-400 mt-4 max-w-2xl">
          Install our Windows app and experience the fastest, most immersive
          virtual chemistry lab environment. Works online, lightweight, and secure.
        </p>

        <div className="mt-10 flex flex-col md:flex-row items-center gap-6">

          {/* Windows Download Card */}
          <a
            href="https://reactron.visualstech.in/downloads/ReactronLauncherSetup.exe"

            download
            className="group w-full md:w-auto px-8 py-5 rounded-xl bg-[#1a1a1a] border border-white/10 hover:border-white/20 hover:bg-[#222] transition-all flex items-center gap-4"
          >
            <Monitor className="w-8 h-8 text-blue-400 group-hover:scale-110 transition" />
            <div className="text-left">
              <p className="text-white font-semibold text-lg">
                Download for Windows 11 / 10
              </p>
              <p className="text-gray-400 text-sm">64-bit Installer</p>
            </div>
            <Download className="w-6 h-6 text-white opacity-70 group-hover:opacity-100 transition ml-4" />
          </a>

        </div>

        <p className="text-xs text-gray-500 mt-4">
          Version 1.0.0 · Online-only · Auto-updates supported
        </p>

      </div>
    </section>
  );
}
