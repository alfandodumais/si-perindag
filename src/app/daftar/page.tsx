'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Store, 
  Tag, 
  Layers, 
  DollarSign, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { KECAMATAN_MANADO, MANADO_CENTER, KATEGORI_USAHA } from '@/lib/constants';

// Dynamic import for Leaflet map component to prevent SSR issues
const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
      Memuat peta interaktif...
    </div>
  ),
});

export default function DaftarPage() {
  const [formData, setFormData] = useState({
    nik: '',
    ownerName: '',
    phone: '',
    email: '',
    businessName: '',
    category: KATEGORI_USAHA[0],
    scale: 'Mikro',
    monthlyRevenue: '',
    employeeCount: '1',
    address: '',
    district: 'Wenang',
    village: '',
    postalCode: '',
    latitude: MANADO_CENTER.latitude,
    longitude: MANADO_CENTER.longitude,
    ktpImage: '',
    businessImage: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successResult, setSuccessResult] = useState<any>(null);

  const categories = KATEGORI_USAHA;
  const districts = KECAMATAN_MANADO;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  // Convert uploaded image file to Base64 data URL for easy storage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'ktpImage' | 'businessImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 3 MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [field]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.nik || formData.nik.length < 16) {
      setErrorMessage('NIK wajib diisi minimal 16 digit sesuai KTP.');
      return;
    }
    if (!formData.ownerName.trim()) {
      setErrorMessage('Nama lengkap pemilik wajib diisi.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Nomor WhatsApp/HP aktif wajib diisi.');
      return;
    }
    if (!formData.businessName.trim()) {
      setErrorMessage('Nama usaha/toko wajib diisi.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Alamat lokasi usaha wajib diisi.');
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setErrorMessage('Titik koordinat usaha wajib ditentukan pada peta.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Terjadi kesalahan saat memproses pendaftaran');
      }

      setSuccessResult(data.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengirimkan formulir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          Formulir Pendataan Resmi
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Pendaftaran Usaha & Pedagang (UMKM)
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
          Silakan isi formulir di bawah ini dengan informasi yang valid dan tentukan titik koordinat tempat usaha Anda melalui peta.
        </p>
      </div>

      {/* Success Modal / State */}
      {successResult ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Pendaftaran Berhasil Dikirim
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Selamat, Data Usaha Anda Telah Masuk!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Permohonan Anda saat ini berstatus <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Menunggu Verifikasi</span> oleh petugas Dinas Perdagangan.
            </p>
          </div>

          {/* Registration Code Card */}
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2 shadow-sm">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Nomor Registrasi Anda (Simpan Nomor Ini):
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-perindag-700 tracking-widest selection:bg-emerald-200">
              {successResult.registrationNo}
            </div>
            <p className="text-xs text-slate-500">
              Nama Usaha: <strong className="text-slate-800">{successResult.businessName}</strong> ({successResult.ownerName})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/tracking?q=${successResult.registrationNo}`}
              className="w-full sm:w-auto px-6 py-3 bg-perindag-600 hover:bg-perindag-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Cek Status & Unduh Resi <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setSuccessResult(null);
                setFormData({
                  nik: '',
                  ownerName: '',
                  phone: '',
                  email: '',
                  businessName: '',
                  category: KATEGORI_USAHA[0],
                  scale: 'Mikro',
                  monthlyRevenue: '',
                  employeeCount: '1',
                  address: '',
                  district: 'Wenang',
                  village: '',
                  postalCode: '',
                  latitude: MANADO_CENTER.latitude,
                  longitude: MANADO_CENTER.longitude,
                  ktpImage: '',
                  businessImage: '',
                });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
            >
              Daftarkan Usaha Lain
            </button>
          </div>
        </div>
      ) : (
        /* Form Registration */
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <strong className="font-bold">Periksa Kembali Formulir:</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Section 1: Data Identitas Pemilik */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Data Identitas Pemilik Usaha
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    required
                    value={formData.nik}
                    onChange={handleInputChange}
                    placeholder="Contoh: 1472012345670001"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500 font-mono"
                  />
                </div>
                <span className="text-[11px] text-slate-500">Wajib 16 digit sesuai e-KTP.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pemilik <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="ownerName"
                    required
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="Nama sesuai KTP"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500 font-mono"
                  />
                </div>
                <span className="text-[11px] text-slate-500">Digunakan untuk informasi hasil verifikasi.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email (Opsional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Data Profil Usaha */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Profil & Jenis Usaha
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Usaha / Merk Dagang / Toko <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Contoh: Toko Berkah Jaya / Kedai Kopi Nusantara"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Usaha / Komoditas <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skala Usaha <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    name="scale"
                    value={formData.scale}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500 bg-white"
                  >
                    <option value="Mikro">Usaha Mikro (Omset &lt; 300 Juta/thn)</option>
                    <option value="Kecil">Usaha Kecil (Omset 300 Jt - 2,5 Miliar/thn)</option>
                    <option value="Menengah">Usaha Menengah (Omset 2,5 M - 50 Miliar/thn)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimasi Omset Rata-rata / Bulan (Rp)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    name="monthlyRevenue"
                    value={formData.monthlyRevenue}
                    onChange={handleInputChange}
                    placeholder="Contoh: 15000000"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Tenaga Kerja / Karyawan
                </label>
                <input
                  type="number"
                  name="employeeCount"
                  min="1"
                  value={formData.employeeCount}
                  onChange={handleInputChange}
                  placeholder="Jumlah orang"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Alamat & Titik Koordinat Peta */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Alamat & Titik Koordinat Peta
                </h3>
                <p className="text-xs text-slate-500">
                  Tentukan posisi gerai/toko Anda pada peta digital agar diverifikasi lokasinya oleh dinas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Lokasi Usaha <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jl. Pierre Tendean (Boulevard) No. 45 / Kawasan Megamas"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kecamatan <span className="text-rose-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500 bg-white"
                >
                  {districts.map((dis) => (
                    <option key={dis} value={dis}>{dis}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelurahan / Desa
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  placeholder="Contoh: Wenang Selatan / Bahu / Ranotana / Paniki Bawah"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500"
                />
              </div>
            </div>

            {/* Interactive Leaflet Map Picker Component */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Titik Koordinat Pada Peta Interaktif <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 mb-3">
                Geser pin hijau atau klik lokasi tempat berdagang Anda pada peta berikut. Anda juga dapat menggunakan tombol deteksi lokasi otomatis atau kolom pencarian alamat.
              </p>
              
              <MapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={handleCoordinateChange}
              />
            </div>
          </div>

          {/* Section 4: Berkas & Foto Pendukung */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Unggah Berkas / Foto Dokumentasi
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* KTP Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Foto e-KTP Pemilik Usaha
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50 relative">
                  {formData.ktpImage ? (
                    <div className="relative">
                      <img
                        src={formData.ktpImage}
                        alt="Preview KTP"
                        className="w-full h-36 object-cover rounded-xl shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, ktpImage: '' }))}
                        className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] px-2 py-1 rounded shadow"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                        Klik untuk upload foto KTP
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Format JPG, PNG (Maks 3 MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'ktpImage')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Toko / Usaha Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Foto Toko / Gerai / Produk Usaha
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50 relative">
                  {formData.businessImage ? (
                    <div className="relative">
                      <img
                        src={formData.businessImage}
                        alt="Preview Toko"
                        className="w-full h-36 object-cover rounded-xl shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, businessImage: '' }))}
                        className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] px-2 py-1 rounded shadow"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Store className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                        Klik untuk upload foto gerai / usaha
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Format JPG, PNG (Maks 3 MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'businessImage')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pernyataan & Submit */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Dengan menekan tombol submit, saya menyatakan bahwa data yang diisikan adalah benar dan bersedia dilakukan verifikasi oleh petugas Dinas Perdagangan sesuai ketentuan yang berlaku.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Memproses Pendaftaran...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Kirim Pendaftaran Usaha
                </>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
