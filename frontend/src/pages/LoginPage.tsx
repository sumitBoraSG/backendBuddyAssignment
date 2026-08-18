import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  UserCircle,
  Sparkles,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await login(email.trim(), password);
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-teal-500/20 to-blue-500/20 border border-cyan-500/30 mb-4 shadow-lg shadow-cyan-500/10">
              <LockKeyhole className="w-7 h-7 text-cyan-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white m-0 mb-2">
              Welcome to DocPulse
            </h1>
            <p className="text-sm text-slate-400">
              Sign in to manage appointments, patients, and healthcare services
            </p>
          </div>

          {/* Quick Fill Demo Badges */}
          <div className="mb-6 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Quick Demo Accounts
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Click to autofill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("admin@example.com", "Password123!")}
                className="px-2.5 py-1.5 rounded-lg bg-purple-950/30 hover:bg-purple-900/50 border border-purple-800/40 text-purple-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
              >
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                Admin
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("robert@example.com", "Password123!")}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-800/40 text-cyan-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Stethoscope className="w-3 h-3 text-cyan-400" />
                Doctor
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("john@example.com", "Password123!")}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
              >
                <UserCircle className="w-3 h-3 text-emerald-400" />
                Patient
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-rose-500/60 focus:ring-rose-500/30 text-rose-100"
                      : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500">Min. 8 characters</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-rose-500/60 focus:ring-rose-500/30 text-rose-100"
                      : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:via-teal-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Protected by Rate Limiter & JWT Role-Based Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
