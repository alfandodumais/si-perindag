'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Filter, Search, Store, Building2, Eye } from 'lucide-react';
import SuratKeteranganModal from '@/components/SuratKeteranganModal';
import { KECAMATAN_MANADO, KATEGORI_USAHA } from '@/lib/constants';

const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
      Memuat peta GIS sebaran pedagang...
    </div>
  ),
});

export default function PetaPublikPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      let url = `/api/merchants?publicOnly=true`;
      if (selectedCategory !== 'ALL') url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (selectedDistrict !== 'ALL') url += `&district=${encodeURIComponent(selectedDistrict)}`;
      if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMerchants(data.data);
      }
    } catch (err) {
      console.error('Error fetching public merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [selectedCategory, selectedDistrict]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMerchants();
  };

  const categories = ['ALL', ...KATEGORI_USAHA];
  const districts = ['ALL', ...KECAMATAN_MANADO];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            GIS Portal Pemetaan
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Peta Sebaran Pelaku Usaha & Pedagang
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Menampilkan seluruh pedagang dan UMKM terdaftar yang telah terverifikasi resmi oleh dinas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
          <Store className="w-4 h-4 text-emerald-600" />
          <span>Total Terpetakan: <strong className="text-slate-900 font-bold">{merchants.length}</strong> Titik Usaha</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama toko, produk, atau pemilik..."
            className="w-full pl-9 pr-20 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Cari
          </button>
        </form>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full lg:w-56"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'Semua Kategori' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full lg:w-auto">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full lg:w-48"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'Semua Kecamatan' : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Map View */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl p-2 border border-slate-200 shadow-sm">
          <MapDisplay
            merchants={merchants}
            height="620px"
            selectedId={selectedMerchant?.id}
            onSelectMerchant={(m) => setSelectedMerchant(m)}
          />
        </div>

        {/* Sidebar List */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[620px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Daftar Tempat Usaha</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              {merchants.length}
            </span>
          </div>

          <div className="overflow-y-auto flex-1 p-3 space-y-2.5">
            {loading ? (
              <div className="text-center py-12 text-xs text-slate-400">Memuat data...</div>
            ) : merchants.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">Tidak ada pedagang ditemukan.</div>
            ) : (
              merchants.map((m) => {
                const isSelected = selectedMerchant?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMerchant(m)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                        {m.businessName}
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded shrink-0">
                        {m.scale}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {m.category}
                    </p>

                    <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{m.address}, Kec. {m.district}</span>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-800 font-mono">
                          {m.registrationNo}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowModal(true);
                          }}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Lihat Surat
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Printable Certificate Modal if clicked */}
      {selectedMerchant && (
        <SuratKeteranganModal
          merchant={selectedMerchant}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
}
