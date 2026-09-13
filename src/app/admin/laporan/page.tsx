'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '@/components/AdminSidebarLayout';
import { FileText, Download, BarChart2, Calendar, Layers, CheckCircle2 } from 'lucide-react';

export default function LaporanPage() {
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => d.success && setUserSession(d.user))
      .catch(() => {});
  }, []);

  const reports = [
    {
      title: 'Laporan Rekapitulasi IKM 15 Kabupaten/Kota (Excel/CSV)',
      period: 'Tahun Anggaran 2026',
      desc: 'Berisi data lengkap 8 kluster profil usaha: identitas, produk, NIB, sertifikasi, dan skor.',
      format: 'CSV / XLS',
      actionUrl: '/api/merchants?limit=500',
    },
    {
      title: 'Laporan Sebaran Sektor Komoditas & Omset IKM',
      period: 'Triwulan III 2026',
      desc: 'Analisis kontribusi sektor makanan & minuman, kriya, tenun, dan kelapa terhadap ekonomi Sulut.',
      format: 'PDF Ringkasan',
      actionUrl: '#',
    },
    {
      title: 'Laporan Evaluasi Progres Pendampingan & IKM Naik Kelas',
      period: 'Semester I 2026',
      desc: 'Monitoring 320 peserta kurasi dan 185 IKM berpredikat unggulan yang difasilitasi Disperindag.',
      format: 'Laporan Monev',
      actionUrl: '#',
    },
  ];

  return (
    <AdminSidebarLayout user={userSession}>
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold uppercase mb-2">
              <FileText className="w-3.5 h-3.5 text-sky-700" />
              Pusat Data & Laporan SIPIKEM SULUT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Laporan & Rekapitulasi Statistik
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Ekspor rekapitulasi data pendaftaran, pembinaan, sertifikasi, dan analitik IKM di Provinsi Sulawesi Utara.
            </p>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reports.map((rep) => (
            <div key={rep.title} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {rep.period}
                  </span>
                  <span className="text-[10px] font-bold text-sky-700 font-mono">
                    {rep.format}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{rep.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{rep.desc}</p>
              </div>

              <a
                href={rep.actionUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow text-center flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Dokumen
              </a>
            </div>
          ))}
        </div>

      </main>
    </AdminSidebarLayout>
  );
}
