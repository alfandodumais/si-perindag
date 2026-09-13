'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '@/components/AdminSidebarLayout';
import { GraduationCap, Calendar, Users, Award, CheckCircle2, ArrowRight, Sparkles, Filter, Plus } from 'lucide-react';
import Link from 'next/link';

export default function PembinaanPage() {
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUserSession(data.user);
      })
      .catch(() => {});
  }, []);

  const stages = [
    {
      title: 'Tahap 1: Kurasi & Asesmen Awal',
      count: '140 IKM',
      desc: 'Penilaian kelayakan produk, legalitas dasar (NIB), dan identifikasi kebutuhan pembinaan.',
      badge: 'Tahap Masuk',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    {
      title: 'Tahap 2: Pelatihan Teknis Produksi',
      count: '95 IKM',
      desc: 'Peningkatan higienitas, standardisasi GMP/CPPOB, efisiensi peralatan, dan diversifikasi produk.',
      badge: 'Pelatihan',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      title: 'Tahap 3: Fasilitasi Sertifikasi Halal & BPOM',
      count: '55 IKM',
      desc: 'Bantuan pengujian laboratorium balai, audit halal BPJPH, pendaftaran izin edar PIRT/BPOM MD, dan HAKI Merek.',
      badge: 'Sertifikasi',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      title: 'Tahap 4: Akses Pasar & Ekspor',
      count: '30 IKM',
      desc: 'Onboarding e-katalog LKPP, business matching dengan perbankan SulutGo, ritel modern, dan kurasi ekspor internasional.',
      badge: 'Kemandirian',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ];

  const upcomingTrainings = [
    {
      id: 1,
      title: 'Bimtek Standardisasi Keamanan Pangan & Sertifikasi Halal',
      location: 'Sentra Industri IKM Kota Bitung',
      date: '18 - 20 September 2026',
      target: '35 IKM Olahan Ikan & Hasil Laut',
      instructor: 'Balai Standardisasi Manado & Tim Halal Sulut',
      status: 'Pendaftaran Dibuka',
    },
    {
      id: 2,
      title: 'Kurasi Produk Unggulan IKM Sulut Menuju Pasar Ekspor',
      location: 'Disperindag Provinsi Sulawesi Utara (Manado)',
      date: '25 September 2026',
      target: '20 IKM Maju & Unggulan',
      instructor: 'Atase Perdagangan & Export Center Surabaya',
      status: 'Verifikasi Berkas',
    },
    {
      id: 3,
      title: 'Workshop Digitalisasi & Onboarding E-Katalog Pengadaan Pemerintah',
      location: 'Aula Kantor Walikota Tomohon',
      date: '02 Oktober 2026',
      target: '50 IKM Kriya, Batik & Mamin',
      instructor: 'Biro Pengadaan Barang & Jasa Prov. Sulut',
      status: 'Segera',
    },
  ];

  return (
    <AdminSidebarLayout user={userSession}>
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6 sm:space-y-7">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold uppercase mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
              Program Pembinaan Disperindag Prov. Sulut
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pembinaan & Pendampingan IKM Sulut
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Akselerasi daya saing IKM melalui 4 tahapan pembinaan berkelanjutan menuju standardisasi nasional dan pasar global.
            </p>
          </div>

          <Link
            href="/admin/ikm"
            className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow transition-all self-start sm:self-auto flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Kelola Peserta IKM
          </Link>
        </div>

        {/* 4 Tahapan Roadmap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((st, i) => (
            <div key={st.title} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badgeColor}`}>
                  {st.badge}
                </span>
                <span className="text-xl font-black text-slate-900">{st.count}</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                {st.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Daftar Agenda Pelatihan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-sky-600" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Jadwal Kegiatan & Pelatihan Berjalan (T.A. 2026)
                </h3>
                <p className="text-xs text-slate-400">
                  Diagendakan oleh Bidang Pembinaan & Pengembangan Industri Disperindag Sulut
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingTrainings.map((t) => (
              <div key={t.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                      {t.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">{t.date}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">{t.title}</h4>
                  <p className="text-xs text-slate-500">
                    Lokasi: <b>{t.location}</b> • Sasaran: <span className="text-sky-700 font-semibold">{t.target}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Narasumber / Fasilitator: {t.instructor}
                  </p>
                </div>

                <Link
                  href={`/admin/ikm?mentoringStatus=Sedang Pendampingan`}
                  className="px-4 py-2 bg-slate-100 hover:bg-sky-50 text-sky-700 hover:text-sky-900 font-bold text-xs rounded-xl transition-colors shrink-0 self-start sm:self-auto"
                >
                  Lihat IKM Terdaftar &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>

      </main>
    </AdminSidebarLayout>
  );
}
