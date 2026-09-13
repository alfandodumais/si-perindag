'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '@/components/AdminSidebarLayout';
import { Award, CheckCircle2, Info, ArrowRight, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { IKM_SCORE_TIERS } from '@/lib/constants';
import Link from 'next/link';

export default function IkmScorePage() {
  const [userSession, setUserSession] = useState<any>(null);

  // Score Calculator simulator state
  const [legalitasScore, setLegalitasScore] = useState(15); // max 20
  const [standarisasiScore, setStandarisasiScore] = useState(20); // max 25
  const [finansialScore, setFinansialScore] = useState(15); // max 20
  const [pemasaranScore, setPemasaranScore] = useState(15); // max 20
  const [kemitraanScore, setKemitraanScore] = useState(10); // max 15

  const totalCalculated = legalitasScore + standarisasiScore + finansialScore + pemasaranScore + kemitraanScore;

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUserSession(data.user);
      })
      .catch(() => {});
  }, []);

  const getTierFromScore = (s: number) => {
    if (s >= 86) return { name: 'Unggulan', color: 'bg-purple-100 text-purple-800 border-purple-200', desc: 'Siap ekspor internasional dan kemitraan industri manufaktur skala besar.' };
    if (s >= 71) return { name: 'Maju', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', desc: 'Tembus ritel modern nasional, izin edar BPOM/MD lengkap, manajemen stabil.' };
    if (s >= 51) return { name: 'Berkembang', color: 'bg-blue-100 text-blue-800 border-blue-200', desc: 'Legalitas NIB & PIRT terpenuhi, aktif penjualan digital, omset konsisten.' };
    return { name: 'Pemula', color: 'bg-amber-100 text-amber-800 border-amber-200', desc: 'Usaha mikro tahap rintisan, membutuhkan pendampingan legalitas dan kemasan.' };
  };

  const calculatedTier = getTierFromScore(totalCalculated);

  return (
    <AdminSidebarLayout user={userSession}>
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6 sm:space-y-7">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase mb-2">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Instrumen Penilaian Disperindag Sulut
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Standarisasi IKM Score Sulawesi Utara
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Metrik penilaian objektif untuk mengukur tingkat kesiapan dan level kematangan IKM dalam program pembinaan.
            </p>
          </div>

          <Link
            href="/admin/ikm"
            className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow transition-all self-start sm:self-auto flex items-center gap-2"
          >
            Lihat Peringkat IKM &rarr;
          </Link>
        </div>

        {/* 4 Tiers Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {IKM_SCORE_TIERS.map((tier) => (
            <div key={tier.name} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${tier.color}`}>
                  Level {tier.name}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">Skor: {tier.minScore}-{tier.maxScore}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {tier.description}
              </p>
            </div>
          ))}
        </div>

        {/* Simulator Penilaian Interaktif */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-sky-600" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Kalkulator & Simulator Penilaian IKM Score
                </h3>
                <p className="text-xs text-slate-400">
                  Geser parameter di bawah ini untuk mensimulasikan perhitungan skor IKM
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Parameter 1: Legalitas (Bobot 20%) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">1. Kelengkapan Legalitas (Bobot 20%)</span>
                  <span className="font-mono font-bold text-sky-700">{legalitasScore} / 20</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={legalitasScore}
                  onChange={(e) => setLegalitasScore(parseInt(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">NIB (10 poin), NPWP (5 poin), Izin Usaha Terkait (5 poin)</p>
              </div>

              {/* Parameter 2: Standardisasi & Mutu (Bobot 25%) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">2. Standardisasi & Sertifikasi Mutu (Bobot 25%)</span>
                  <span className="font-mono font-bold text-sky-700">{standarisasiScore} / 25</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={standarisasiScore}
                  onChange={(e) => setStandarisasiScore(parseInt(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">Sertifikat Halal (10 poin), BPOM/PIRT (10 poin), HAKI Merek (5 poin)</p>
              </div>

              {/* Parameter 3: Finansial & Omset (Bobot 20%) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">3. Kinerja Finansial & Perbankan (Bobot 20%)</span>
                  <span className="font-mono font-bold text-sky-700">{finansialScore} / 20</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={finansialScore}
                  onChange={(e) => setFinansialScore(parseInt(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">Omset &gt; Rp 15jt/bln (10 poin), Rekening Usaha Terpisah (5 poin), Akses KUR (5 poin)</p>
              </div>

              {/* Parameter 4: Pemasaran & Digitalisasi (Bobot 20%) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">4. Jangkauan Pasar & Digital (Bobot 20%)</span>
                  <span className="font-mono font-bold text-sky-700">{pemasaranScore} / 20</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={pemasaranScore}
                  onChange={(e) => setPemasaranScore(parseInt(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">Marketplace Online (10 poin), Media Sosial Aktif (5 poin), Kemasan Ekspor (5 poin)</p>
              </div>

              {/* Parameter 5: Kemitraan (Bobot 15%) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">5. Jaringan Kemitraan & Penyerapan Lokal (Bobot 15%)</span>
                  <span className="font-mono font-bold text-sky-700">{kemitraanScore} / 15</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={kemitraanScore}
                  onChange={(e) => setKemitraanScore(parseInt(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">Kerjasama Swalayan/Hotel (10 poin), Bahan Baku Petani/Nelayan Sulut (5 poin)</p>
              </div>

            </div>

            {/* Score Result Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0c233c] to-[#123153] text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between text-center space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-sky-300 uppercase tracking-widest block">
                  Hasil Simulasi Nilai
                </span>
                <div className="text-6xl font-black text-white tracking-tight">
                  {totalCalculated}
                  <span className="text-xl text-sky-300 font-normal"> / 100</span>
                </div>
              </div>

              <div className="space-y-2 bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${calculatedTier.color}`}>
                  Level {calculatedTier.name}
                </span>
                <p className="text-xs text-sky-100 leading-relaxed">
                  {calculatedTier.desc}
                </p>
              </div>

              <div className="text-[11px] text-sky-200/80">
                Standar Penilaian Resmi Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara
              </div>
            </div>

          </div>
        </div>

      </main>
    </AdminSidebarLayout>
  );
}
