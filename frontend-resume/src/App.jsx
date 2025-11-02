import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUploadPage from "./Pages/FileUploadPage";
import AnalysePage from "./Pages/AnalysePage";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<FileUploadPage />} />
          <Route path="/upload" element={<FileUploadPage />} />
          <Route path="/analyze" element={<AnalysePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
