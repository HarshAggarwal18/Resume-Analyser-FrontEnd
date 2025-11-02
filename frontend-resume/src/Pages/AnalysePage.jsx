import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAnalyzedData } from "../services/api";

const AnalysePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(
    location.state?.analysisData || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no analysis data in location state, fetch it
    if (!analysisData && location.state?.resumeId) {
      fetchAnalysisData(location.state.resumeId);
    }
  }, []);

  const fetchAnalysisData = async (resumeId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalyzedData(resumeId);
      setAnalysisData(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load analysis data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wild-sand-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-pastel-green-200 border-t-pastel-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-wild-sand-700 font-mono">
                Loading Analysis...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-wild-sand-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
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
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Back to Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-wild-sand-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mt-20">
            <p className="text-lg text-wild-sand-700 font-mono mb-4">
              No analysis data available
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-pastel-green-600 text-white font-medium rounded-lg hover:bg-pastel-green-700 transition-colors"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wild-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-pastel-green-600 hover:text-pastel-green-700 mb-4 font-mono"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Upload
          </button>
          <h1 className="text-4xl font-bold bg-linear-to-r from-pastel-green-700 to-pastel-green-500 bg-clip-text text-transparent mb-2">
            Resume Analysis Results
          </h1>
          <p className="text-lg text-wild-sand-700 font-mono">
            Detailed insights about your resume
          </p>
        </div>

        {/* Job Match Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysisData &&
            analysisData.map((job, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                {/* Job Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-wild-sand-900 mb-2">
                    {job.title || "Position"} at {job.company}
                  </h3>
                  <div className="flex items-center text-wild-sand-600 text-sm mb-2">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-wild-sand-600 text-sm">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {job.employmentType}
                  </div>
                </div>

                {/* Match Score */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-wild-sand-900 mb-3">
                    Match Score
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Overall Score */}
                    <div className="bg-pastel-green-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-pastel-green-600 mb-1">
                          {(job.matchScore.overall * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-wild-sand-600">
                          Overall Match
                        </div>
                      </div>
                    </div>
                    {/* Skills Score */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {(job.matchScore.skillsMatch * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-wild-sand-600">
                          Skills Match
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {job.missingSkills && job.missingSkills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-wild-sand-900 mb-3">
                      Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.missingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why Fit */}
                {job.whyFit && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-wild-sand-900 mb-3">
                      Why You Fit
                    </h4>
                    <p className="text-wild-sand-700">{job.whyFit}</p>
                  </div>
                )}

                {/* Growth Areas */}
                {job.growthAreas && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-wild-sand-900 mb-3">
                      Growth Areas
                    </h4>
                    <p className="text-wild-sand-700">{job.growthAreas}</p>
                  </div>
                )}

                {/* Summary */}
                {job.summary && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-wild-sand-900 mb-2">
                      Summary
                    </h4>
                    <p className="text-wild-sand-700 text-sm">{job.summary}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysePage;
