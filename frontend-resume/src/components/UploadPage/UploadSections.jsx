import React, { useState, useEffect, useRef } from "react";
import { analyzeResume } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { gsap } from "gsap";

const UploadSections = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const isAllowed = (file) =>
    file &&
    [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(file.type);

  const validateAndSet = (file) => {
    if (isAllowed(file)) setSelectedFile(file);
    else setError("Please upload a PDF, DOC, or DOCX file.");
  };

  const handleFileChange = (e) => validateAndSet(e.target.files[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const timer = setInterval(() => {
        setUploadProgress((p) => (p < 90 ? p + 10 : 90));
      }, 400);

      const response = await analyzeResume(selectedFile);
      clearInterval(timer);
      setUploadProgress(100);

      setTimeout(() => {
        navigate("/analyze", { state: { analysisData: response } });
      }, 600);
    } catch (err) {
      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Failed to upload resume. Please try again."
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const aiPulseRef = useRef(null);

  useEffect(() => {
    // AI pulse glow animation on upload area
    if (aiPulseRef.current) {
      gsap.to(aiPulseRef.current, {
        scale: 1.2,
        opacity: 0.25,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24">
      {/* Floating AI Glow */}
      <div
        ref={aiPulseRef}
        className="absolute w-[500px] h-[500px] bg-[var(--text-accent-2)]/10 rounded-full blur-[180px] top-[30%] left-[10%] mix-blend-screen pointer-events-none"
      ></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-extrabold text-[var(--text-accent)] leading-tight">
            Upload Your Resume
          </h1>
          <p className="text-[var(--text-primary)]/80 text-lg max-w-md">
            Experience AI-powered insights that evaluate your resume like a
            recruiter. Get instant match scores, identify skill gaps, and
            receive personalized growth advice.
          </p>

          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {[
              "AI Match Insights",
              "Skill Gap Detection",
              "ATS Compatibility",
              "Instant Recommendations",
              "Private & Secure",
              "Fast & Accurate",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-[var(--text-primary)]/90 bg-[var(--bg-card)]/60 border border-[var(--border-soft)] rounded-md px-3 py-2 hover:border-[var(--text-accent)]/50 hover:bg-[var(--bg-card)]/80 transition"
              >
                <span className="text-[var(--text-accent)] text-lg">⚡</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          id="upload"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div
            className={`upload-card w-full max-w-md relative overflow-hidden transition-all ${
              isDragging
                ? "border-[var(--text-accent)]/70 bg-[var(--bg-card)]/80 shadow-[0_0_25px_#66FCF155]"
                : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Particle effect layer */}
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_20%_20%,#66FCF1_0%,transparent_60%)]"></div>

            <div className="relative z-10 space-y-5 text-center">
              {!selectedFile && !isUploading && (
                <>
                  <div className="icon-wrap mx-auto">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-[var(--text-accent)]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-[var(--text-primary)]/80">
                    Drag & drop or select your file
                  </p>
                  <label className="btn-accent cursor-pointer inline-block">
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-[var(--text-primary)]/60">
                    Supports PDF, DOC, DOCX
                  </p>
                </>
              )}

              {selectedFile && !isUploading && (
                <>
                  <h3 className="font-semibold text-[var(--text-accent)]">
                    {selectedFile.name}
                  </h3>
                  <p className="text-sm text-[var(--text-primary)]/70">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="btn-ghost text-[var(--text-primary)] border border-[var(--text-accent-2)]/40 hover:bg-[var(--text-accent-2)]/20"
                    >
                      Change
                    </button>
                    <button
                      onClick={handleUpload}
                      className="btn-accent px-5 py-2 font-semibold"
                    >
                      Analyze
                    </button>
                  </div>
                </>
              )}

              {isUploading && (
                <>
                  <div className="w-14 h-14 border-4 border-t-transparent border-[var(--text-accent)] rounded-full animate-spin mx-auto" />
                  <p className="font-semibold text-[var(--text-accent)]">
                    Analyzing Resume...
                  </p>
                  <p className="text-sm text-[var(--text-primary)]/70">
                    Please wait while our AI processes your data.
                  </p>
                  <div className="score-bar-wrap">
                    <div
                      className="score-bar"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-[var(--text-primary)]/60">
                    {uploadProgress}% Complete
                  </p>
                </>
              )}

              {error && (
                <div className="error-box mt-4 text-sm text-left bg-red-500/10 border border-red-500/30 text-red-300">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UploadSections;
