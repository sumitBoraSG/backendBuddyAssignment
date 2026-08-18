import React from "react";
import { Activity, LogOut, ShieldCheck, Stethoscope, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "DOCTOR":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "PATIENT":
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case "DOCTOR":
        return <Stethoscope className="w-3.5 h-3.5" />;
      case "PATIENT":
      default:
        return <UserCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                DocPulse
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Doctor Appointment & Healthcare Platform</p>
          </div>
        </div>

        {/* User Info / Actions */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {user.firstName ? user.firstName[0]?.toUpperCase() : user.email[0]?.toUpperCase()}
              </div>

              <div className="text-left hidden md:block">
                <div className="text-xs font-medium text-slate-200 truncate max-w-[150px]">
                  {user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.email}
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  {user.email}
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {getRoleIcon(user.role)}
                {user.role}
              </span>
            </div>

            <button
              onClick={() => logout()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-rose-950/30 active:scale-95 disabled:opacity-50"
              title="Logout from portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
