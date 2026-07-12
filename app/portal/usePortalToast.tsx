"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastInput = Omit<ToastItem, "id">;

type ToastContextValue = {
  toast: (input: ToastInput) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_TIMEOUT = 3800;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
      setToasts((current) => [...current, { ...input, id }]);
      timers.current[id] = setTimeout(() => dismiss(id), TOAST_TIMEOUT);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      dismiss,
      success: (title, description) => toast({ title, description, variant: "success" }),
      error: (title, description) => toast({ title, description, variant: "error" }),
      info: (title, description) => toast({ title, description, variant: "info" }),
    }),
    [toast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

const toastVariants: Record<ToastVariant, { ring: string; icon: ReactNode; iconColor: string }> = {
  success: {
    ring: "border-[#bfe9da] bg-[#f3fdf9]",
    icon: <CheckCircle2 aria-hidden="true" className="h-5 w-5" />,
    iconColor: "text-[#0a7a68]",
  },
  error: {
    ring: "border-[#f2d3d8] bg-[#fff7f8]",
    icon: <AlertTriangle aria-hidden="true" className="h-5 w-5" />,
    iconColor: "text-[#b42318]",
  },
  info: {
    ring: "border-[#d8e6e3] bg-[#fbfefd]",
    icon: <Info aria-hidden="true" className="h-5 w-5" />,
    iconColor: "text-[#0d7b68]",
  },
};

function Toaster({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,380px)] flex-col gap-2.5 max-[640px]:left-4 max-[640px]:right-4">
      {toasts.map((item) => {
        const variant = toastVariants[item.variant];

        return (
          <div
            key={item.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-[16px] border p-4 shadow-[0_18px_48px_rgba(4,39,36,0.14)] backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-2",
              variant.ring,
            )}
          >
            <span className={cn("mt-0.5 shrink-0", variant.iconColor)}>{variant.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.92rem] font-black text-[#10252b]">{item.title}</p>
              {item.description ? (
                <p className="m-0 mt-1 text-[0.84rem] leading-[1.5] text-[#5f7378]">{item.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => onDismiss(item.id)}
              className="shrink-0 rounded-md p-1 text-[#5f7378] transition hover:bg-black/5 hover:text-[#10252b]"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
