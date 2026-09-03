'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import SuratKeteranganModal from '@/components/SuratKeteranganModal';
import { KECAMATAN_MANADO } from '@/lib/constants';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Download, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Store, 
  Layers, 
  DollarSign, 
  AlertCircle,
  X,
  Printer,
  ChevronRight
} from 'lucide-react';
import { formatDateIndo, formatDateTimeIndo, formatRupiah } from '@/lib/utils';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-48 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">Memuat peta lokasi...</div>,
});

function VerifikasiContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';
  const initialId = searchParams.get('id') || '';

  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected merchant for Verification Modal
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);

  // Fetch session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserSession(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch merchants list
  const fetchMerchants = async () => {
    setLoading(true);
    try {
      let url = `/api/merchants?limit=200`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      if (districtFilter !== 'ALL') url += `&district=${encodeURIComponent(districtFilter)}`;
      if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMerchants(data.data);

        // If URL has specific ID, auto-open that merchant modal
        if (initialId) {
          const found = data.data.find((m: any) => m.id === initialId);
          if (found) {
            setSelectedMerchant(found);
            setActionNotes(found.adminNotes || '');
          }
        }
      }
    } catch (err) {
      console.error('Error loading merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [statusFilter, districtFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMerchants();
  };

  // Process Verification (Approve / Reject)
  const handleVerifyAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedMerchant) return;

    if (status === 'REJECTED' && !actionNotes.trim()) {
      alert('Alasan penolakan / catatan revisi wajib diisi jika Anda menolak pendaftaran ini.');
      return;
    }

    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/merchants/${selectedMerchant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes: actionNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memproses verifikasi');
      }

      // Update local state
      setSelectedMerchant(data.data);
      fetchMerchants();
      alert(`Permohonan ${selectedMerchant.businessName} berhasil ${status === 'APPROVED' ? 'DISETUJUI' : 'DITOLAK'}!`);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (merchants.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }

    const headers = [
      'Nomor Registrasi',
      'NIK',
      'Nama Pemilik',
      'Nomor Telepon',
      'Email',
      'Nama Usaha',
      'Kategori',
      'Skala Usaha',
      'Alamat',
      'Kecamatan',
      'Latitude',
      'Longitude',
      'Status Verifikasi',
      'Catatan Petugas',
      'Tanggal Pendaftaran',
    ];

    const rows = merchants.map((m) => [
      `"${m.registrationNo}"`,
      `"${m.nik}"`,
      `"${m.ownerName}"`,
      `"${m.phone}"`,
      `"${m.email || '-'}"`,
      `"${m.businessName}"`,
      `"${m.category}"`,
      `"${m.scale}"`,
      `"${m.address.replace(/"/g, '""')}"`,
      `"${m.district}"`,
      `"${m.latitude}"`,
      `"${m.longitude}"`,
      `"${m.status}"`,
      `"${(m.adminNotes || '').replace(/"/g, '""')}"`,
      `"${new Date(m.createdAt).toLocaleDateString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_umkm_perindag_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const districts = ['ALL', ...KECAMATAN_MANADO];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AdminNavbar user={userSession} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              Modul Verifikasi Petugas
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Verifikasi Pendaftaran Pelaku Usaha (UMKM)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Periksa kelengkapan berkas, validitas KTP, dan akurasi titik koordinat usaha sebelum menerbitkan tanda terdaftar resmi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Export CSV / Excel
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Semua Permohonan', value: 'ALL' },
              { label: 'Menunggu Verifikasi (Pending)', value: 'PENDING', badgeBg: 'bg-amber-100 text-amber-800' },
              { label: 'Telah Disetujui (Approved)', value: 'APPROVED', badgeBg: 'bg-emerald-100 text-emerald-800' },
              { label: 'Ditolak / Revisi (Rejected)', value: 'REJECTED', badgeBg: 'bg-rose-100 text-rose-800' },
            ].map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
            <form onSubmit={handleSearch} className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama usaha, pemilik, NIK, atau nomor pendaftaran..."
                className="w-full pl-10 pr-24 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Cari
              </button>
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-48"
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

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. Registrasi</th>
                  <th className="py-3.5 px-4">Nama Usaha & Komoditas</th>
                  <th className="py-3.5 px-4">Pemilik & Kontak</th>
                  <th className="py-3.5 px-4">Lokasi & Kecamatan</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Memuat daftar permohonan...
                    </td>
                  </tr>
                ) : merchants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tidak ada permohonan yang sesuai kriteria filter.
                    </td>
                  </tr>
                ) : (
                  merchants.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Reg No */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {m.registrationNo}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {formatDateTimeIndo(m.createdAt)}
                        </div>
                      </td>

                      {/* Business & Category */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{m.businessName}</div>
                        <div className="text-xs text-slate-500">
                          {m.category} • <span className="text-emerald-700 font-semibold">{m.scale}</span>
                        </div>
                      </td>

                      {/* Owner & Phone */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">{m.ownerName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{m.phone}</div>
                        <div className="text-[10px] text-slate-400 font-mono">NIK: {m.nik}</div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">Kec. {m.district}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]" title={m.address}>
                          {m.address}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 text-center">
                        {m.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Disetujui
                          </span>
                        )}
                        {m.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
                          </span>
                        )}
                        {m.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Ditolak
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedMerchant(m);
                            setActionNotes(m.adminNotes || '');
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review & Verifikasi</span>
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Detail & Verifikasi */}
        {selectedMerchant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
              
              {/* Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Verifikasi Permohonan Pendaftaran UMKM</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      No. Registrasi: {selectedMerchant.registrationNo}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMerchant(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
                
                {/* Status Indicator */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">Status Saat Ini:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      selectedMerchant.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      selectedMerchant.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedMerchant.status}
                    </span>
                  </div>

                  {selectedMerchant.status === 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => setShowCertificateModal(true)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Lihat & Cetak Surat Terdaftar (PDF)
                    </button>
                  )}
                </div>

                {/* Detail Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Col: Pemilik & Usaha */}
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                        1. Data Pemilik Usaha
                      </h4>
                      <div className="text-xs sm:text-sm space-y-2">
                        <div>
                          <span className="text-slate-400 text-xs block">Nama Lengkap Pemilik:</span>
                          <strong className="text-slate-900">{selectedMerchant.ownerName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs block">NIK KTP:</span>
                          <strong className="font-mono text-slate-800">{selectedMerchant.nik}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs block">WhatsApp / Telepon:</span>
                          <a href={`https://wa.me/${selectedMerchant.phone.replace(/^0/, '62')}`} target="_blank" className="text-emerald-700 font-mono font-bold hover:underline">
                            {selectedMerchant.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs block">Email:</span>
                          <span className="text-slate-700">{selectedMerchant.email || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                        2. Profil Usaha
                      </h4>
                      <div className="text-xs sm:text-sm space-y-2">
                        <div>
                          <span className="text-slate-400 text-xs block">Nama Toko / Usaha:</span>
                          <strong className="text-slate-900">{selectedMerchant.businessName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs block">Kategori Komoditas:</span>
                          <span className="text-slate-800 font-semibold">{selectedMerchant.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs block">Skala & Karyawan:</span>
                          <span className="text-slate-800">{selectedMerchant.scale} • {selectedMerchant.employeeCount || 1} Tenaga Kerja</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs block">Estimasi Omset Bulanan:</span>
                          <span className="font-mono font-bold text-emerald-800">{formatRupiah(selectedMerchant.monthlyRevenue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Alamat & Titik Koordinat */}
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                        3. Lokasi & Titik Koordinat Maps
                      </h4>
                      <div className="text-xs sm:text-sm space-y-2">
                        <div>
                          <span className="text-slate-400 text-xs block">Alamat Usaha:</span>
                          <p className="text-slate-800">{selectedMerchant.address}</p>
                        </div>
                        <div className="flex justify-between">
                          <span>Kecamatan: <strong>{selectedMerchant.district}</strong></span>
                          <span>Kelurahan: <strong>{selectedMerchant.village || '-'}</strong></span>
                        </div>
                        <div className="font-mono text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                          Lat: <strong>{selectedMerchant.latitude}</strong> | Lng: <strong>{selectedMerchant.longitude}</strong>
                        </div>
                      </div>

                      {/* Map Mini Preview */}
                      <div className="pt-2">
                        <MapPicker
                          latitude={selectedMerchant.latitude}
                          longitude={selectedMerchant.longitude}
                          onChange={() => {}} // Read-only in review
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Uploaded Documents / Photos */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                    4. Berkas / Foto Terlampir
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-500 block mb-1">Foto e-KTP Pemohon:</span>
                      {selectedMerchant.ktpImage ? (
                        <a href={selectedMerchant.ktpImage} target="_blank" rel="noreferrer">
                          <img
                            src={selectedMerchant.ktpImage}
                            alt="KTP Pemohon"
                            className="w-full h-44 object-cover rounded-xl border border-slate-200 hover:opacity-90 transition-opacity"
                          />
                        </a>
                      ) : (
                        <div className="h-44 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">
                          Tidak ada foto KTP
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-xs text-slate-500 block mb-1">Foto Tempat Usaha / Produk:</span>
                      {selectedMerchant.businessImage ? (
                        <a href={selectedMerchant.businessImage} target="_blank" rel="noreferrer">
                          <img
                            src={selectedMerchant.businessImage}
                            alt="Tempat Usaha"
                            className="w-full h-44 object-cover rounded-xl border border-slate-200 hover:opacity-90 transition-opacity"
                          />
                        </a>
                      ) : (
                        <div className="h-44 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">
                          Tidak ada foto usaha
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification Decision Form */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Keputusan Verifikasi Petugas Dinas Perdagangan
                  </h4>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catatan Verifikator (Wajib diisi jika menolak / Opsional jika menyetujui):
                    </label>
                    <textarea
                      rows={3}
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Contoh: Dokumen KTP dan foto tempat usaha lengkap dan valid. Lokasi telah diverifikasi."
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={submittingAction}
                      onClick={() => handleVerifyAction('REJECTED')}
                      className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Tolak Permohonan (Minta Revisi)
                    </button>

                    <button
                      type="button"
                      disabled={submittingAction}
                      onClick={() => handleVerifyAction('APPROVED')}
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Setujui Permohonan (Terbitkan Tanda Terdaftar)
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {selectedMerchant && (
          <SuratKeteranganModal
            merchant={selectedMerchant}
            isOpen={showCertificateModal}
            onClose={() => setShowCertificateModal(false)}
          />
        )}

      </main>
    </div>
  );
}

export default function VerifikasiPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Memuat halaman verifikasi...</div>}>
      <VerifikasiContent />
    </Suspense>
  );
}
