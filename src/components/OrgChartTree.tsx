'use client';

import React from 'react';
import { OrgMember } from '@/lib/settings';
import { Crown, ShieldCheck, Briefcase, Building2, User, ChevronDown } from 'lucide-react';

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
          size === 'lg' ? 'w-80 min-h-[160px]' : size === 'md' ? 'w-64 min-h-[145px]' : 'w-56 min-h-[110px]'
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
    <div className="w-full overflow-x-auto py-8 px-4 no-scrollbar">
      <div className="min-w-[1100px] flex flex-col items-center select-none">
        
        {/* ======================================================== */}
        {/* LEVEL 1: KEPALA DINAS                                    */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center relative z-10">
          {renderCard(kadis, 'gold', 'lg')}

          {/* Stem downwards */}
          <div className="w-0.5 h-12 bg-sky-400/60 mt-1" />
        </div>

        {/* ======================================================== */}
        {/* LEVEL 2: SEKRETARIAT & CABANG KASUBAG                    */}
        {/* ======================================================== */}
        <div className="w-full max-w-4xl relative flex flex-col items-center mb-8">
          
          {/* Horizontal Connector to the right for Sekretaris */}
          <div className="relative w-full flex justify-end pr-12">
            
            {/* SVG Elbow connecting Kadis vertical stem to Sekretaris */}
            <div className="absolute left-1/2 -top-12 w-[220px] h-12 border-t-2 border-r-2 border-sky-400/60 rounded-tr-xl pointer-events-none" />

            <div className="flex flex-col items-center">
              {renderCard(sekretaris, 'blue', 'md')}

              {/* Stem down to Sub-sections */}
              <div className="w-0.5 h-8 bg-sky-400/60" />

              {/* Horizontal line across Sekretariat's 3 children */}
              <div className="w-[520px] h-0.5 bg-sky-400/60 relative">
                <div className="absolute left-0 top-0 w-0.5 h-6 bg-sky-400/60" />
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-6 bg-sky-400/60" />
                <div className="absolute right-0 top-0 w-0.5 h-6 bg-sky-400/60" />
              </div>

              {/* 3 Children under Sekretaris */}
              <div className="flex items-start gap-4 mt-6">
                {renderCard(kasubagUmum, 'sky', 'sm')}
                {renderCard(kasubagKeuangan, 'sky', 'sm')}
                {renderCard(fungsionalSekretariat, 'slate', 'sm')}
              </div>
            </div>
          </div>

        </div>

        {/* Divider / Stem down to Bidang-Bidang */}
        <div className="w-0.5 h-14 bg-sky-400/60 -mt-4 mb-0" />

        {/* ======================================================== */}
        {/* LEVEL 3: 4 BIDANG URUSAN (ESELON III)                    */}
        {/* ======================================================== */}
        <div className="w-full relative flex flex-col items-center mb-10">
          
          {/* Horizontal crossbar connecting the 4 bidang */}
          <div className="w-[1020px] h-0.5 bg-sky-400/60 relative">
            <div className="absolute left-[8%] top-0 w-0.5 h-6 bg-sky-400/60" />
            <div className="absolute left-[36%] top-0 w-0.5 h-6 bg-sky-400/60" />
            <div className="absolute left-[64%] top-0 w-0.5 h-6 bg-sky-400/60" />
            <div className="absolute right-[8%] top-0 w-0.5 h-6 bg-sky-400/60" />
          </div>

          {/* 4 Bidang Columns */}
          <div className="grid grid-cols-4 gap-6 mt-6 w-[1080px]">
            
            {/* Col 1: Bidang Perindustrian */}
            <div className="flex flex-col items-center">
              {renderCard(kabidIndustri, 'blue', 'md')}
              <div className="w-0.5 h-6 bg-sky-400/60" />
              {renderCard(fungsionalIndustri, 'slate', 'md')}
            </div>

            {/* Col 2: Bidang Fasilitasi & Pengembangan IKM */}
            <div className="flex flex-col items-center">
              {renderCard(kabidIkm, 'blue', 'md')}
              <div className="w-0.5 h-6 bg-sky-400/60" />
              {renderCard(fungsionalIkm, 'slate', 'md')}
            </div>

            {/* Col 3: Bidang Perdagangan Luar Negeri */}
            <div className="flex flex-col items-center">
              {renderCard(kabidDaglu, 'blue', 'md')}
              <div className="w-0.5 h-6 bg-sky-400/60" />
              {renderCard(fungsionalDaglu, 'slate', 'md')}
            </div>

            {/* Col 4: Bidang Perdagangan Dalam Negeri */}
            <div className="flex flex-col items-center">
              {renderCard(kabidDagri, 'blue', 'md')}
              <div className="w-0.5 h-6 bg-sky-400/60" />
              {renderCard(fungsionalDagri, 'slate', 'md')}
            </div>

          </div>

        </div>

        {/* Stem down to UPTD */}
        <div className="w-0.5 h-12 bg-sky-400/60" />

        {/* ======================================================== */}
        {/* LEVEL 4: UPTD BALAI PENGUJIAN DAN SERTIFIKASI MUTU       */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center">
          {renderCard(kepalaUptd, 'blue', 'lg')}
        </div>

      </div>
    </div>
  );
}
