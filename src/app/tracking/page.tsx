'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MapPin, 
  Store, 
  Calendar, 
  Printer, 
  AlertCircle,
  FileCheck2,
  Phone,
  User,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { formatDateIndo } from '@/lib/utils';
import SuratKeteranganModal from '@/components/SuratKeteranganModal';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const fetchTrackingData = async (searchTarget: string) => {
    if (!searchTarget.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setResult(null);

    try {
      const res = await fetch(`/api/merchants/track?q=${encodeURIComponent(searchTarget.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Data pendaftaran IKM tidak ditemukan');
      }

      setResult(data.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal melakukan pencarian');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTrackingData(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackingData(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-sky-700" />
          Layanan Cek Status Mandiri Pelaku IKM
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cek Status Pendaftaran IKM (STBP)
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
          Pantau status verifikasi pendaftaran IKM Anda dengan memasukkan Nomor Registrasi (REG-...) atau Nomor NIK KTP pemilik.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masukkan No. Registrasi (cth: REG-2026-0001) atau 16 digit NIK"
              className="w-full pl-12 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 active:from-sky-700 active:to-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {loading ? 'Mencari...' : 'Lacak Status IKM'}
          </button>
        </form>

        {/* Example hint */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>Contoh nomor registrasi:</span>
          <button
            type="button"
            onClick={() => {
              setQuery('REG-2026-0001');
              fetchTrackingData('REG-2026-0001');
            }}
            className="text-sky-700 font-mono font-bold underline hover:text-sky-900"
          >
            REG-2026-0001
          </button>
          <span>atau</span>
          <button
            type="button"
            onClick={() => {
              setQuery('REG-2026-0002');
              fetchTrackingData('REG-2026-0002');
            }}
            className="text-sky-700 font-mono font-bold underline hover:text-sky-900"
          >
            REG-2026-0002
          </button>
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-xs sm:text-sm mb-8 animate-fadeIn">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <strong className="font-bold">Data Tidak Ditemukan:</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden animate-fadeIn space-y-6 p-6 sm:p-8">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                NO. REGISTRASI IKM:
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                {result.registrationNo}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Didaftarkan pada: {formatDateIndo(result.createdAt)}
              </p>
            </div>

            {/* Status Badge */}
            <div>
              {result.status === 'APPROVED' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  TERVERIFIKASI SAH
                </div>
              )}
              {result.status === 'PENDING' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  DALAM PROSES VERIFIKASI
                </div>
              )}
              {result.status === 'REJECTED' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs sm:text-sm">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  PERLU REVISI / DITOLAK
                </div>
              )}
            </div>
          </div>

          {/* Rejection / Note banner if any */}
          {result.adminNotes && (
            <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
              result.status === 'APPROVED' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="font-bold flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4" />
                Catatan dari Petugas Verifikator Dinas:
              </div>
              <p className="leading-relaxed pl-6">{result.adminNotes}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-slate-200 pb-2">
                Profil Usaha IKM
              </h3>
              <div className="text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama IKM:</span>
                  <span className="font-bold text-slate-900">{result.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Produk Utama:</span>
                  <span className="font-bold text-slate-800">{result.mainProduct || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori:</span>
                  <span className="font-semibold text-slate-800">{result.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NIB:</span>
                  <span className="font-mono font-bold text-slate-900">{result.nib || 'Belum Ada'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IKM Score:</span>
                  <span className="font-bold text-sky-800">{result.ikmScore || 70} / 100</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-slate-200 pb-2">
                Identitas Pemilik & Wilayah
              </h3>
              <div className="text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pemilik:</span>
                  <span className="font-bold text-slate-900">{result.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NIK (Tersamar):</span>
                  <span className="font-mono text-slate-700">{result.nikMasked || result.nik}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kabupaten/Kota:</span>
                  <span className="font-bold text-slate-900">{result.regency || result.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Alamat:</span>
                  <span className="text-slate-800 text-right truncate max-w-[200px]">{result.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              {result.status === 'APPROVED' ? (
                <span>Surat Tanda Bukti Pendaftaran IKM (STBP-IKM) sah siap diunduh atau dicetak.</span>
              ) : result.status === 'PENDING' ? (
                <span>Verifikasi berkas umumnya memakan waktu 1-3 hari kerja.</span>
              ) : (
                <span>Silakan lakukan pendaftaran ulang dengan berkas yang sudah diperbaiki.</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {result.status === 'APPROVED' && (
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Cetak Surat Terdaftar (PDF)
                </button>
              )}

              {result.status === 'REJECTED' && (
                <a
                  href="/daftar"
                  className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow transition-all text-center"
                >
                  Daftar Ulang Sekarang
                </a>
              )}
            </div>
          </div>

          {/* Printable Certificate Modal */}
          <SuratKeteranganModal
            merchant={result}
            isOpen={showCertificateModal}
            onClose={() => setShowCertificateModal(false)}
          />

        </div>
      )}

    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Memuat halaman pelacakan IKM...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
