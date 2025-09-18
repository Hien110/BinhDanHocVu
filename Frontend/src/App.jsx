// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import AppRoute from "./config/routes";
import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      <React.Suspense fallback={<div className="p-6">Đang tải...</div>}>
        <Routes>
          {AppRoute.map((route, index) => {
            const Layout = route.layout || React.Fragment; // <-- chỉ coi là component
            const Page = route.page;

            const element = (
              <Layout>
                <Page />
              </Layout>
            );

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  route.allowedRoles ? (
                    <ProtectedRoute allowedRoles={route.allowedRoles}>
                      {element}
                    </ProtectedRoute>
                  ) : (
                    element
                  )
                }
              />
            );
          })}
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
