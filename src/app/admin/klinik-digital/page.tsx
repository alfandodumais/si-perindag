'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '@/components/AdminSidebarLayout';
import { Laptop, MessageSquare, ShieldCheck, CheckCircle2, Clock, HelpCircle, PhoneCall } from 'lucide-react';

export default function KlinikDigitalPage() {
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => d.success && setUserSession(d.user))
      .catch(() => {});
  }, []);

  const consultationServices = [
    {
      title: 'Klinik Desain Kemasan & Merek',
      desc: 'Konsultasi gratis desain label, kemasan tahan simpan, barcode GS1, dan pendaftaran HAKI Merek.',
      consultant: 'Tim Desain Kreatif Disperindag',
      status: 'Aktif Setiap Hari Kerja',
    },
    {
      title: 'Klinik Standardisasi Halal & BPOM',
      desc: 'Bimbingan pengisian SiHalal BPJPH, persyaratan audit penyelia halal, dan alur perizinan BPOM MD/PIRT.',
      consultant: 'Pendamping PPH & Auditor Halal',
      status: 'Konsultasi Online & Tatap Muka',
    },
    {
      title: 'Klinik Akses Permodalan & KUR',
      desc: 'Fasilitasi penyiapan laporan keuangan usaha dan pengajuan KUR perbankan mitra (Bank SulutGo / BRI).',
      consultant: 'Analis Keuangan & Perbankan Mitra',
      status: 'Jadwal Setiap Rabu',
    },
    {
      title: 'Klinik Digital Marketing & Ekspor',
      desc: 'Pelatihan fotografi produk, optimasi toko marketplace online, onboarding e-katalog, dan konsultasi ekspor.',
      consultant: 'Praktisi E-Commerce Sulut',
      status: 'Jadwal Setiap Jumat',
    },
  ];

  return (
    <AdminSidebarLayout user={userSession}>
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold uppercase mb-2">
              <Laptop className="w-3.5 h-3.5 text-sky-700" />
              Layanan Konsultasi Online Disperindag Sulut
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Klinik Digital IKM Sulawesi Utara
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pusat konsultasi, advokasi, dan solusi terpadu untuk percepatan legalitas, kemasan, pembiayaan, dan pemasaran produk IKM.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {consultationServices.map((s) => (
            <div key={s.title} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {s.status}
                </span>
                <HelpCircle className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Fasilitator: <b className="text-slate-700">{s.consultant}</b></span>
                <button
                  onClick={() => alert(`Layanan ${s.title} tersedia pada jam kerja kantor Disperindag Prov. Sulut. Telp: (0431) 851103.`)}
                  className="font-bold text-sky-700 hover:text-sky-900 hover:underline"
                >
                  Hubungi Konsultan &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </AdminSidebarLayout>
  );
}
