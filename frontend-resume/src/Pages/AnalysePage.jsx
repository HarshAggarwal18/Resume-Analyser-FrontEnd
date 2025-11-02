import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAnalyzedData } from "../services/api";

const safeArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    return val
      .split(/\n|,|•|-\s|·/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const toPercent = (val) => {
  if (val == null || isNaN(val)) return 0;
  const num = Number(val);
  if (num <= 1) return Math.round(num * 100);
  return Math.round(Math.min(num, 100));
};

const AnalysePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(
    location.state?.analysisData ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!analysisData && location.state?.resumeId) {
      fetchAnalysisData(location.state.resumeId);
    }
  }, []);

  const fetchAnalysisData = async (resumeId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalyzedData(resumeId);
      setAnalysisData(data ?? []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load analysis data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const items = useMemo(() => {
    if (!analysisData) return [];
    return Array.isArray(analysisData) ? analysisData : [analysisData];
  }, [analysisData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-[#66fcf1] rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[#c5c6c7] text-xl font-semibold">
            Loading Analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="bg-[#1f2833] border border-[#45a29e]/30 rounded-xl p-8 max-w-md w-full shadow-2xl text-center">
          <h3 className="text-[#66fcf1] font-bold text-xl mb-2">Error</h3>
          <p className="text-[#c5c6c7]/80 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#45a29e] hover:bg-[#66fcf1] text-[#0b0c10] font-semibold py-2 px-6 rounded-lg transition"
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0c10] text-[#c5c6c7]">
        <p className="text-lg font-semibold mb-4">No analysis data available</p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#45a29e] hover:bg-[#66fcf1] text-[#0b0c10] font-semibold py-2 px-6 rounded-lg transition"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] py-14 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-extrabold text-[#66fcf1]">
              Resume Analysis Results
            </h1>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center text-[#45a29e] hover:text-[#66fcf1] transition"
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
          </div>
          <p className="text-[#c5c6c7]/80 text-lg">
            Detailed, AI-powered insights about your resume match performance.
          </p>
        </motion.div>

        {/* Feature Highlights */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 text-center"
        >
          {[
            { icon: "🧠", label: "AI-Powered Analysis" },
            { icon: "⚙️", label: "Skill Gap Detection" },
            { icon: "📈", label: "Match Score Insights" },
            { icon: "💡", label: "Actionable Growth Tips" },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-[#1f2833]/80 border border-[#45a29e]/20 rounded-xl p-4 hover:border-[#66fcf1]/40 transition"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-semibold text-[#66fcf1]">
                {f.label}
              </div>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Analysis Cards */}
        <div className="space-y-8">
          {items.map((job, index) => {
            const overallPct = toPercent(job?.matchScore?.overall);
            const skillsMatchPct = toPercent(job?.matchScore?.skillsMatch);
            const matchingSkills =
              safeArray(job?.matchingSkills) ||
              safeArray(job?.matchedSkills) ||
              safeArray(job?.skills);
            const missingSkills = safeArray(job?.missingSkills);
            const growthAreas = safeArray(job?.growthAreas);
            const whyFitLines = safeArray(job?.whyFit);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="bg-[#1f2833]/90 backdrop-blur-md border border-[#45a29e]/30 rounded-xl p-5 hover:border-[#66fcf1]/40 hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center border-b border-[#45a29e]/10 pb-3 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {job?.title}
                    </h2>
                    <p className="text-sm text-[#c5c6c7]/70">
                      {job?.employmentType} · {job?.company} · {job?.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-[#66fcf1]">
                      {overallPct}%
                    </div>
                    <p
                      className={`text-sm ${
                        overallPct >= 70
                          ? "text-green-400"
                          : overallPct >= 50
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {overallPct >= 70
                        ? "Excellent Match"
                        : overallPct >= 50
                        ? "Good Match"
                        : "Needs Improvement"}
                    </p>
                  </div>
                </div>

                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Why Fit */}
                  <div>
                    <h3 className="text-[#66fcf1] font-semibold mb-2 flex items-center gap-2">
                      🌟 Why it’s a great fit
                    </h3>
                    <ul className="space-y-1 text-sm text-[#c5c6c7]/90 leading-relaxed">
                      {whyFitLines.length ? (
                        whyFitLines.map((line, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-green-400">•</span>
                            <span>{line}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-[#c5c6c7]/60">
                          No details provided.
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <h3 className="text-[#66fcf1] font-semibold mb-2">
                      Matching Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {matchingSkills.length ? (
                        matchingSkills.map((s, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-[#0b0c10]/60 border border-[#45a29e]/40 rounded-full text-xs text-[#66fcf1]"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[#c5c6c7]/60">
                          None detected.
                        </span>
                      )}
                    </div>

                    {missingSkills.length > 0 && (
                      <>
                        <h4 className="text-[#ff6b6b] font-semibold mt-4 mb-1 text-sm">
                          Missing Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {missingSkills.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-[#ff6b6b]/10 text-[#ff6b6b] text-xs rounded-md border border-[#ff6b6b]/30"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Growth + Stats */}
                  <div>
                    <h3 className="text-[#66fcf1] font-semibold mb-2">
                      Growth Areas
                    </h3>
                    {growthAreas.length ? (
                      <ul className="space-y-1 text-sm text-[#c5c6c7]/90">
                        {growthAreas.map((g, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-orange-400">•</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#c5c6c7]/60">
                        No growth suggestions found.
                      </p>
                    )}

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#c5c6c7]/70">Skills Match</span>
                        <span className="text-[#66fcf1] font-semibold">
                          {skillsMatchPct}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#0b0c10] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skillsMatchPct}%` }}
                          transition={{ duration: 0.9 }}
                          className="h-full bg-gradient-to-r from-[#66fcf1] to-[#45a29e]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-fit bg-[#45a29e] hover:bg-[#66fcf1] text-[#0b0c10] font-semibold py-1.5 px-4 rounded-lg text-sm transition-all"
                    >
                      View Job Details
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalysePage;
