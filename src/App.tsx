import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import IssuesPage from "./features/issues/pages/IssuesPage";
import Header from "./components/header";
import IssuesDetailPage from "./features/issues/pages/IssuesDetailPage";
function App() {
  return (
    <main className="bg-gh-bg text-gh-text min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/:number" element={<IssuesDetailPage />} />
      </Routes>
    </main>
  );
}

export default App;
