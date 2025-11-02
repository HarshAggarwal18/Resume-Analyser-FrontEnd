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
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
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
      </div>
    );
  }

  return (
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
        </div>
      </div>
    </div>
  );
};

export default AnalysePage;
