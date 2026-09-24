'use client';

import React from 'react';
import { OrgMember } from '@/lib/settings';
import { Crown, ShieldCheck, Briefcase, Building2, User } from 'lucide-react';

interface OrgChartTreeProps {
  members: OrgMember[];
  onSelectMember: (member: OrgMember) => void;
}

export default function OrgChartTree({ members, onSelectMember }: OrgChartTreeProps) {
  // Helper to find member by id or title
  const kadis = members.find((m) => m.id === '1' || m.title.includes('KEPALA DINAS')) || members[0];
  const sekretaris = members.find((m) => m.id === '2' || m.title === 'SEKRETARIS');
  const kasubagUmum = members.find((m) => m.id === '3' || m.title.includes('SUB BAGIAN UMUM'));
  const kasubagKeuangan = members.find((m) => m.id === '4' || m.title.includes('PERENCANAAN'));
  const fungsionalSekretariat = members.find((m) => m.id === '5' || (m.parentId === '2' && m.title.includes('FUNGSIONAL')));

  const kabidIndustri = members.find((m) => m.id === '6' || m.title.includes('BIDANG PERINDUSTRIAN'));
  const fungsionalIndustri = members.find((m) => m.id === '7' || (m.parentId === '6' && m.title.includes('FUNGSIONAL')));

  const kabidIkm = members.find((m) => m.id === '8' || m.title.includes('PENGEMBANGN IKM') || m.title.includes('PENGEMBANGAN IKM'));
  const fungsionalIkm = members.find((m) => m.id === '9' || (m.parentId === '8' && m.title.includes('FUNGSIONAL')));

  const kabidDaglu = members.find((m) => m.id === '10' || m.title.includes('PERDAGANGAN LUAR'));
  const fungsionalDaglu = members.find((m) => m.id === '11' || (m.parentId === '10' && m.title.includes('FUNGSIONAL')));

  const kabidDagri = members.find((m) => m.id === '12' || m.title.includes('PERDAGANGAN DALAM'));
  const fungsionalDagri = members.find((m) => m.id === '13' || (m.parentId === '12' && m.title.includes('FUNGSIONAL')));

  const kepalaUptd = members.find((m) => m.id === '14' || m.title.includes('UPTD'));

  // Card component for tree node
  const renderCard = (
    member: OrgMember | undefined,
    theme: 'gold' | 'blue' | 'sky' | 'slate' = 'blue',
    size: 'lg' | 'md' | 'sm' = 'md'
  ) => {
    if (!member) return null;

    const themeStyles = {
      gold: {
        border: 'border-amber-400/80 hover:border-amber-300',
        bg: 'bg-gradient-to-b from-[#0e2746] to-[#081a2e]',
        headerBg: 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black',
        ring: 'ring-2 ring-amber-400/30 shadow-lg shadow-amber-950/30',
        badge: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
        nameColor: 'text-amber-100',
      },
      blue: {
        border: 'border-sky-500/60 hover:border-sky-400',
        bg: 'bg-gradient-to-b from-[#0f2d4e] to-[#0a1e35]',
        headerBg: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white font-extrabold',
        ring: 'ring-1 ring-sky-500/30 shadow-md shadow-sky-950/20',
        badge: 'bg-sky-500/20 text-sky-200 border border-sky-400/30',
        nameColor: 'text-white',
      },
      sky: {
        border: 'border-sky-400/40 hover:border-sky-300',
        bg: 'bg-gradient-to-b from-[#113357] to-[#0c243f]',
        headerBg: 'bg-sky-800/90 text-sky-100 font-bold',
        ring: 'shadow-sm shadow-sky-950/20',
        badge: 'bg-sky-400/10 text-sky-300 border border-sky-400/20',
        nameColor: 'text-slate-100',
      },
      slate: {
        border: 'border-slate-600/50 hover:border-slate-400',
        bg: 'bg-[#0a1c30]',
        headerBg: 'bg-slate-700 text-slate-200 font-semibold',
        ring: 'shadow-2xs',
        badge: 'bg-slate-700/50 text-slate-300 border border-slate-600/40',
        nameColor: 'text-slate-200',
      },
    };

    const style = themeStyles[theme];

    return (
      <div
        onClick={() => onSelectMember(member)}
        className={`group relative rounded-2xl ${style.bg} border ${style.border} ${style.ring} cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl text-center overflow-hidden flex flex-col justify-between ${
          size === 'lg' ? 'w-full max-w-[340px] min-h-[160px]' : size === 'md' ? 'w-full max-w-[270px] min-h-[145px]' : 'w-full max-w-[240px] min-h-[120px]'
        }`}
      >
        {/* Card Header Jabatan */}
        <div className={`px-3 py-2 text-[10.5px] uppercase tracking-wider ${style.headerBg} flex items-center justify-center gap-1.5`}>
          {theme === 'gold' && <Crown className="w-3.5 h-3.5 text-amber-950 shrink-0" />}
          <span className="truncate">{member.title}</span>
        </div>

        {/* Card Body */}
        <div className="p-3.5 flex flex-col items-center flex-1 justify-center">
          {/* Official Photo Avatar */}
          <div className="relative mb-2.5">
            <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
              theme === 'gold' ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-sky-400 ring-2 ring-sky-400/30'
            } bg-slate-800 shadow-md flex items-center justify-center shrink-0`}>
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#081a2e] to-[#163a63] text-sky-300">
                  <User className="w-6 h-6 opacity-80" />
                </div>
              )}
            </div>
          </div>

          {/* Official Name */}
          <h4 className={`text-xs font-black ${style.nameColor} leading-tight line-clamp-2 px-1`}>
            {member.name || '-'}
          </h4>

          {/* Official NIP */}
          {member.nip && member.nip !== '-' && (
            <div className="mt-1 font-mono text-[10px] text-sky-300/80 tracking-wider">
              NIP. {member.nip}
            </div>
          )}

          {/* Hint view */}
          <div className="mt-2 text-[9px] text-sky-400/70 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            <span>Klik lihat profil</span> &rarr;
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-6 px-2 sm:px-4 space-y-12">
      
      {/* ======================================================== */}
      {/* TIER 1: PIMPINAN DINAS                                   */}
      {/* ======================================================== */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" /> Pimpinan Tinggi Pratama (Eselon II.a)
        </div>

        <div className="flex justify-center w-full">
          {renderCard(kadis, 'gold', 'lg')}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TIER 2: SEKRETARIAT & SUB-BAGIAN                         */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-[#091b2e]/60 border border-sky-500/20 p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[10px] font-extrabold uppercase tracking-wider">
            Sekretariat & Sub-Bagian
          </div>
        </div>

        {/* Sekretaris Dinas */}
        <div className="flex justify-center">
          {renderCard(sekretaris, 'blue', 'md')}
        </div>

        {/* 3 Sub-units under Sekretaris */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center max-w-4xl mx-auto pt-2">
          {renderCard(kasubagUmum, 'sky', 'sm')}
          {renderCard(kasubagKeuangan, 'sky', 'sm')}
          {renderCard(fungsionalSekretariat, 'slate', 'sm')}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TIER 3: 4 BIDANG URUSAN (ESELON III)                     */}
      {/* ======================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[10px] font-extrabold uppercase tracking-wider">
            Bidang-Bidang Urusan Teknis (Eselon III.a)
          </div>
        </div>

        {/* 4 Bidang Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          
          {/* Col 1: Bidang Perindustrian */}
          <div className="flex flex-col items-center gap-3 w-full">
            {renderCard(kabidIndustri, 'blue', 'md')}
            {renderCard(fungsionalIndustri, 'slate', 'md')}
          </div>

          {/* Col 2: Bidang Fasilitasi & Pengembangan IKM */}
          <div className="flex flex-col items-center gap-3 w-full">
            {renderCard(kabidIkm, 'blue', 'md')}
            {renderCard(fungsionalIkm, 'slate', 'md')}
          </div>

          {/* Col 3: Bidang Perdagangan Luar Negeri */}
          <div className="flex flex-col items-center gap-3 w-full">
            {renderCard(kabidDaglu, 'blue', 'md')}
            {renderCard(fungsionalDaglu, 'slate', 'md')}
          </div>

          {/* Col 4: Bidang Perdagangan Dalam Negeri */}
          <div className="flex flex-col items-center gap-3 w-full">
            {renderCard(kabidDagri, 'blue', 'md')}
            {renderCard(fungsionalDagri, 'slate', 'md')}
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* TIER 4: UNIT PELAKSANA TEKNIS DAERAH (UPTD)              */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-[#091b2e]/60 border border-sky-500/20 p-6 flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
          Unit Pelaksana Teknis Daerah (UPTD)
        </div>

        <div className="flex justify-center w-full">
          {renderCard(kepalaUptd, 'blue', 'lg')}
        </div>
      </div>

    </div>
  );
}
