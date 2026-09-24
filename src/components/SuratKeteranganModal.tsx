'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { formatDateIndo, formatRupiah } from '@/lib/utils';
import { DISPERINDAG_SULUT } from '@/lib/constants';

interface SuratKeteranganModalProps {
  merchant: any;
  isOpen?: boolean;
  onClose: () => void;
}

export default function SuratKeteranganModal({
  merchant,
  isOpen = true,
  onClose,
}: SuratKeteranganModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (merchant && isOpen) {
      // Generate QR Code containing verification URL
      const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/tracking?q=${merchant.registrationNo}`;
      QRCode.toDataURL(verifyUrl, { width: 140, margin: 1 })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [merchant, isOpen]);

  if (!isOpen || !merchant) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* Action Header (Hidden in Print) */}
        <div className="no-print px-6 py-4 bg-[#0c233c] text-white flex items-center justify-between border-b border-[#163554]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-bold text-sm">Surat Tanda Bukti Pendaftaran IKM (STBP-IKM)</h3>
              <p className="text-[10px] text-sky-200">Dokumen Resmi Terverifikasi SIPIKEM SULUT</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-[1.02]"
            >
              <Printer className="w-4 h-4" /> Cetak / Unduh PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white" id="printable-certificate">
          
          {/* Kop Surat Resmi Disperindag Sulut */}
          <div className="border-b-4 border-double border-slate-900 pb-5 text-center relative flex items-center justify-center gap-5">
            <img 
              src="/logo-sipikem-icon.png" 
              alt="Logo SIPIKEM SULUT" 
              className="w-16 h-16 object-contain shrink-0" 
            />
            <div className="inline-block mb-1 text-center">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-600">
                Pemerintah Provinsi Sulawesi Utara
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                Dinas Perindustrian dan Perdagangan
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl mx-auto">
                Jl. Balai Kota No. 1, Tikala Ares, Manado, Sulawesi Utara • Telp: (0431) 851103 • Portal: SIPIKEM SULUT
              </p>
            </div>
          </div>

          {/* Title & Document Number */}
          <div className="text-center my-6">
            <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-900 underline underline-offset-4 decoration-2">
              Surat Tanda Bukti Pendaftaran IKM (STBP-IKM)
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Nomor Registrasi: <strong className="text-slate-900 font-mono tracking-wider">{merchant.registrationNo}</strong>
            </p>
          </div>

          {/* Intro Paragraph */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 text-justify">
            Berdasarkan Peraturan Pendataan dan Pembinaan Industri Kecil dan Menengah (IKM) Provinsi Sulawesi Utara, Kepala Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara menerangkan bahwa unit usaha IKM di bawah ini telah terdaftar secara sah pada Sistem Informasi Pembinaan IKM Sulawesi Utara (SIPIKEM SULUT):
          </p>

          {/* Data Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6 text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50 w-1/3">Nama Usaha / IKM</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{merchant.businessName}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Nama Pemilik / Penanggung Jawab</td>
                  <td className="py-2.5 px-4 text-slate-900">{merchant.ownerName} (NIK: {merchant.nik})</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Kabupaten / Kota</td>
                  <td className="py-2.5 px-4 text-slate-900 font-bold">{merchant.regency || merchant.district || 'Kota Manado'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Kategori & Produk Utama</td>
                  <td className="py-2.5 px-4 text-slate-900 font-medium">
                    {merchant.category} • <b>{merchant.mainProduct || merchant.businessName}</b>
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Nomor Induk Berusaha (NIB)</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-sky-900">
                    {merchant.nib || 'Dalam Proses Pemutakhiran'}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Alamat Workshop / Produksi</td>
                  <td className="py-2.5 px-4 text-slate-900 leading-snug">
                    {merchant.address}, Kec. {merchant.district || '-'}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Penilaian IKM Score</td>
                  <td className="py-2.5 px-4 font-bold text-sky-800">
                    Skor: {merchant.ikmScore || 70} / 100 ({merchant.ikmScore >= 86 ? 'Unggulan' : merchant.ikmScore >= 71 ? 'Maju' : merchant.ikmScore >= 51 ? 'Berkembang' : 'Pemula'})
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Status Pendampingan Disperindag</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    {merchant.mentoringStatus || 'Terdaftar dalam Pembinaan Provinsi'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Validation Footnote & QR Code */}
          <div className="grid grid-cols-2 gap-8 items-end mt-8 pt-4 border-t border-slate-200">
            {/* QR Code Section */}
            <div className="flex items-center gap-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code Verifikasi" className="w-24 h-24 border border-slate-300 p-1 rounded-lg" />
              ) : (
                <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-xs text-slate-400">QR Code</div>
              )}
              <div className="text-[11px] text-slate-500 leading-snug">
                <p className="font-semibold text-slate-800">Verifikasi Digital Resmi</p>
                <p>Pindai QR code ini untuk memastikan validitas dan status data IKM pada portal resmi SIPIKEM SULUT.</p>
              </div>
            </div>

            {/* Official Signature block */}
            <div className="text-center text-xs sm:text-sm">
              <p className="text-slate-600">Ditetapkan pada: {formatDateIndo(merchant.verifiedAt || new Date())}</p>
              <p className="font-bold text-slate-900 mt-1">An. KEPALA DINAS PERINDUSTRIAN DAN PERDAGANGAN<br />PROVINSI SULAWESI UTARA</p>
              <p className="text-slate-500 text-[11px]">Kepala Bidang Pembangunan Sumber Daya Industri</p>
              
              <div className="my-2 flex justify-center items-center h-14 relative">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-sky-600 flex items-center justify-center opacity-85 rotate-[-10deg]">
                  <span className="text-[8px] font-black text-sky-900 uppercase text-center leading-tight">
                    TERVERIFIKASI<br/>SIPIKEM<br/>SULUT
                  </span>
                </div>
              </div>

              <p className="font-bold text-slate-900 underline">{DISPERINDAG_SULUT.headOfAgency}</p>
              <p className="text-[10px] text-slate-500 font-mono">{DISPERINDAG_SULUT.nip}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
