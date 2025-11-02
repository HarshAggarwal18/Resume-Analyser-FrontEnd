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
<<<<<<< HEAD
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-[#66fcf1] rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[#c5c6c7] text-xl font-semibold">
            Loading Analysis...
          </p>
=======
      <div className="page-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full skeleton mx-auto mb-4"></div>
              <p className="text-lg text-[var(--color-wild-sand-700)] font-semibold">
                Loading Analysis...
              </p>
            </div>
          </div>
>>>>>>> e211079a3765f239794a036e5a99e118d791fa26
        </div>
      </div>
    );
  }

  if (error) {
    return (
<<<<<<< HEAD
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
=======
      <div className="page-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[var(--color-wild-sand-50)] border border-[var(--color-wild-sand-200)] rounded-lg p-6 mt-8">
            <div className="flex items-start gap-4">
              <svg
                className="w-5 h-5 text-[var(--color-bright-sun-600)] mr-2 shrink-0 mt-0.5"
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
                <p className="text-sm font-semibold text-[var(--color-wild-sand-800)]">
                  Error
                </p>
                <p className="text-sm text-[var(--color-wild-sand-700)]">
                  {error}
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 btn-accent"
                >
                  Back to Upload
                </button>
              </div>
            </div>
          </div>
>>>>>>> e211079a3765f239794a036e5a99e118d791fa26
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0c10] text-[#c5c6c7]">
        <p className="text-lg font-semibold mb-4">No analysis data available</p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#45a29e] hover:bg-[#66fcf1] text-[#0b0c10] font-semibold py-2 px-6 rounded-lg transition"
        >
          Upload Resume
        </button>
=======
      <div className="page-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mt-20">
            <p className="text-lg text-[var(--color-wild-sand-700)] font-semibold mb-4">
              No analysis data available
            </p>
            <button onClick={() => navigate("/")} className="btn-accent">
              Upload Resume
            </button>
          </div>
        </div>
>>>>>>> e211079a3765f239794a036e5a99e118d791fa26
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="page-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-[var(--color-wild-sand-700)] hover:text-[var(--color-wild-sand-900)] mb-4"
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
          <h1 className="text-4xl font-extrabold text-[var(--color-wild-sand-900)] mb-2">
            Resume Analysis Results
          </h1>
          <p className="text-lg text-[var(--color-wild-sand-600)]">
            Detailed insights about your resume
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {analysisData &&
            analysisData.map((job, index) => {
              const overall = Math.round((job.matchScore?.overall ?? 0) * 100);
              const skills = Math.round(
                (job.matchScore?.skillsMatch ?? 0) * 100
              );
              return (
                <div key={index} className="analysis-card-strong">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".75rem",
                          marginBottom: ".25rem",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "1.125rem",
                            fontWeight: 700,
                            color: "inherit",
                          }}
                        >
                          {job.title || "Position"}
                        </h3>
                        <div className="job-badge">{job.employmentType}</div>
                      </div>
                      <div className="muted" style={{ marginBottom: ".75rem" }}>
                        {job.company} · {job.location}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: ".75rem",
                          marginBottom: ".75rem",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: ".4rem",
                            }}
                          >
                            <div className="muted">Overall Match</div>
                            <div className="metric-pill">{overall}%</div>
                          </div>
                          <div className="score-bar-wrap">
                            <div
                              className="score-bar"
                              style={{ width: `${overall}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: ".4rem",
                            }}
                          >
                            <div className="muted">Skills Match</div>
                            <div className="metric-pill">{skills}%</div>
                          </div>
                          <div className="score-bar-wrap">
                            <div
                              className="score-bar"
                              style={{ width: `${skills}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {job.summary && (
                        <div
                          style={{
                            marginTop: ".5rem",
                            marginBottom: ".5rem",
                            background: "rgba(255,255,255,0.02)",
                            padding: ".75rem",
                            borderRadius: ".5rem",
                          }}
                        >
                          <div
                            style={{ fontWeight: 700, marginBottom: ".35rem" }}
                          >
                            Summary
                          </div>
                          <div className="muted">{job.summary}</div>
                        </div>
                      )}
                    </div>

                    <div style={{ width: "220px", flexShrink: 0 }}>
                      {job.missingSkills && job.missingSkills.length > 0 && (
                        <div style={{ marginBottom: ".75rem" }}>
                          <div
                            style={{ fontWeight: 700, marginBottom: ".4rem" }}
                          >
                            Missing Skills
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: ".4rem",
                            }}
                          >
                            {job.missingSkills.map((s, i) => (
                              <span
                                key={i}
                                style={{
                                  padding: ".25rem .5rem",
                                  borderRadius: ".375rem",
                                  background: "rgba(255,85,85,0.06)",
                                  color: "var(--color-wild-sand-50)",
                                  fontSize: ".85rem",
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.whyFit && (
                        <div style={{ marginBottom: ".6rem" }}>
                          <div
                            style={{ fontWeight: 700, marginBottom: ".35rem" }}
                          >
                            Why You Fit
                          </div>
                          <div className="muted" style={{ fontSize: ".95rem" }}>
                            {job.whyFit}
                          </div>
                        </div>
                      )}

                      {job.growthAreas && (
                        <div>
                          <div
                            style={{ fontWeight: 700, marginBottom: ".35rem" }}
                          >
                            Growth Areas
                          </div>
                          <div className="muted" style={{ fontSize: ".95rem" }}>
                            {job.growthAreas}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
>>>>>>> e211079a3765f239794a036e5a99e118d791fa26
        </div>
      </div>
    </div>
  );
};

export default AnalysePage;
