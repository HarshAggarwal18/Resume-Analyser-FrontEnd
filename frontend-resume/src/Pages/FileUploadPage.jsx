import React, { useEffect, useRef } from "react";
import UploadSections from "../components/UploadPage/UploadSections";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const FileUploadPage = () => {
  const bgRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 🔹 Animate hero text
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power4.out",
      });

      gsap.from(subRef.current, {
        opacity: 0,
        y: 20,
        delay: 0.3,
        duration: 1.2,
        ease: "power3.out",
      });

      // 🔹 Floating glow orb
      gsap.to(glowRef.current, {
        x: "random(-200, 200)",
        y: "random(-150, 150)",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 🔹 Animate neural line flow
      gsap.utils.toArray(".neural-line").forEach((line, i) => {
        gsap.to(line, {
          strokeDashoffset: -2000,
          duration: 10 + i,
          ease: "none",
          repeat: -1,
        });
      });
    }, bgRef);

    return () => ctx.revert(); // ✅ cleanup on unmount
  }, []);

  return (
    <div className="page-bg relative overflow-hidden min-h-screen w-full">
      {/* 🧩 Background Neural Lines */}
      <svg
        ref={bgRef}
        className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="neon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#66FCF1" />
            <stop offset="100%" stopColor="#45A29E" />
          </linearGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => {
          const randomY = i * 120 + Math.random() * 50;
          const curve1 = Math.random() * 800;
          const curve2 = Math.random() * 800;
          return (
            <path
              key={i}
              d={`M0 ${randomY} Q${curve1} ${randomY + 100}, 2000 ${
                randomY + curve2
              }`}
              stroke="url(#neon)"
              strokeWidth="1.5"
              fill="none"
              className="neural-line"
              strokeDasharray="2000"
            />
          );
        })}
      </svg>

      {/* 🔆 Floating Glow Orb */}
      <div
        ref={glowRef}
        className="absolute w-[400px] h-[400px] bg-[#45A29E]/20 rounded-full blur-[160px] top-[25%] left-[40%] mix-blend-screen pointer-events-none"
      />

      {/* 🔝 Header */}
      <header className="header-bar border-b border-[var(--border-soft)] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[var(--text-accent)]">
            Resume<span className="text-[var(--text-accent-2)]">AI</span>
          </h1>
          <p className="text-sm text-[var(--text-primary)]">
            Analyze · Improve · Apply
          </p>
        </div>
        <a href="#upload" className="btn-accent">
          Get Started
        </a>
      </header>

      {/* 🌌 Hero Section */}
      <section className="relative flex flex-col justify-center items-center text-center min-h-[90vh] px-8">
        <h1
          ref={titleRef}
          className="text-[3rem] md:text-[4.5rem] font-extrabold text-[var(--text-accent)] leading-tight tracking-tight"
        >
          Unlock the Power of <br />
          <span className="text-[var(--text-accent-2)]">
            AI Resume Analysis
          </span>
        </h1>
        <p
          ref={subRef}
          className="text-lg md:text-xl text-[var(--text-primary)]/90 max-w-2xl mt-5"
        >
          Let intelligent algorithms evaluate your resume, identify gaps, and
          optimize your profile for top job matches — instantly.
        </p>

        <a
          href="#upload"
          className="btn-accent mt-10 px-8 py-3 text-lg shadow-lg hover:shadow-[0_0_25px_#66FCF180]"
        >
          Upload Resume →
        </a>
      </section>

      {/* 📤 Upload Section */}
      <div
        id="upload"
        className="relative z-10 w-full flex justify-center py-20 px-6 md:px-24"
      >
        <UploadSections />
      </div>

      {/* 🦶 Footer */}
      <footer className="border-t border-[var(--border-soft)] text-center py-4 text-sm text-[var(--text-primary)]/70">
        © {new Date().getFullYear()} ResumeAI — Empowering Smarter Careers
      </footer>
    </div>
  );
};

export default FileUploadPage;
