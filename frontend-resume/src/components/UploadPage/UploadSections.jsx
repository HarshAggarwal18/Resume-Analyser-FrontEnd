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
            <h1 className="hero-title">AI Resume Analyzer</h1>
            <p className="hero-sub">
              Turn your resume into actionable insights. Get job-match scores,
              missing skills and tailored suggestions powered by our AI engine.
            </p>
            <div className="flex items-center space-x-4">
              <a className="btn-accent" href="#upload">
                Upload Resume
              </a>
              <div className="text-sm muted">
                <div>Fast. Secure. Insightful.</div>
                <div className="mt-1">Estimated analysis ~20s</div>
              </div>
            </div>
            <div className="mt-6 text-sm muted max-w-md">
              <strong style={{ color: "var(--color-wild-sand-800)" }}>
                Pro tip:
              </strong>{" "}
              Use a PDF or DOCX resume for best results. Large files may take
              longer.
            </div>
          </div>

          {/* Right: Upload Card */}
          <div id="upload" className="px-4 lg:px-0">
            <div className="upload-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "var(--color-wild-sand-900)",
                    }}
                  >
                    Upload your resume
                  </h3>
                  <div className="muted" style={{ fontSize: ".9rem" }}>
                    Supported: PDF, DOC, DOCX
                  </div>
                </div>
                <div className="muted" style={{ fontSize: ".9rem" }}>
                  Secure · Private
                </div>
              </div>
              <div
                className={isDragging ? "upload-card dragging" : "upload-card"}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  {!selectedFile ? (
                    <>
                      <div className="icon-wrap">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#7a330d"
                          strokeWidth="1.2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-base muted mb-2">Drag & drop or</p>
                      <label className="btn-ghost">
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
                        <div className="w-14 h-14 rounded-full skeleton"></div>
                      </div>
                      <div>
                        <p
                          className="text-lg font-semibold mb-1"
                          style={{ color: "var(--color-wild-sand-900)" }}
                        >
                          Analyzing Resume...
                        </p>
                        <p className="text-sm muted mb-2">
                          This can take ~20 seconds depending on file size and
                          server load. Please wait.
                        </p>
                        <div
                          className="w-full rounded-full h-2.5 mb-2 overflow-hidden"
                          style={{
                            backgroundColor: "var(--color-wild-sand-100)",
                          }}
                        >
                          <div
                            style={{
                              width: `${uploadProgress}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg,var(--color-bright-sun-400),var(--color-bright-sun-600))",
                              transition: "width .3s",
                            }}
                          ></div>
                        </div>
                        <p className="text-sm muted">
                          {uploadProgress}% Complete
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center ring-2"
                          style={{
                            borderColor: "rgba(15,23,42,0.04)",
                            backgroundColor: "var(--color-wild-sand-50)",
                          }}
                        >
                          <svg
                            className="w-8 h-8"
                            style={{ color: "var(--color-bright-sun-600)" }}
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
                        <p
                          className="text-lg font-semibold mb-1"
                          style={{ color: "var(--color-wild-sand-900)" }}
                        >
                          {selectedFile.name}
                        </p>
                        <p className="text-sm muted mb-4">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              setError(null);
                            }}
                            disabled={isUploading}
                            className="btn-ghost"
                          >
                            Change
                          </button>
                          <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="btn-accent"
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
  );
};

export default UploadSections;
