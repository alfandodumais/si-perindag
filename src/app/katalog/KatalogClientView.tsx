'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Tag, 
  ExternalLink, 
  Award, 
  Sparkles, 
  Layers, 
  Building2, 
  X, 
  ArrowRight,
  MessageCircle,
  Clock,
  Eye,
  RotateCcw,
  Store,
  ChevronRight,
  FileCheck
} from 'lucide-react';
import { KABUPATEN_KOTA_SULUT } from '@/lib/constants';
import { formatRupiah } from '@/lib/utils';

interface KatalogClientViewProps {
  initialMerchants: any[];
  categories: string[];
}

export default function KatalogClientView({ initialMerchants, categories }: KatalogClientViewProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRegency, setSelectedRegency] = useState<string>('ALL');
  const [certFilter, setCertFilter] = useState<string>('ALL'); // ALL, HALAL, BPOM, NIB, HAKI
  const [selectedMerchant, setSelectedMerchant] = useState<any | null>(null);

  // Filter logic
  const filteredMerchants = useMemo(() => {
    return initialMerchants.filter((m) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = m.businessName?.toLowerCase().includes(q);
        const matchProduct = m.mainProduct?.toLowerCase().includes(q);
        const matchOwner = m.ownerName?.toLowerCase().includes(q);
        const matchRaw = m.rawMaterial?.toLowerCase().includes(q);
        const matchRegency = m.regency?.toLowerCase().includes(q);
        if (!matchName && !matchProduct && !matchOwner && !matchRaw && !matchRegency) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        if (m.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Regency filter
      if (selectedRegency !== 'ALL') {
        const reg = m.regency?.toLowerCase() || '';
        const target = selectedRegency.toLowerCase().replace(/^(kabupaten|kota|kab\.)\s*/i, '').trim();
        if (!reg.includes(target)) {
          return false;
        }
      }

      // Certification filter
      if (certFilter === 'HALAL') {
        if (!m.halalCert || m.halalCert === '-' || m.halalCert.toLowerCase().includes('belum')) return false;
      } else if (certFilter === 'BPOM') {
        if (!m.bpomPirt || m.bpomPirt === '-' || m.bpomPirt.toLowerCase().includes('belum')) return false;
      } else if (certFilter === 'NIB') {
        if (!m.nib || m.nib === '-' || m.nib.toLowerCase().includes('belum')) return false;
      } else if (certFilter === 'HAKI') {
        if (!m.haki || m.haki === '-' || m.haki.toLowerCase().includes('belum')) return false;
      }

      return true;
    });
  }, [initialMerchants, search, selectedCategory, selectedRegency, certFilter]);

  // Clean Regency Display Helper
  const formatRegencyName = (reg?: string) => {
    if (!reg) return 'Sulawesi Utara';
    return reg.replace(/^(Kabupaten|Kota|Kab\.)\s*/i, '').trim();
  };

  // WhatsApp Link Helper
  const getWhatsAppLink = (phone: string, businessName: string, mainProduct: string) => {
    if (!phone) return '#';
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    if (!clean.startsWith('62')) clean = '62' + clean;
    const msg = encodeURIComponent(
      `Halo ${businessName}, saya melihat produk "${mainProduct || 'unggulan'}" Anda di Katalog Resmi SIPIKEM SULUT (Disperindag Prov. Sulut). Boleh minta info pemesanan produk ini?`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const handleResetFilter = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedRegency('ALL');
    setCertFilter('ALL');
  };

  return (
    <div className="space-y-10 pb-24 bg-slate-50 min-h-screen">
      
      {/* HERO HEADER SECTION */}
      <section className="bg-gradient-to-br from-[#0c233c] via-[#113257] to-[#081a2e] text-white pt-12 pb-16 border-b border-sky-950 relative overflow-hidden">
        {/* Glow & accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
              Etalase Produk Resmi Binaan Disperindag Sulut
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Katalog Produk IKM Sulawesi Utara
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-normal">
              Eksplorasi ragam produk unggulan daerah dari industri kecil dan menengah terverifikasi sah di 15 Kabupaten/Kota: olahan kuliner khas, kerajinan kriya Bentenan, olahan kelapa, hingga perikanan bahari.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-white">{initialMerchants.length}</div>
              <div className="text-[11px] text-sky-200">IKM Terverifikasi Sah</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-amber-300">15</div>
              <div className="text-[11px] text-sky-200">Kabupaten / Kota</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-sky-400">{categories.length}</div>
              <div className="text-[11px] text-sky-200">Kategori Komoditas</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
              <div className="text-[11px] text-sky-200">Standar Binaan Resmi</div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH CONTROL BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl space-y-4">
          
          {/* Top Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk unggulan, nama IKM, nama pemilik, atau bahan baku..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none bg-slate-50/50"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedRegency}
                onChange={(e) => setSelectedRegency(e.target.value)}
                className="w-full sm:w-56 px-3.5 py-3 rounded-2xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="ALL">Semua Kabupaten/Kota (15)</option>
                {KABUPATEN_KOTA_SULUT.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>

              <select
                value={certFilter}
                onChange={(e) => setCertFilter(e.target.value)}
                className="w-full sm:w-48 px-3.5 py-3 rounded-2xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="ALL">Semua Legalitas</option>
                <option value="HALAL">Sertifikasi Halal</option>
                <option value="BPOM">BPOM / P-IRT</option>
                <option value="NIB">NIB Valid</option>
                <option value="HAKI">HAKI / Merek</option>
              </select>

              {(search || selectedCategory !== 'ALL' || selectedRegency !== 'ALL' || certFilter !== 'ALL') && (
                <button
                  onClick={handleResetFilter}
                  title="Reset Filter"
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 shrink-0 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#0c233c] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Kategori ({initialMerchants.length})
              </button>

              {categories.map((cat) => {
                const count = initialMerchants.filter(
                  (m) => m.category?.toLowerCase() === cat.toLowerCase()
                ).length;
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCTS GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Results count indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredMerchants.length}</strong> produk IKM terverifikasi
            {selectedCategory !== 'ALL' && <span> di kategori <strong className="text-sky-700">{selectedCategory}</strong></span>}
            {selectedRegency !== 'ALL' && <span> wilayah <strong className="text-sky-700">{selectedRegency}</strong></span>}
          </span>
          <span className="text-[11px] text-slate-400">
            Klik kartu untuk melihat rincian & kontak pemesanan
          </span>
        </div>

        {/* Empty state */}
        {filteredMerchants.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Tidak ada produk ditemukan</h3>
              <p className="text-xs text-slate-500">
                Tidak ada data IKM yang sesuai dengan kriteria filter atau kata kunci pencarian Anda.
              </p>
            </div>
            <button
              onClick={handleResetFilter}
              className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Semua Filter
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMerchants.map((m) => {
              const regencyClean = formatRegencyName(m.regency);
              const waLink = getWhatsAppLink(m.phone, m.businessName, m.mainProduct);

              return (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                      {m.businessImage ? (
                        <img
                          src={m.businessImage}
                          alt={m.mainProduct || m.businessName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
                          <ShoppingBag className="w-8 h-8 text-slate-300" />
                          <span className="text-[11px] font-semibold">Produk IKM Sulut</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0c233c]/85 text-white backdrop-blur-xs shadow-xs">
                          {m.category || 'IKM Sulut'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-600" />
                          {regencyClean}
                        </span>
                      </div>

                      {/* IKM Score Tier Badge at bottom of image */}
                      {m.ikmScore && (
                        <div className="absolute bottom-2.5 left-3">
                          <span className="px-2 py-0.5 rounded-md text-[9.5px] font-extrabold bg-amber-400/95 text-slate-950 shadow-xs">
                            Level {m.ikmScore}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {m.businessName} • {m.ownerName}
                        </p>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1 mt-0.5">
                          {m.mainProduct || m.businessName}
                        </h3>
                      </div>

                      {/* Raw Material info */}
                      {m.rawMaterial && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-sky-500 shrink-0" />
                          <span className="truncate">Bahan: {m.rawMaterial}</span>
                        </p>
                      )}

                      {/* Certifications badges row */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.nib && m.nib !== '-' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            <ShieldCheck className="w-3 h-3" /> NIB
                          </span>
                        )}
                        {m.halalCert && m.halalCert !== '-' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Halal
                          </span>
                        )}
                        {m.bpomPirt && m.bpomPirt !== '-' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            BPOM/P-IRT
                          </span>
                        )}
                        {m.haki && m.haki !== '-' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            HAKI
                          </span>
                        )}
                      </div>

                      {/* Price & Capacity */}
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Estimasi Harga</span>
                          <span className="text-sm font-black text-slate-900">
                            {m.productPrice ? formatRupiah(m.productPrice) : 'Hubungi IKM'}
                          </span>
                        </div>
                        {m.productionCapacity && (
                          <span className="text-[10.5px] text-slate-500 text-right truncate max-w-[110px]">
                            {m.productionCapacity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedMerchant(m)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Rincian</span>
                    </button>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Pesan</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* DETAIL MODAL */}
      {selectedMerchant && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedMerchant(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Banner */}
            <div className="relative h-56 bg-slate-900 shrink-0">
              {selectedMerchant.businessImage ? (
                <img
                  src={selectedMerchant.businessImage}
                  alt={selectedMerchant.mainProduct || selectedMerchant.businessName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0c233c] text-white">
                  <ShoppingBag className="w-12 h-12 text-sky-400" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              <button
                onClick={() => setSelectedMerchant(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-white">
                    {selectedMerchant.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                    Level {selectedMerchant.ikmScore || 'Berkembang'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black leading-tight">
                  {selectedMerchant.mainProduct || selectedMerchant.businessName}
                </h2>
                <p className="text-xs text-sky-200">
                  Diproduksi oleh <strong className="text-white">{selectedMerchant.businessName}</strong> ({selectedMerchant.ownerName})
                </p>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              
              {/* Grid 2 Columns Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Cluster 1: Spesifikasi Produk */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px] flex items-center gap-1.5 text-sky-700">
                    <Tag className="w-3.5 h-3.5" /> Spesifikasi Produk
                  </h4>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Harga Estimasi</span>
                      <span className="font-black text-sm text-slate-900">
                        {selectedMerchant.productPrice ? formatRupiah(selectedMerchant.productPrice) : 'Sesuai Pesanan'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Bahan Baku Utama</span>
                      <span className="font-semibold text-slate-800">{selectedMerchant.rawMaterial || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Kapasitas Produksi</span>
                      <span className="font-semibold text-slate-800">{selectedMerchant.productionCapacity || '-'}</span>
                    </div>
                    {selectedMerchant.productAdvantage && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Keunggulan Produk</span>
                        <span className="font-medium text-slate-700">{selectedMerchant.productAdvantage}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cluster 2: Legalitas & Sertifikasi */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px] flex items-center gap-1.5 text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" /> Legalitas & Sertifikasi
                  </h4>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-slate-400 block text-[10px]">NIB (Nomor Induk Berusaha)</span>
                      <span className="font-mono font-bold text-slate-800">{selectedMerchant.nib || 'Belum Ada'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Sertifikat Halal</span>
                      <span className="font-semibold text-slate-800">{selectedMerchant.halalCert || 'Belum Terbit'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Izin Edar BPOM / P-IRT</span>
                      <span className="font-semibold text-slate-800">{selectedMerchant.bpomPirt || 'Belum Terbit'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">HAKI / Merek Dagang</span>
                      <span className="font-semibold text-slate-800">{selectedMerchant.haki || 'Belum Terdaftar'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Cluster 3: Lokasi Usaha & Kontak */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2.5">
                <h4 className="font-extrabold text-slate-900 uppercase text-[11px] flex items-center gap-1.5 text-sky-800">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" /> Lokasi Kios / Rumah Produksi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Daerah</span>
                    <span className="font-bold text-slate-800">
                      {selectedMerchant.regency} • Kec. {selectedMerchant.district}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Alamat Lengkap</span>
                    <span className="font-medium text-slate-800">{selectedMerchant.address || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Saluran Pemasaran</span>
                    <span className="font-medium text-slate-800">{selectedMerchant.marketChannels || 'Offline'}</span>
                  </div>
                  {selectedMerchant.socialMedia && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">Media Sosial / Toko Online</span>
                      <span className="font-medium text-sky-700">{selectedMerchant.socialMedia}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <Link
                href={`/peta?id=${selectedMerchant.id}&search=${encodeURIComponent(selectedMerchant.businessName)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors"
              >
                <MapPin className="w-4 h-4 text-sky-600" />
                Lihat di Peta Sebaran GIS Sulut &rarr;
              </Link>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedMerchant(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Tutup
                </button>
                <a
                  href={getWhatsAppLink(selectedMerchant.phone, selectedMerchant.businessName, selectedMerchant.mainProduct)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
