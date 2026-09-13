'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Filter, Search, Store, Building2, Eye, Sparkles } from 'lucide-react';
import SuratKeteranganModal from '@/components/SuratKeteranganModal';
import { KABUPATEN_KOTA_SULUT, KATEGORI_IKM_SULUT } from '@/lib/constants';

const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
      Memuat peta GIS sebaran IKM Sulawesi Utara...
    </div>
  ),
});

export default function PetaPublikPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRegency, setSelectedRegency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      let url = `/api/merchants?limit=250`;
      if (selectedCategory !== 'ALL') url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (selectedRegency !== 'ALL') url += `&regency=${encodeURIComponent(selectedRegency)}`;
      if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMerchants(data.data);
      }
    } catch (err) {
      console.error('Error fetching public IKM for map:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [selectedCategory, selectedRegency]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMerchants();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-700" />
            GIS Portal Pemetaan IKM Sulawesi Utara
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Peta Sebaran Sentra IKM 15 Kabupaten/Kota
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Menampilkan seluruh industri kecil dan menengah binaan Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-sky-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs self-start md:self-auto">
          <Building2 className="w-4 h-4 text-sky-600" />
          <span>Total Terpetakan: <strong className="text-slate-900">{merchants.length}</strong> Titik IKM</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama IKM, produk, atau pemilik..."
            className="w-full pl-9 pr-20 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Cari
          </button>
        </form>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select
            value={selectedRegency}
            onChange={(e) => setSelectedRegency(e.target.value)}
            className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 w-full lg:w-56 font-medium"
          >
            <option value="ALL">Semua Kabupaten/Kota</option>
            {KABUPATEN_KOTA_SULUT.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 w-full lg:w-52 font-medium"
          >
            <option value="ALL">Semua Kategori</option>
            {KATEGORI_IKM_SULUT.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Map View */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
          <MapDisplay
            merchants={merchants}
            height="620px"
            selectedId={selectedMerchant?.id}
            onSelectMerchant={(m) => setSelectedMerchant(m)}
          />
        </div>

        {/* Sidebar List */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[620px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase">Daftar Tempat IKM</h3>
            <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
              {merchants.length}
            </span>
          </div>

          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {loading ? (
              <div className="text-center py-12 text-xs text-slate-400">Memuat data peta...</div>
            ) : merchants.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">Tidak ada IKM ditemukan.</div>
            ) : (
              merchants.map((m) => {
                const isSelected = selectedMerchant?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMerchant(m)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                        {m.businessName}
                      </h4>
                      <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                        {m.regency || m.district}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {m.mainProduct || m.category}
                    </p>

                    <div className="mt-1 text-[10px] text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{m.address}</span>
                    </div>

                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-sky-200/60 flex items-center justify-between">
                        <span className="text-[9px] text-sky-800 font-mono">
                          {m.registrationNo}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowModal(true);
                          }}
                          className="text-[10px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Lihat STBP
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
