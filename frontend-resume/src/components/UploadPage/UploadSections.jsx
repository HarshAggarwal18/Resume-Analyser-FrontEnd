import React, { useState } from "react";
import { analyzeResume } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UploadSections = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

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
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setSelectedFile(file);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : 90));
      }, 400);

      const response = await analyzeResume(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        navigate("/analyze", { state: { analysisData: response } });
      }, 700);
    } catch (err) {
      console.error("Analyze failed:", err);
      const serverMessage =
        err.message || err.response?.data || err.response?.data?.message;
      setError(
        typeof serverMessage === "string"
          ? serverMessage
          : JSON.stringify(serverMessage)
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <section className="bg-[#0b0c10] text-[#c5c6c7] py-20 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-extrabold text-[#66fcf1] leading-tight">
            AI Resume <span className="text-[#45a29e]">Analyzer</span>
          </h1>

          <p className="text-lg text-[#c5c6c7]/80 max-w-md">
            Transform your resume into actionable insights. Get instant match
            scores, missing skills, and personalized suggestions powered by our
            AI engine.
          </p>

          <div className="flex items-center space-x-4">
            <a
              href="#upload"
              className="bg-[#45a29e] hover:bg-[#66fcf1] text-white font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md"
            >
              Upload Resume
            </a>
            <div className="text-sm text-[#c5c6c7]/70 leading-tight">
              <div>Fast · Secure · Private</div>
              <div>Average Analysis Time: ~20s</div>
            </div>
          </div>

          <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-[#c5c6c7]/80">
            {[
              "AI-Powered Insights",
              "Skill Gap Detection",
              "Smart Scoring",
              "Growth Recommendations",
              "Instant Feedback",
              "Career Optimization",
            ].map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 bg-[#1f2833]/60 border border-[#45a29e]/20 rounded-md px-3 py-2 hover:border-[#66fcf1]/40 transition"
              >
                <span className="text-[#66fcf1]">✔</span> {feature}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          id="upload"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center"
        >
          <div
            className={`w-full max-w-md rounded-2xl p-6 border ${
              isDragging
                ? "border-[#66fcf1]/70 bg-[#1f2833]/80"
                : "border-[#45a29e]/30 bg-[#1f2833]"
            } shadow-lg transition-all`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-6">
              {/* Upload States */}
              {!selectedFile ? (
                <>
                  <div className="text-[#66fcf1] flex justify-center">
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-[#c5c6c7]/80">Drag & drop or</p>
                  <label className="cursor-pointer bg-[#45a29e] hover:bg-[#66fcf1] text-[#0b0c10] font-semibold px-4 py-2 rounded-lg transition-all inline-block">
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-[#c5c6c7]/60">
                    Supported: PDF, DOC, DOCX
                  </p>
                </>
              ) : isUploading ? (
                <>
                  <div className="w-16 h-16 border-4 border-t-transparent border-[#66fcf1] rounded-full animate-spin mx-auto"></div>
                  <p className="text-lg font-semibold">Analyzing Resume...</p>
                  <p className="text-sm text-[#c5c6c7]/70">
                    Please wait a few seconds.
                  </p>
                  <div className="w-full h-2 bg-[#0b0c10] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#45a29e] to-[#66fcf1] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-[#c5c6c7]/70">
                    {uploadProgress}% Complete
                  </p>
                </>
              ) : (
                <>
                  <div className="text-[#66fcf1] mb-2 text-lg font-semibold">
                    {selectedFile.name}
                  </div>
                  <p className="text-sm text-[#c5c6c7]/60 mb-4">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="border border-[#45a29e]/40 text-[#66fcf1] px-4 py-2 rounded-lg hover:bg-[#45a29e]/10 transition-all"
                    >
                      Change
                    </button>
                    <button
                      onClick={handleUpload}
                      className="bg-[#45a29e] hover:bg-[#66fcf1] text-[#0b0c10] font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                      Analyze Resume
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-5 bg-red-900/30 border border-red-700/50 text-red-200 rounded-lg p-3 text-sm text-left">
                <strong className="text-red-300 block mb-1">Error:</strong>
                {error}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UploadSections;
