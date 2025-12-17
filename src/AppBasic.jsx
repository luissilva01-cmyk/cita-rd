import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import BasicTest from "./pages/BasicTest";

export default function AppBasic() {
  console.log('AppBasic rendering');

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<BasicTest />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}