import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Building2, 
  MapPin, 
  FileCheck2, 
  Search, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Store,
  ChevronRight
} from 'lucide-react';
import dynamic from 'next/dynamic';

const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
      Memuat peta sebaran interaktif...
    </div>
  ),
});

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  // Fetch high-level statistics & approved merchants for the public map
  const [totalMerchants, approvedMerchants, pendingMerchants, sampleLocations] = await Promise.all([
    prisma.merchantRegistration.count(),
    prisma.merchantRegistration.count({ where: { status: 'APPROVED' } }),
    prisma.merchantRegistration.count({ where: { status: 'PENDING' } }),
    prisma.merchantRegistration.findMany({
      where: { status: 'APPROVED' },
      take: 20,
      select: {
        id: true,
        registrationNo: true,
        businessName: true,
        ownerName: true,
        category: true,
        scale: true,
        address: true,
        district: true,
        status: true,
        latitude: true,
        longitude: true,
        businessImage: true,
      },
    }),
  ]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-perindag-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#16a34a10_1px,transparent_1px),linear-gradient(to_bottom,#16a34a10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Portal Resmi Pendataan & Verifikasi Usaha
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Daftarkan & Petakan <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
                  Usaha UMKM Anda
                </span>
              </h1>
              
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Sistem Informasi Terpadu Dinas Perdagangan memudahkan pedagang dan pelaku UMKM memperoleh Tanda Bukti Pendaftaran resmi pemerintah dengan integrasi titik koordinat peta digital.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/daftar"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Store className="w-5 h-5" />
                  Mulai Daftar Usaha
                </Link>
                
                <Link
                  href="/tracking"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Search className="w-5 h-5 text-slate-400" />
                  Cek Status Pendaftaran
                </Link>
              </div>

              {/* Verified Badge info */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Gratis Tanpa Biaya
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Terbit Surat Tanda Terdaftar
                </span>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 backdrop-blur border border-slate-700/80 rounded-2xl shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">{totalMerchants}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Total Pelaku Usaha Terdata</div>
              </div>

              <div className="p-6 bg-slate-800/50 backdrop-blur border border-slate-700/80 rounded-2xl shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">{approvedMerchants}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Telah Disetujui & Terverifikasi</div>
              </div>

              <div className="p-6 bg-slate-800/50 backdrop-blur border border-slate-700/80 rounded-2xl shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">{pendingMerchants}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Dalam Antrean Verifikasi</div>
              </div>

              <div className="p-6 bg-slate-800/50 backdrop-blur border border-slate-700/80 rounded-2xl shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">GIS Ready</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Pemetaan Titik Lokasi Akurat</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Alur Pendaftaran Sesuai Gambar Arsitektur */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-perindag-700 bg-perindag-50 px-3 py-1 rounded-full">
            Alur Pelayanan
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">
            Bagaimana Cara Mendaftar di Portal?
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Proses mudah dan transparan dari pendaftaran mandiri hingga verifikasi oleh petugas Dinas Perdagangan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Isi Data Identitas & Usaha</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Masukkan NIK pemilik, nama usaha, kategori komoditas, omset bulanan, dan alamat lengkap tempat berdagang.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Pilih Titik Koordinat Peta</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tentukan posisi presisi kios atau toko Anda melalui peta digital interaktif atau gunakan fitur lokasi otomatis.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Verifikasi Petugas Dinas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Petugas verifikator dinas memeriksa validitas data, foto berkas, serta kesesuaian lokasi usaha yang didaftarkan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Terbit Tanda Terdaftar Resmi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pelaku usaha memperoleh Surat Tanda Terdaftar resmi ber-QR code yang dapat dicetak mandiri kapan saja.
            </p>
          </div>
        </div>
      </section>

      {/* Live Map Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  Peta Sebaran Pelaku Usaha Terverifikasi
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visualisasi geografis sebaran pedagang dan UMKM binaan Dinas Perdagangan.
              </p>
            </div>
            <Link
              href="/peta"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
            >
              Buka Peta Layar Penuh <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <MapDisplay merchants={sampleLocations} height="420px" />
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-perindag-800 via-perindag-700 to-emerald-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Kembangkan Usaha Anda Bersama Program Binaan Perdagangan
            </h3>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Dengan mendaftarkan usaha Anda secara resmi, peroleh kesempatan mengikuti pelatihan digital, fasilitasi perizinan gratis, pameran dagang daerah, serta bantuan permodalan.
            </p>
          </div>
          <Link
            href="/daftar"
            className="px-8 py-4 bg-white text-perindag-900 font-bold rounded-xl shadow-lg hover:bg-emerald-50 transition-all hover:scale-105 shrink-0"
          >
            Daftarkan Usaha Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
