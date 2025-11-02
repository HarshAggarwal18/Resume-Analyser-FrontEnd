import React, { useState } from "react";
import { analyzeResume } from "../../services/api";
import { useNavigate } from "react-router-dom";

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
    if (selectedFile) {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        // Create progress tracking
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => (prev < 90 ? prev + 10 : 90));
        }, 500);

        // Call the API to analyze resume
        const response = await analyzeResume(selectedFile);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Wait a bit for the progress bar to show 100%
        setTimeout(() => {
          // Navigate to analysis page with the results
          navigate("/analyze", {
            state: { analysisData: response },
          });
        }, 500);
      } catch (err) {
        // show detailed server message when available
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
    }
  };

  return (
    <div className="app-bg">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Hero */}
          <div className="space-y-6 px-4 lg:px-0">
            <h1 className="text-5xl font-extrabold leading-tight text-white">
              AI Resume Analyzer
            </h1>
            <p className="text-lg text-slate-200 max-w-xl">
              Turn your resume into actionable insights. Get job-match scores,
              missing skills and tailored suggestions powered by our AI engine.
            </p>
            <div className="flex items-center space-x-4">
              <a
                className="inline-flex items-center px-5 py-3 bg-linear-to-r from-indigo-500 to-sky-400 text-white rounded-lg shadow-lg hover:scale-105 transition-transform font-medium"
                href="#upload"
              >
                Upload Resume
              </a>
              <div className="text-sm text-slate-300">
                <div>Fast. Secure. Insightful.</div>
                <div className="mt-1">Estimated analysis ~20s</div>
              </div>
            </div>
            <div className="mt-6 text-sm text-slate-400 max-w-md">
              <strong className="text-slate-200">Pro tip:</strong> Use a PDF or
              DOCX resume for best results. Large files may take longer.
            </div>
          </div>

          {/* Right: Upload Card */}
          <div id="upload" className="px-4 lg:px-0">
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-indigo-500 to-sky-400 opacity-10 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Upload your resume
                    </h3>
                    <p className="text-sm text-slate-300">
                      Supported: PDF, DOC, DOCX
                    </p>
                  </div>
                  <div className="text-sm text-slate-400">Secure · Private</div>
                </div>
                <div
                  className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-6 ${
                    isDragging
                      ? "border-sky-400 bg-white/3"
                      : "border-white/6 hover:border-sky-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    {!selectedFile ? (
                      <>
                        <div className="mx-auto w-14 h-14 bg-white/6 rounded-lg flex items-center justify-center mb-4">
                          <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-base text-slate-200 mb-2">
                          Drag & drop or
                        </p>
                        <label className="inline-flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg cursor-pointer hover:scale-105 transition-transform">
                          Choose File
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </>
                    ) : isUploading ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="w-14 h-14 border-4 border-slate-600 border-t-sky-400 rounded-full animate-spin"></div>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white mb-1">
                            Analyzing Resume...
                          </p>
                          <p className="text-sm text-slate-300 mb-2">
                            This can take ~20 seconds depending on file size and
                            server load. Please wait.
                          </p>
                          <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                            <div
                              className="bg-sky-400 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-slate-400">
                            {uploadProgress}% Complete
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/6 rounded-full flex items-center justify-center ring-2 ring-white/10">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white mb-1">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-slate-300 mb-4">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => {
                                setSelectedFile(null);
                                setError(null);
                              }}
                              disabled={isUploading}
                              className="px-4 py-2 bg-white/6 text-white rounded-lg hover:bg-white/10"
                            >
                              Change
                            </button>
                            <button
                              onClick={handleUpload}
                              disabled={isUploading}
                              className="px-4 py-2 bg-linear-to-r from-indigo-500 to-sky-400 text-white rounded-lg shadow"
                            >
                              Analyze Resume
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Error Message inside card to match theme */}
                {error && (
                  <div className="mt-4 bg-red-800/20 border border-red-700/30 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="ml-2">
                        <p className="text-sm font-semibold text-red-200">
                          Error
                        </p>
                        <p className="text-sm text-red-100">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSections;
