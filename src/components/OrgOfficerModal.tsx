'use client';

import React from 'react';
import { OrgMember } from '@/lib/settings';
import { X, Crown, ShieldCheck, Briefcase, Building2, User, FileText, CheckCircle2 } from 'lucide-react';

interface OrgOfficerModalProps {
  member: OrgMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrgOfficerModal({ member, isOpen, onClose }: OrgOfficerModalProps) {
  if (!isOpen || !member) return null;

  const isPimpinan = member.group === 'PIMPINAN';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background */}
        <div className={`p-6 text-white relative overflow-hidden ${
          isPimpinan
            ? 'bg-gradient-to-r from-[#0c233c] via-[#10345b] to-[#164273]'
            : 'bg-gradient-to-r from-[#081a2e] to-[#0f2d4e]'
        }`}>
          {/* Subtle gold / sky decorative radial */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center p-1.5 shadow-inner">
                <img
                  src="/logo-sipikem-icon.png"
                  alt="Logo Disperindag"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300">
                  Dinas Perindustrian & Perdagangan Daerah
                </span>
                <p className="text-xs text-sky-200 font-semibold">Pemerintah Provinsi Sulawesi Utara</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card Centerpiece */}
          <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
            {/* Portrait Frame */}
            <div className="relative shrink-0">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 shadow-xl bg-slate-900 flex items-center justify-center ${
                isPimpinan ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-sky-400 ring-4 ring-sky-400/20'
              }`}>
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#081a2e] to-[#163a63] text-sky-300">
                    <User className="w-12 h-12 opacity-80" />
                  </div>
                )}
              </div>

              {isPimpinan && (
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-amber-500 text-slate-950 rounded-xl shadow-md border border-white/40">
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-200 border border-sky-400/30">
                <ShieldCheck className="w-3 h-3 text-sky-300" />
                {member.group}
              </div>

              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {member.name || '-'}
              </h3>

              <div className="text-xs font-bold text-amber-300 leading-snug">
                {member.title}
              </div>

              {member.nip && member.nip !== '-' && (
                <div className="font-mono text-[11px] text-sky-200/90 pt-0.5">
                  NIP: <span className="font-bold tracking-wider">{member.nip}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-700 text-xs sm:text-sm">
          
          {/* Detail Metadata Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="text-[10px] uppercase font-bold text-slate-400">Unit Organisasi / Bidang</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                {member.department || 'Dinas Perindustrian dan Perdagangan'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="text-[10px] uppercase font-bold text-slate-400">Jabatan / Jenjang Eselon</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                {member.echelon || 'Jabatan Struktural / Fungsional'}
              </div>
            </div>
          </div>

          {/* Description / Tupoksi */}
          {member.description && (
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Tugas Pokok & Fungsi (Tupoksi)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-600 text-xs leading-relaxed">
                {member.description}
              </div>
            </div>
          )}

          {/* Official Seal Footnote */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pejabat Resmi Terverifikasi</span>
            </div>
            <span>SIPIKEM Prov. Sulut</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
