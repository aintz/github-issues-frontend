import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import IssuesPage from "./features/issues/pages/IssuesPage";
import Header from "./components/header";
function App() {
  return (
    <main className="bg-gh-bg text-gh-text min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route path="/issues" element={<IssuesPage />} />
      </Routes>
    </main>
  );
}

export default App;
