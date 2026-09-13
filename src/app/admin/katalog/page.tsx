'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebarLayout from '@/components/AdminSidebarLayout';
import { ShoppingBag, Search, ExternalLink, Phone, MapPin, Tag } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import Link from 'next/link';

export default function AdminKatalogPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => d.success && setUserSession(d.user))
      .catch(() => {});

    fetch('/api/merchants?limit=50')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMerchants(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = merchants.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.businessName.toLowerCase().includes(q) ||
      (m.mainProduct && m.mainProduct.toLowerCase().includes(q)) ||
      (m.regency && m.regency.toLowerCase().includes(q))
    );
  });

  return (
    <AdminSidebarLayout user={userSession}>
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold uppercase mb-2">
              <ShoppingBag className="w-3.5 h-3.5 text-sky-700" />
              Showcase Komoditas Unggulan Sulut
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Katalog Produk IKM Sulawesi Utara
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Etalase produk unggulan 15 Kabupaten/Kota: Makanan Khas, Kerajinan Bentenan, Olahan Kelapa, dan Hasil Laut.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk atau IKM..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading ? (
            <div className="col-span-full py-16 text-center text-xs text-slate-400">
              Memuat katalog produk IKM...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-xs text-slate-400">
              Tidak ada produk yang sesuai kata kunci pencarian.
            </div>
          ) : (
            filtered.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    {m.businessImage ? (
                      <img
                        src={m.businessImage}
                        alt={m.businessName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                        Produk IKM Sulut
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0c233c]/80 text-white backdrop-blur-xs">
                      {m.regency || m.district}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-sky-600 block">
                      {m.category}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                      {m.mainProduct || m.businessName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {m.businessName} • {m.ownerName}
                    </p>
                    <div className="pt-1 font-mono font-black text-sky-900 text-sm">
                      {formatRupiah(m.productPrice || 25000)}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <a
                    href={`https://wa.me/${(m.phone || '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo ${m.businessName}, saya melihat produk ${m.mainProduct || ''} di katalog SIPIKEM SULUT.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Hubungi
                  </a>
                  <Link
                    href={`/admin/ikm`}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    title="Detail IKM"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </AdminSidebarLayout>
  );
}
