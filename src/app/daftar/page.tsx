'use client';

import React, { useState, useEffect } from 'react';
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
  FileCheck,
  Loader2,
  Sparkles,
  Award
} from 'lucide-react';
import { KABUPATEN_KOTA_SULUT, KATEGORI_IKM_SULUT, SULUT_CENTER } from '@/lib/constants';

// Dynamic import for Leaflet map component to prevent SSR issues
const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
      Memuat peta interaktif Sulawesi Utara...
    </div>
  ),
});

export default function DaftarPage() {
  const [formData, setFormData] = useState({
    // 1. Identitas Usaha
    nik: '',
    ownerName: '',
    phone: '',
    email: '',
    businessName: '',
    regency: 'Kota Manado',
    district: '',
    village: '',
    address: '',
    yearFounded: new Date().getFullYear().toString(),
    employeeCount: 3,
    scale: 'KECIL',

    // 2. Data Produk
    category: KATEGORI_IKM_SULUT[0],
    mainProduct: '',
    productType: '',
    rawMaterial: '',
    productionCapacity: '',
    productPrice: 25000,
    productAdvantage: '',
    businessImage: '',
    ktpImage: '',

    // 3. Legalitas & Sertifikasi
    nib: '',
    businessLicense: 'Izin Usaha Mikro',
    npwp: '',
    halalCert: '',
    bpomPirt: '',
    haki: '',

    // 4. Finansial & Operasional
    monthlyRevenue: 10000000,
    fundingSource: 'Modal Mandiri',
    marketChannels: 'Offline & Marketplace Online',
    needs: 'Fasilitasi Sertifikasi Halal & Kurasi Pasar Ekspor',

    // GIS Coordinates
    latitude: SULUT_CENTER.latitude,
    longitude: SULUT_CENTER.longitude,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successResult, setSuccessResult] = useState<any>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(KATEGORI_IKM_SULUT as unknown as string[]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error('Error fetching categories in daftar:', err));
  }, []);

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

  // Upload image physically to server disk
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'ktpImage' | 'businessImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 5 MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Format file harus berupa gambar (JPG, PNG, atau WEBP)');
      return;
    }

    setUploadingField(field);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', field === 'ktpImage' ? 'ktp' : 'produk');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengunggah foto ke server fisik');
      }

      setFormData((prev) => ({
        ...prev,
        [field]: data.url,
      }));
    } catch (err: any) {
      console.error('Error uploading file:', err);
      alert(err.message || 'Terjadi kesalahan saat menyimpan berkas foto fisik.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.nik || formData.nik.length < 16) {
      setErrorMessage('NIK pemilik wajib diisi minimal 16 digit sesuai KTP.');
      return;
    }
    if (!formData.ownerName.trim()) {
      setErrorMessage('Nama lengkap pemilik wajib diisi.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Nomor WhatsApp aktif wajib diisi.');
      return;
    }
    if (!formData.businessName.trim()) {
      setErrorMessage('Nama IKM / unit usaha wajib diisi.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Alamat lokasi usaha wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-sky-700" />
          Formulir Pendataan IKM Provinsi Sulawesi Utara
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pendaftaran Industri Kecil dan Menengah (IKM)
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
          Daftarkan unit usaha IKM Anda di 15 Kabupaten/Kota untuk memperoleh Surat Tanda Bukti Pendaftaran (STBP-IKM) dan fasilitasi pembinaan dari Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara.
        </p>
      </div>

      {/* Success State */}
      {successResult ? (
        <div className="bg-white rounded-3xl border border-sky-200 p-8 sm:p-12 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Pendaftaran Berhasil Dikirim
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Selamat, Data IKM Anda Telah Masuk!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Data usaha Anda telah tercatat dalam basis data SIPIKEM SULUT dan saat ini berstatus <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Menunggu Verifikasi</span> oleh petugas Disperindag.
            </p>
          </div>

          {/* Registration Code Card */}
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2 shadow-xs">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Nomor Registrasi Anda (Simpan Nomor Ini):
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-sky-800 tracking-widest selection:bg-sky-200">
              {successResult.registrationNo}
            </div>
            <p className="text-xs text-slate-500">
              Nama IKM: <strong className="text-slate-800">{successResult.businessName}</strong> ({successResult.regency || successResult.district})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/tracking?q=${successResult.registrationNo}`}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Cek Status & Unduh Resi <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setSuccessResult(null);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all"
            >
              Daftarkan IKM Lain
            </button>
          </div>
        </div>
      ) : (
        /* Form Registration */
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <strong className="font-bold">Periksa Kembali Formulir:</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Section 1: Data Identitas Pemilik & IKM */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Data Identitas Pemilik & IKM
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                    placeholder="Contoh: 7171012345670001"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500">16 digit sesuai e-KTP.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="081234567890"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email (Opsional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ikm@sulutprov.go.id"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama IKM / Merek Usaha <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Contoh: CV. Minahasa Sukses Mandiri / Keripik Pisang Goroho Khas Sulut"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kabupaten / Kota di Sulawesi Utara <span className="text-rose-500">*</span>
                </label>
                <select
                  name="regency"
                  value={formData.regency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-bold text-slate-800"
                >
                  {KABUPATEN_KOTA_SULUT.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kecamatan
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="Kecamatan domisili IKM"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap Workshop / Rumah Produksi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nama jalan, nomor, RT/RW, dan patokan lokasi"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Data Produk IKM */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Data Produk & Kapasitas Produksi
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Komoditas IKM <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-semibold"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Produk Utama <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="mainProduct"
                  required
                  value={formData.mainProduct}
                  onChange={handleInputChange}
                  placeholder="Contoh: Abon Ikan Cakalang Fufu"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bahan Baku Utama (Sumber Lokal Sulut)
                </label>
                <input
                  type="text"
                  name="rawMaterial"
                  value={formData.rawMaterial}
                  onChange={handleInputChange}
                  placeholder="Ikan cakalang segar Bitung / Kelapa Minahasa"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kapasitas Produksi per Bulan
                </label>
                <input
                  type="text"
                  name="productionCapacity"
                  value={formData.productionCapacity}
                  onChange={handleInputChange}
                  placeholder="Contoh: 1.000 pouch / bulan"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Harga Satuan Produk (Rp)
                </label>
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleInputChange}
                  placeholder="25000"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Induk Berusaha (NIB)
                </label>
                <input
                  type="text"
                  name="nib"
                  value={formData.nib}
                  onChange={handleInputChange}
                  placeholder="9120001234567 atau kosongkan jika belum ada"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Titik Koordinat Peta Interaktif */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Titik Koordinat Peta Interaktif
                </h3>
                <p className="text-xs text-slate-500">
                  Tentukan posisi presisi workshop/gerai Anda pada peta GIS Sulawesi Utara.
                </p>
              </div>
            </div>

            <MapPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onChange={handleCoordinateChange}
            />
          </div>

          {/* Section 4: Unggah Foto Fisik */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Unggah Foto Fisik Produk & e-KTP
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* KTP */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Foto e-KTP Pemilik Usaha
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-sky-500 transition-colors bg-slate-50 relative">
                  {uploadingField === 'ktpImage' ? (
                    <div className="py-10 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
                      <span className="font-bold text-slate-700">Menyimpan berkas fisik ke server...</span>
                    </div>
                  ) : formData.ktpImage ? (
                    <div className="relative">
                      <img
                        src={formData.ktpImage}
                        alt="Preview KTP"
                        className="w-full h-36 object-cover rounded-xl shadow-xs"
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
                      <span className="text-xs font-bold text-sky-700 hover:text-sky-800">
                        Klik untuk upload foto e-KTP
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP (Maks 5 MB)</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={(e) => handleImageUpload(e, 'ktpImage')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Produk */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Foto Produk Utama / Tempat Produksi
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-sky-500 transition-colors bg-slate-50 relative">
                  {uploadingField === 'businessImage' ? (
                    <div className="py-10 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
                      <span className="font-bold text-slate-700">Menyimpan berkas fisik ke server...</span>
                    </div>
                  ) : formData.businessImage ? (
                    <div className="relative">
                      <img
                        src={formData.businessImage}
                        alt="Preview Produk"
                        className="w-full h-36 object-cover rounded-xl shadow-xs"
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
                      <span className="text-xs font-bold text-sky-700 hover:text-sky-800">
                        Klik untuk upload foto produk
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP (Maks 5 MB)</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={(e) => handleImageUpload(e, 'businessImage')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-sky-50 p-3.5 rounded-xl border border-sky-100">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                Dengan mengirimkan formulir ini, saya menyatakan bahwa data yang diisikan adalah benar dan bersedia dilakukan verifikasi oleh Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
            >
              {loading ? (
                <span>Memproses Pendaftaran...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Kirim Data Pendaftaran IKM
                </>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
