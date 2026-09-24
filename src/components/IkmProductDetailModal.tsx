'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
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
  Eye,
  FileCheck,
  Store
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface IkmProductDetailModalProps {
  merchant: any | null;
  isOpen: boolean;
  onClose: () => void;
  showMapButton?: boolean;
  onOpenCertificate?: (merchant: any) => void;
}

export default function IkmProductDetailModal({
  merchant,
  isOpen,
  onClose,
  showMapButton = false,
  onOpenCertificate,
}: IkmProductDetailModalProps) {
  if (!isOpen || !merchant) return null;

  // WhatsApp Link Generator
  const getWhatsAppLink = (phone?: string, businessName?: string, mainProduct?: string) => {
    if (!phone) return '#';
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (!clean.startsWith('62')) {
      clean = '62' + clean;
    }
    const text = encodeURIComponent(
      `Halo ${businessName || 'Pelaku IKM'},\nsaya melihat profil usaha Anda di Portal SIPIKEM SULUT (Dinas Perindustrian dan Perdagangan Prov. Sulawesi Utara).\nSaya tertarik untuk memesan atau mengetahui info lebih lanjut mengenai produk "${mainProduct || businessName}".\nTerima kasih.`
    );
    return `https://wa.me/${clean}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header with Product Image */}
        <div className="relative h-56 bg-slate-900 shrink-0">
          {merchant.businessImage ? (
            <img
              src={merchant.businessImage}
              alt={merchant.mainProduct || merchant.businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c233c] to-[#163a5f] text-white">
              <ShoppingBag className="w-16 h-16 text-sky-400 opacity-80" />
            </div>
          )}
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-10"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Title Info */}
          <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-white shadow-xs">
                {merchant.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                Level {merchant.ikmScore || 'Berkembang'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/20 text-white backdrop-blur-xs">
                {merchant.registrationNo}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-sm">
              {merchant.mainProduct || merchant.businessName}
            </h2>
            <p className="text-xs text-sky-200">
              Diproduksi oleh <strong className="text-white">{merchant.businessName}</strong> ({merchant.ownerName})
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          
          {/* Grid 2 Columns Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Cluster 1: Spesifikasi Produk */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <h4 className="font-extrabold text-slate-900 uppercase text-[11px] flex items-center gap-1.5 text-sky-700">
                <Tag className="w-3.5 h-3.5" /> Spesifikasi Produk
              </h4>
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-400 block text-[10px]">Harga Estimasi</span>
                  <span className="font-black text-sm text-slate-900">
                    {merchant.productPrice ? formatRupiah(merchant.productPrice) : 'Sesuai Pesanan'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Bahan Baku Utama</span>
                  <span className="font-semibold text-slate-800">{merchant.rawMaterial || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kapasitas Produksi</span>
                  <span className="font-semibold text-slate-800">{merchant.productionCapacity || '-'}</span>
                </div>
                {merchant.productAdvantage && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Keunggulan Produk</span>
                    <span className="font-medium text-slate-700">{merchant.productAdvantage}</span>
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
                  <span className="font-mono font-bold text-slate-800">{merchant.nib || 'Belum Ada'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sertifikat Halal</span>
                  <span className="font-semibold text-slate-800">{merchant.halalCert || 'Belum Terbit'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Izin Edar BPOM / P-IRT</span>
                  <span className="font-semibold text-slate-800">{merchant.bpomPirt || 'Belum Terbit'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">HAKI / Merek Dagang</span>
                  <span className="font-semibold text-slate-800">{merchant.haki || 'Belum Terdaftar'}</span>
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
                  {merchant.regency} • Kec. {merchant.district}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Alamat Lengkap</span>
                <span className="font-medium text-slate-800">{merchant.address || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Saluran Pemasaran</span>
                <span className="font-medium text-slate-800">{merchant.marketChannels || 'Offline'}</span>
              </div>
              {merchant.socialMedia && (
                <div>
                  <span className="text-slate-400 block text-[10px]">Media Sosial / Toko Online</span>
                  <span className="font-medium text-sky-700">{merchant.socialMedia}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {showMapButton ? (
            <Link
              href={`/peta?id=${merchant.id}&search=${encodeURIComponent(merchant.businessName)}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors"
            >
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Lihat di Peta Sebaran GIS Sulut &rarr;</span>
            </Link>
          ) : onOpenCertificate ? (
            <button
              type="button"
              onClick={() => onOpenCertificate(merchant)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors"
            >
              <FileCheck className="w-4 h-4 text-sky-600" />
              <span>Lihat STBP-IKM Resmi</span>
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
            >
              Tutup
            </button>
            <a
              href={getWhatsAppLink(merchant.phone, merchant.businessName, merchant.mainProduct)}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
