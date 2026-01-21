import React from "react";
import { Refine, Authenticated } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import "./App.css";

import { authProvider } from "./providers/authProvider";
import Dashboard from "./pages/dashboard";
import { Login } from "./pages/login";
import { AccountSettings } from "./pages/settings";
import { CreateAccount } from "./pages/create-account";
import { Overview } from "./pages/overview";

/**
 * App Component
 * Handelt de routing en authenticatie af voor de Kensan applicatie.
 */
function App() {
  return (
    <BrowserRouter>
      <Refine
        authProvider={authProvider}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <Routes>
          <Route
            element={
              <Authenticated
                key="authenticated-routes"
                fallback={<Navigate to="/login" replace />}
              >
                {/* De Outlet rendert de actieve route component */}
                <Outlet />
              </Authenticated>
            }
          >
            {/* Beveiligde routes: Alleen toegankelijk na login */}
            <Route path="/" element={<Dashboard />} />
            
            {/* De route voor de fabrieksvisualisatie */}
            <Route path="/overview" element={<Overview />} /> 
            
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/create-account" element={<CreateAccount />} />
          </Route>

          <Route
            element={
              <Authenticated key="auth-pages" fallback={<Outlet />}>
                <Navigate to="/" replace />
              </Authenticated>
            }
          >
            {/* Publieke routes: Alleen toegankelijk als NIET ingelogd */}
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;