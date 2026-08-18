'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';
import { X } from 'lucide-react';

/* ---------- Dialog Overlay ---------- */

function Dialog({
  open,
  onClose,
  children,
  className
}) {
  // Close on escape
  React.useEffect(() => {
    if (!open) return;
    const handleEscape = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={onClose} aria-hidden="true" />
      {/* Content */}
      <div className={cn('relative z-[var(--z-modal)] w-full max-w-lg bg-[var(--surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] animate-in zoom-in-95 fade-in', className)} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>;
}

/* ---------- Dialog Header ---------- */
function DialogHeader({
  className,
  children,
  ...props
}) {
  return <div className={cn('flex flex-col gap-1.5 p-6 pb-0', className)} {...props}>
      {children}
    </div>;
}

/* ---------- Dialog Title ---------- */
function DialogTitle({
  className,
  ...props
}) {
  return <h2 className={cn('text-lg font-semibold text-[var(--text-primary)]', className)} {...props} />;
}

/* ---------- Dialog Body ---------- */
function DialogBody({
  className,
  ...props
}) {
  return <div className={cn('p-6', className)} {...props} />;
}

/* ---------- Dialog Footer ---------- */
function DialogFooter({
  className,
  ...props
}) {
  return <div className={cn('flex items-center justify-end gap-3 p-6 pt-0', className)} {...props} />;
}

/* ---------- Dialog Close Button ---------- */
function DialogClose({
  onClose,
  className
}) {
  return <button onClick={onClose} className={cn('absolute top-4 right-4 p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)] transition-colors', className)} aria-label="Close dialog">
      <X className="h-4 w-4" />
    </button>;
}
export { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose };