'use client';

import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, Info, CheckCircle2, X, Loader2 } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  title: string;
  message: React.ReactNode | string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  hideCancel?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Batal',
  variant = 'danger',
  isLoading = false,
  hideCancel = false,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  // Determine variant visuals
  const config = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-rose-100 text-rose-600 border-rose-200',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      badgeLabel: 'Tindakan Berisiko / Hapus',
      confirmButton:
        'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-600/25',
      defaultConfirmText: 'Ya, Hapus Data',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-100 text-amber-600 border-amber-200',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeLabel: 'Perhatian & Konfirmasi',
      confirmButton:
        'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-lg shadow-amber-600/25',
      defaultConfirmText: 'Ya, Lanjutkan',
    },
    info: {
      icon: Info,
      iconBg: 'bg-sky-100 text-sky-600 border-sky-200',
      badge: 'bg-sky-50 text-sky-800 border-sky-200',
      badgeLabel: 'Pemberitahuan Sistem',
      confirmButton:
        'bg-[#0c233c] hover:bg-sky-900 active:bg-slate-900 text-white shadow-lg shadow-sky-950/25',
      defaultConfirmText: 'Mengerti',
    },
    success: {
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badgeLabel: 'Berhasil',
      confirmButton:
        'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/25',
      defaultConfirmText: 'Selesai',
    },
  }[variant];

  const IconComponent = config.icon;
  const resolvedConfirmText = confirmText || config.defaultConfirmText;

  const handleConfirmClick = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200 text-center"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        {!isLoading && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Icon */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-transform hover:scale-105 duration-200 ${config.iconBg}`}
          >
            <IconComponent className="w-8 h-8" />
          </div>
          <span
            className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border tracking-wider mt-1 ${config.badge}`}
          >
            {config.badgeLabel}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
            {title}
          </h3>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {typeof message === 'string' ? (
              <div className="whitespace-pre-line">{message}</div>
            ) : (
              message
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!hideCancel && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {cancelText}
            </button>
          )}

          {onConfirm && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleConfirmClick}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none ${config.confirmButton}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>{resolvedConfirmText}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
