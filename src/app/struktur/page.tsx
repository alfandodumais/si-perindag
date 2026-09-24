'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users2, 
  Crown, 
  ShieldCheck, 
  Printer, 
  Search, 
  Filter, 
  Sparkles, 
  Network, 
  LayoutGrid, 
  ChevronRight,
  ExternalLink,
  Info,
  User,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { OrgMember, DEFAULT_ORG_STRUCTURE } from '@/lib/settings';
import OrgChartTree from '@/components/OrgChartTree';
import OrgOfficerModal from '@/components/OrgOfficerModal';

export default function PublicStrukturOrganisasiPage() {
  const [members, setMembers] = useState<OrgMember[]>(DEFAULT_ORG_STRUCTURE);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);

  useEffect(() => {
    fetch('/api/org-structure')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMembers(data.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching org structure:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter members for Grid View
  const filteredMembers = members.filter((m) => {
    const matchGroup = 
      selectedGroup === 'ALL' ||
      (selectedGroup === 'PIMPINAN' && m.group === 'PIMPINAN') ||
      (selectedGroup === 'SEKRETARIAT' && m.group === 'SEKRETARIAT') ||
      (selectedGroup === 'BIDANG' && m.group === 'BIDANG') ||
      (selectedGroup === 'UPTD' && m.group === 'UPTD') ||
      (selectedGroup === 'FUNGSIONAL' && m.group === 'FUNGSIONAL');

    const matchSearch =
      !searchQuery.trim() ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.nip && m.nip.includes(searchQuery.trim())) ||
      (m.department && m.department.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchGroup && matchSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#071728] text-slate-100 pb-20 selection:bg-sky-500 selection:text-white">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-600/15 via-blue-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 no-print">
          <Link href="/" className="hover:text-sky-300 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-sky-400 font-bold">Struktur Disperindag</span>
        </div>

        {/* Hero Banner Header */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0c233c] via-[#0f2f52] to-[#081a2e] border border-sky-500/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
          
          {/* Subtle geometric lines accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-amber-400/10 via-sky-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-sky-500/20 border border-amber-400/30 text-xs font-black tracking-wide text-amber-300 uppercase shadow-inner">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Pemerintah Provinsi Sulawesi Utara</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Struktur Organisasi <br />
                <span className="bg-gradient-to-r from-sky-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
                  Dinas Perindustrian dan Perdagangan Daerah
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Bagan hirarki kepemimpinan, sekretariat, bidang teknis perindustrian & perdagangan, serta unit pelaksana teknis daerah (UPTD) dalam pembinaan, fasilitasi legalitas, dan akselerasi IKM Sulawesi Utara.
              </p>

              {/* Quick stats pills */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 text-[11px] font-semibold text-sky-200">
                <span className="px-3 py-1 rounded-xl bg-sky-950/60 border border-sky-700/40">
                  Kepala Dinas: <b>Drs. Hendrik R. Tendean</b>
                </span>
                <span className="px-3 py-1 rounded-xl bg-sky-950/60 border border-sky-700/40">
                  Sekretaris: <b>LEONARD LIWOSO SP.M.SI</b>
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-950/50 border border-amber-600/40 text-amber-300">
                  4 Bidang Urusan + 1 UPTD Balai Mutu
                </span>
              </div>
            </div>

            {/* Action Buttons: View Toggle & Print */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 no-print">
              
              {/* Toggle View Mode */}
              <div className="p-1 rounded-2xl bg-[#081a2e] border border-sky-500/30 flex items-center shadow-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('tree')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    viewMode === 'tree'
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Bagan Pohon (Hirarki)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Direktori Pejabat</span>
                </button>
              </div>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm"
              >
                <Printer className="w-4 h-4 text-sky-400" />
                <span>Cetak / Unduh PDF</span>
              </button>

            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* VIEW 1: BAGAN HIRARKI POHON VISUAL                       */}
        {/* ======================================================== */}
        {viewMode === 'tree' && (
          <div className="bg-[#0b1e33] rounded-3xl border border-sky-500/20 shadow-2xl p-4 sm:p-8 overflow-hidden">
            
            {/* Tree Info Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-sky-900/60 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Network className="w-4 h-4 text-sky-400" />
                <span className="font-extrabold text-white">Bagan Struktur Organisasi Resmi</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-[11px]">Susunan hierarki resmi pejabat Disperindag Prov. Sulut</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" /> Pimpinan Dinas
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 block" /> Administrator / Eselon III
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 block" /> Fungsional
                </span>
              </div>
            </div>

            {/* Render Interactive SVG / Card Tree Chart */}
            <OrgChartTree
              members={members}
              onSelectMember={(member) => setSelectedMember(member)}
            />

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: DIREKTORI KARTU PEJABAT EKSEKUTIF                */}
        {/* ======================================================== */}
        {viewMode === 'grid' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-[#0b1e33] p-4 sm:p-5 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              
              {/* Category tabs */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {[
                  { key: 'ALL', label: 'Semua Pejabat' },
                  { key: 'PIMPINAN', label: 'Pimpinan' },
                  { key: 'SEKRETARIAT', label: 'Sekretariat' },
                  { key: 'BIDANG', label: 'Bidang Urusan' },
                  { key: 'UPTD', label: 'UPTD' },
                  { key: 'FUNGSIONAL', label: 'Fungsional' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedGroup(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedGroup === tab.key
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, NIP, atau jabatan..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

            </div>

            {/* Officer Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredMembers.map((m) => {
                const isPimpinan = m.group === 'PIMPINAN';
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className={`group rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between p-5 ${
                      isPimpinan
                        ? 'bg-gradient-to-b from-[#0f2c4e] to-[#0a1e35] border-amber-400/60 ring-1 ring-amber-400/30 hover:border-amber-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/40'
                        : 'bg-gradient-to-b from-[#0c223a] to-[#071626] border-sky-900/60 hover:border-sky-500/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-950/40'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          isPimpinan
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {m.group}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">
                          #{m.order}
                        </span>
                      </div>

                      {/* Photo Portrait Frame */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 mb-3.5 shadow-md flex items-center justify-center ${
                          isPimpinan
                            ? 'border-amber-400 ring-2 ring-amber-400/30'
                            : 'border-sky-400 ring-2 ring-sky-400/20'
                        } bg-slate-900`}>
                          {m.photo ? (
                            <img
                              src={m.photo}
                              alt={m.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#081a2e] to-[#163a63] text-sky-300">
                              <User className="w-8 h-8 opacity-80" />
                            </div>
                          )}
                        </div>

                        {/* Title & Name */}
                        <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wide line-clamp-1 mb-1">
                          {m.title}
                        </div>

                        <h3 className="font-extrabold text-sm text-white leading-tight line-clamp-2 min-h-[36px]">
                          {m.name || '-'}
                        </h3>

                        {m.nip && m.nip !== '-' && (
                          <div className="font-mono text-[10px] text-slate-400 mt-1">
                            NIP. {m.nip}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-300 group-hover:text-white transition-colors">
                      <span className="text-[11px] font-semibold">Lihat Profil Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMembers.length === 0 && (
              <div className="p-12 text-center text-slate-400 bg-[#0b1e33] rounded-3xl border border-sky-900/60">
                <Info className="w-8 h-8 text-sky-400 mx-auto mb-2 opacity-60" />
                <p className="font-bold text-slate-300">Tidak ada pejabat ditemukan</p>
                <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian atau kategori lain.</p>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Profile Detail Modal */}
      <OrgOfficerModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />

    </div>
  );
}
