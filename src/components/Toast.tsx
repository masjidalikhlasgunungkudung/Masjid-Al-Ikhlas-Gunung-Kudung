import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none">
      <div className="bg-amber-400 text-stone-950 font-semibold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-amber-300">
        <CheckCircle2 className="w-4 h-4 text-stone-900 shrink-0" />
        <span className="leading-snug">{message}</span>
      </div>
    </div>
  );
};
