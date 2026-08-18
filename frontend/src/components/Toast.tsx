import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Toast: React.FC = () => {
  const { notification, setNotification } = useAuth();

  if (!notification) return null;

  const isSuccess = notification.type === "success";
  const isError = notification.type === "error";

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 transition-all ${
          isSuccess
            ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50"
            : isError
            ? "bg-rose-950/80 border-rose-500/40 text-rose-100 shadow-rose-950/50"
            : "bg-slate-900/80 border-cyan-500/40 text-cyan-100 shadow-slate-950/50"
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-cyan-400" />}
        </div>

        <div className="flex-1 text-sm font-medium leading-relaxed">
          {notification.message}
        </div>

        <button
          onClick={() => setNotification(null)}
          className="shrink-0 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
