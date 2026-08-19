import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Toast } from "./components/Toast";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Toast />
      <Navbar />
      <main className="flex-1">
        {isAuthenticated ? <DashboardPage /> : <LoginPage />}
      </main>
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        Doctor Appointment & Healthcare Platform &copy; {new Date().getFullYear()} DocPulse
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
