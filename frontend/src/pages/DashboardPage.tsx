import React, { useState } from "react";
import {
  User,
  Shield,
  Stethoscope,
  UserCheck,
  LogOut,
  Key,
  Copy,
  Check,
  Calendar,
  Clock,
  HeartPulse,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const DashboardPage: React.FC = () => {
  const { user, token, logout, isLoading } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRoleTheme = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return {
          gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
          border: "border-purple-500/30",
          badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          accent: "text-purple-400",
          icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
        };
      case "DOCTOR":
        return {
          gradient: "from-cyan-500/20 via-teal-500/10 to-transparent",
          border: "border-cyan-500/30",
          badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
          accent: "text-cyan-400",
          icon: <Stethoscope className="w-5 h-5 text-cyan-400" />,
        };
      case "PATIENT":
      default:
        return {
          gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
          border: "border-emerald-500/30",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          accent: "text-emerald-400",
          icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
        };
    }
  };

  const theme = getRoleTheme(user?.role);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Welcome Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${theme.gradient} bg-slate-900/60 border ${theme.border} p-6 sm:p-10 shadow-2xl backdrop-blur-xl`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Authentication Session Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight m-0">
              Welcome, {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.email}!
            </h1>

            <p className="text-slate-400 text-sm max-w-xl">
              You are logged in as a verified{" "}
              <span className="font-semibold text-slate-200 uppercase">{user?.role}</span> in the Doctor
              Appointment Booking System.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              disabled={isLoading}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: User Profile & Session Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 m-0">
              <User className="w-4 h-4 text-cyan-400" />
              User Profile
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${theme.badge}`}
            >
              {theme.icon}
              {user?.role}
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Full Name
              </span>
              <p className="text-slate-200 font-semibold">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Not provided"}
              </p>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Email Address
              </span>
              <p className="text-slate-200 font-semibold font-mono text-xs break-all">
                {user?.email}
              </p>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Account ID
              </span>
              <p className="text-slate-200 font-mono text-xs bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80 inline-block">
                #{user?.id}
              </p>
            </div>
          </div>
        </div>

        {/* JWT Session Details */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 m-0">
              <Key className="w-4 h-4 text-cyan-400" />
              JWT Authorization Token
            </h2>
            <button
              onClick={handleCopyToken}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Token</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              This Bearer token is automatically attached to outgoing requests to authenticate against the REST API.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300/90 break-all select-all max-h-32 overflow-y-auto">
              {token || "No token available"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Algorithm</span>
                <span className="text-xs font-semibold text-slate-200 font-mono">HS256</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Token Expiry</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  1 Hour
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Header Protocol</span>
                <span className="text-xs font-semibold text-slate-200 font-mono">Bearer &lt;JWT&gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Feature Cards Preview */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight m-0">Platform Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 m-0">Admin Controls</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create and manage doctor records, patient databases, and system invitations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
              <HeartPulse className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 m-0">Doctor Schedule</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage slot availability, time ranges, and view upcoming patient consultations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 m-0">Patient Booking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore specialized doctors, browse available time slots, and schedule appointments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
