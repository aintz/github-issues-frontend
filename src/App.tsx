import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import { Suspense, lazy } from "react";

import IssuesPageSkeleton from "./features/issues/components/IssuesPageSkeleton";
import IssueDetailPageSkeleton from "./features/issues/components/IssuesDetailPageSkeleton";

const IssuesPage = lazy(() => import("./features/issues/pages/IssuesPage"));
const IssuesDetailPage = lazy(() => import("./features/issues/pages/IssuesDetailPage"));

function App() {
  return (
    <main className="bg-gh-bg text-gh-text min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route
          path="/issues"
          element={
            <Suspense fallback={<IssuesPageSkeleton />}>
              <IssuesPage />
            </Suspense>
          }
        />
        <Route
          path="/issues/:number"
          element={
            <Suspense fallback={<IssueDetailPageSkeleton />}>
              <IssuesDetailPage />
            </Suspense>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
