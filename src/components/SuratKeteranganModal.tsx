'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { formatDateIndo, formatRupiah } from '@/lib/utils';

interface SuratKeteranganModalProps {
  merchant: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function SuratKeteranganModal({
  merchant,
  isOpen,
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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Action Header (Hidden in Print) */}
        <div className="no-print px-6 py-4 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-sm">Dokumen Tanda Bukti Pendaftaran Usaha (STBP)</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow transition-colors"
            >
              <Printer className="w-4 h-4" /> Cetak Dokumen / Simpan PDF
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
          
          {/* Kop Surat Resmi */}
          <div className="border-b-4 border-double border-slate-900 pb-5 text-center relative">
            <div className="inline-block mb-1">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-600">
                Pemerintah Kota Manado
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                Dinas Perindustrian dan Perdagangan
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Jl. Balai Kota No. 1, Tikala Ares, Kec. Tikala, Kota Manado • Telp: (0431) 851103 • Email: disperindag@manadokota.go.id
              </p>
            </div>
          </div>

          {/* Title & Document Number */}
          <div className="text-center my-6">
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-slate-900 underline underline-offset-4 decoration-2">
              Surat Tanda Pendaftaran Usaha Perdagangan
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Nomor Registrasi: <strong className="text-slate-900 font-mono tracking-wider">{merchant.registrationNo}</strong>
            </p>
          </div>

          {/* Intro Paragraph */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 text-justify">
            Berdasarkan Peraturan Pendataan dan Pembinaan Usaha Perdagangan Mikro, Kecil, dan Menengah (UMKM), Kepala Dinas Perindustrian dan Perdagangan menerangkan bahwa pelaku usaha berikut ini telah terdaftar secara resmi pada basis data sistem informasi perdagangan:
          </p>

          {/* Data Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden mb-6 text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50 w-1/3">Nama Usaha / Toko</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{merchant.businessName}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Nama Pemilik / Penanggung Jawab</td>
                  <td className="py-2.5 px-4 text-slate-900">{merchant.ownerName}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Kategori Komoditas</td>
                  <td className="py-2.5 px-4 text-slate-900 font-medium">{merchant.category} ({merchant.scale})</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Alamat Tempat Usaha</td>
                  <td className="py-2.5 px-4 text-slate-900 leading-snug">
                    {merchant.address}, Kec. {merchant.district} {merchant.village ? `, Kel. ${merchant.village}` : ''}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Titik Koordinat (GIS)</td>
                  <td className="py-2.5 px-4 font-mono text-xs text-slate-700">
                    Latitude: {merchant.latitude} | Longitude: {merchant.longitude}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Status Verifikasi</td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-full ${
                      merchant.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      merchant.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {merchant.status === 'APPROVED' ? 'TERVERIFIKASI SAH' :
                       merchant.status === 'PENDING' ? 'DALAM PROSES VERIFIKASI' : 'DITOLAK'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 bg-slate-50">Tanggal Pendaftaran</td>
                  <td className="py-2.5 px-4 text-slate-900">{formatDateIndo(merchant.createdAt)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Validation Footnote & QR Code */}
          <div className="grid grid-cols-2 gap-8 items-end mt-10 pt-4 border-t border-slate-200">
            {/* QR Code Section */}
            <div className="flex items-center gap-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code Verifikasi" className="w-24 h-24 border border-slate-300 p-1 rounded-lg" />
              ) : (
                <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-xs text-slate-400">QR Code</div>
              )}
              <div className="text-[11px] text-slate-500 leading-snug">
                <p className="font-semibold text-slate-800">Verifikasi Digital</p>
                <p>Pindai QR code ini untuk memastikan keaslian data pendaftaran pada portal resmi Dinas Perdagangan.</p>
              </div>
            </div>

            {/* Official Signature block */}
            <div className="text-center text-xs sm:text-sm">
              <p className="text-slate-600">Ditetapkan pada: {formatDateIndo(merchant.verifiedAt || new Date())}</p>
              <p className="font-bold text-slate-900 mt-1">An. KEPALA DINAS PERINDUSTRIAN & PERDAGANGAN KOTA MANADO</p>
              <p className="text-slate-600 text-xs">Petugas Verifikator Pelayanan Usaha</p>
              
              <div className="my-3 flex justify-center items-center h-16 relative">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center opacity-80 rotate-[-12deg]">
                  <span className="text-[9px] font-bold text-emerald-800 uppercase text-center leading-tight">
                    TERVERIFIKASI<br/>RESMI
                  </span>
                </div>
              </div>

              <p className="font-bold text-slate-900 underline">{merchant.verifiedBy || 'Administrator Verifikator'}</p>
              <p className="text-[10px] text-slate-500 font-mono">NIP. 19820514 200801 1 008</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
