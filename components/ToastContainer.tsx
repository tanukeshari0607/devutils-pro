"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { subscribeToast } from "@/lib/toast";

interface ToastItem {
  id: number;
  message: string;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const unsubscribe = subscribeToast((message) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2200);
    });
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl text-sm text-slate-100 animate-toast-in"
        >
          <CheckCircle2 size={15} className="text-green-400 shrink-0" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
