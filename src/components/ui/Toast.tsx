"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Info, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
}

const toastIcons = {
  success: <CheckCircle2 className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
};

const toastColors = {
  success: "bg-green-500/20 border-green-500/40 text-green-100",
  error: "bg-red-500/20 border-red-500/40 text-red-100",
  info: "bg-blue-500/20 border-blue-500/40 text-blue-100",
  warning: "bg-amber-500/20 border-amber-500/40 text-amber-100",
};

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg ${toastColors[type]}`}
    >
      <div className="flex-shrink-0">{toastIcons[type]}</div>
      <div className="text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 text-white/60 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </AnimatePresence>
  );
}

type ToastOptions = Omit<ToastProps, "message">;

let toastId = 0;

// Create a toast context for global access
const ToastContext = React.createContext<{
  showToast: (message: string, options?: ToastOptions) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (message: string, options: ToastOptions = { type: "info" }) => {
    const id = (toastId++).toString();
    setToasts((prev) => [...prev, { ...options, message, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.showToast;
}
