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
    <div className="min-h-screen bg-wild-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-pastel-green-700 to-pastel-green-500 bg-clip-text text-transparent mb-2">
            Resume Analyzer
          </h1>
          <p className="text-lg text-wild-sand-700 font-mono">
            Match your resume with jobs from our database and get detailed
            insights
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`relative bg-white rounded-xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-pastel-green-600 bg-pastel-green-50"
              : "border-wild-sand-300 hover:border-pastel-green-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-8 text-center">
            {!selectedFile ? (
              <>
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 bg-pastel-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-pastel-green-600"
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
                </div>
                <h3 className="text-xl font-semibold text-wild-sand-900 mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-wild-sand-600 mb-4 font-mono text-sm">
                  Drag and drop your file or click to browse
                </p>
                <label className="inline-flex items-center px-6 py-2.5 bg-pastel-green-600 text-white font-medium rounded-lg hover:bg-pastel-green-700 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Choose File
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-wild-sand-500 mt-3 font-mono">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </>
            ) : isUploading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-pastel-green-200 border-t-pastel-green-600 rounded-full animate-spin"></div>
                </div>
                <div>
                  <p className="text-lg font-semibold text-wild-sand-900 mb-2 font-mono">
                    Analyzing Resume...
                  </p>
                  <p className="text-sm text-wild-sand-500 mb-2">
                    This can take ~20 seconds depending on file size and server
                    load. Please wait.
                  </p>
                  {/* Progress Bar */}
                  <div className="w-full bg-wild-sand-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-pastel-green-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-wild-sand-500 font-mono">
                    {uploadProgress}% Complete
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-pastel-green-100 rounded-full flex items-center justify-center ring-4 ring-pastel-green-200">
                    <svg
                      className="w-8 h-8 text-pastel-green-600"
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
                  <p className="text-lg font-semibold text-wild-sand-900 mb-1 font-mono">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-wild-sand-500 mb-4">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setError(null);
                      }}
                      disabled={isUploading}
                      className="px-5 py-2.5 bg-wild-sand-200 text-wild-sand-700 font-medium rounded-lg hover:bg-wild-sand-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Change
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-5 py-2.5 bg-pastel-green-600 text-white font-medium rounded-lg hover:bg-pastel-green-700 transition-colors shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Analyze Resume
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-600 mr-2 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-pastel-green-50 border border-pastel-green-200 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-pastel-green-600 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-wild-sand-900">
              What you'll get:
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-wild-sand-700">
            <div className="flex items-start group">
              <svg
                className="w-5 h-5 text-pastel-green-600 mr-2 shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Matching percentage with job requirements</span>
            </div>
            <div className="flex items-start group">
              <svg
                className="w-5 h-5 text-pastel-green-600 mr-2 shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Skills gaps & strengths identified</span>
            </div>
            <div className="flex items-start group">
              <svg
                className="w-5 h-5 text-pastel-green-600 mr-2 shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Areas for growth & improvement</span>
            </div>
            <div className="flex items-start group">
              <svg
                className="w-5 h-5 text-pastel-green-600 mr-2 shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Summary & recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSections;
