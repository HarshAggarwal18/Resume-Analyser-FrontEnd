import React from "react";
import UploadSections from "../components/UploadPage/UploadSections";

const FileUploadPage = () => {
  return (
    <div className="page-bg">
      <header className="header-bar" style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "var(--color-wild-sand-900)",
            }}
          >
            ResumeAI
          </div>
          <div className="muted">Analyze · Improve · Apply</div>
        </div>
        <div>
          <a href="#upload" className="btn-accent">
            Analyze Resume
          </a>
        </div>
      </header>
      <UploadSections />
    </div>
  );
};

export default FileUploadPage;
