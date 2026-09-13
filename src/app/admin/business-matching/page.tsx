'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '@/components/AdminSidebarLayout';
import { Handshake, Building2, Store, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BusinessMatchingPage() {
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => d.success && setUserSession(d.user))
      .catch(() => {});
  }, []);

  const partnerships = [
    {
      partner: 'Bank SulutGo (Torang Pe Bank)',
      category: 'Perbankan Daerah & Kredit Usaha Rakyat (KUR)',
      commitment: 'Fasilitasi modal kerja bunga rendah dan QRIS merchant bagi 500 IKM terdaftar.',
      status: 'MOU Berjalan',
    },
    {
      partner: 'Jaringan Swalayan & Toko Oleh-Oleh Manado',
      category: 'Ritel Modern Lokal (Grand Central, Merciful Building, dll)',
      commitment: 'Alokasi rak khusus komoditas khas Sulut (Abon Cakalang, Pala, Halua Kenari).',
      status: 'Kurasi Batch 3',
    },
    {
      partner: 'Perhimpunan Hotel dan Restoran Indonesia (PHRI Sulut)',
      category: 'Sektor Pariwisata & Hospitality',
      commitment: 'Suplai welcome amenities kopi Kotamobagu, kerajinan lokal, dan bahan baku makanan hotel.',
      status: 'Aktif',
    },
    {
      partner: 'Ekosistem E-Commerce & Logistik Nasional (J&T / Pos Indonesia)',
      category: 'Logistik & Distribusi',
      commitment: 'Diskon ongkos kirim antarpulau dan pengiriman internasional produk kriya dan olahan kelapa.',
      status: 'Aktif',
    },
  ];

  return (
    <AdminSidebarLayout user={userSession}>
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold uppercase mb-2">
              <Handshake className="w-3.5 h-3.5 text-sky-700" />
              Kemitraan Strategis Disperindag Prov. Sulut
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Business Matching & Kemitraan IKM
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Menghubungkan IKM Sulawesi Utara dengan perbankan, pasar ritel modern, perhotelan, dan platform perdagangan digital.
            </p>
          </div>
        </div>

        {/* Partnership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {partnerships.map((p) => (
            <div key={p.partner} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {p.status}
                </span>
                <Handshake className="w-4 h-4 text-sky-600" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{p.partner}</h3>
              <p className="text-xs font-semibold text-sky-700">{p.category}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{p.commitment}</p>
            </div>
          ))}
        </div>

      </main>
    </AdminSidebarLayout>
  );
}
