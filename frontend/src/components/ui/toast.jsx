'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
const icons = {
  info: <Info className="h-4 w-4 text-[var(--accent)]" />,
  success: <CheckCircle className="h-4 w-4 text-[var(--success)]" />,
  warning: <AlertTriangle className="h-4 w-4 text-[var(--warning)]" />,
  error: <AlertCircle className="h-4 w-4 text-[var(--danger)]" />
};
const bgColors = {
  info: 'border-l-[var(--accent)]',
  success: 'border-l-[var(--success)]',
  warning: 'border-l-[var(--warning)]',
  error: 'border-l-[var(--danger)]'
};
function Toast({
  id,
  message,
  variant,
  onDismiss
}) {
  return <div className={cn('flex items-start gap-3 w-full max-w-sm p-4 bg-[var(--surface)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border border-[var(--border)] border-l-4', bgColors[variant])} role="alert">
      <span className="mt-0.5 shrink-0">{icons[variant]}</span>
      <p className="flex-1 text-sm text-[var(--text-primary)]">{message}</p>
      <button onClick={() => onDismiss(id)} className="shrink-0 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" aria-label="Dismiss">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>;
}

/* ---------- Toast Container + Context ---------- */

const ToastContext = React.createContext(null);
export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
export function ToastProvider({
  children
}) {
  const [toasts, setToasts] = React.useState([]);
  const dismiss = React.useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  const toast = React.useCallback((message, variant = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, {
      id,
      message,
      variant,
      duration
    }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);
  return <ToastContext.Provider value={{
    toast
  }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => <div key={t.id} className="pointer-events-auto">
            <Toast {...t} onDismiss={dismiss} />
          </div>)}
      </div>
    </ToastContext.Provider>;
}