import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import IssuesPage from "./features/issues/pages/IssuesPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route path="/issues" element={<IssuesPage />} />
      </Routes>
    </>
  );
}

export default App;
