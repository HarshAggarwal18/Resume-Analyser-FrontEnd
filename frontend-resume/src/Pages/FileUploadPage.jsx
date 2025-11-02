import React from "react";
import UploadSections from "../components/UploadPage/UploadSections";

const FileUploadPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-[#45a29e]/20 bg-[#1f2833]/90 backdrop-blur-md shadow-md">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold text-[#66fcf1] tracking-wide">
            Resume<span className="text-[#45a29e]">AI</span>
          </div>
          <span className="text-sm text-[#c5c6c7]/70">
            Analyze · Improve · Apply
          </span>
        </div>

        <a
          href="#upload"
          className="bg-[#45a29e] hover:bg-[#66fcf1] text-[#0b0c10] font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md"
        >
          Analyze Resume
        </a>
      </header>

      {/* Main */}
      <main className="flex-grow">
        <UploadSections />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#c5c6c7]/50 border-t border-[#45a29e]/20 bg-[#1f2833]/50">
        © {new Date().getFullYear()} ResumeAI — Empowering smart career growth
      </footer>
    </div>
  );
};

export default FileUploadPage;
