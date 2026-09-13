import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Building2, 
  MapPin, 
  Search, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Store,
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import nextDynamic from 'next/dynamic';
import { getAppSettings } from '@/lib/settings';

const MapDisplay = nextDynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
      Memuat peta GIS sebaran IKM Sulawesi Utara...
    </div>
  ),
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch settings & approved IKM for the public map
  const [sampleLocations, appSettings] = await Promise.all([
    prisma.merchantRegistration.findMany({
      where: { status: 'APPROVED' },
      take: 25,
      select: {
        id: true,
        registrationNo: true,
        businessName: true,
        ownerName: true,
        category: true,
        scale: true,
        address: true,
        district: true,
        regency: true,
        status: true,
        latitude: true,
        longitude: true,
        businessImage: true,
      },
    }),
    getAppSettings(),
  ]);

  const mapPins = sampleLocations.map((m) => ({
    id: m.id,
    registrationNo: m.registrationNo,
    businessName: m.businessName,
    ownerName: m.ownerName,
    category: m.category,
    scale: m.scale,
    address: m.address,
    district: m.district || m.regency || 'Sulawesi Utara',
    status: m.status,
    latitude: m.latitude || 1.4822,
    longitude: m.longitude || 124.8428,
  }));

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section (Ocean Navy Blue Theme matching dashboard.jpeg) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c233c] via-[#103459] to-[#081a2e] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        
        {/* Panoramic Banner Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none transition-opacity duration-300"
          style={{ backgroundImage: `url('${appSettings.bannerLanding || '/banner.png'}')` }}
        />
        {/* Decorative Grid & Glow Accents */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-3xl space-y-6 text-center lg:text-left py-4 lg:py-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              SISTEM INFORMASI PEMBINAAN INDUSTRI KECIL DAN MENENGAH (IKM)
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Dari Potensi Lokal <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-amber-300">
                Menuju Pasar Global
              </span>
            </h1>
            
            <p className="text-sky-100/90 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Portal Layanan Terpadu Fasilitasi &amp; Pembinaan Legalitas, Standardisasi, dan Akselerasi Ekspor IKM Provinsi Sulawesi Utara menuju pasar nasional dan global.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/daftar"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Store className="w-4 h-4" />
                Daftar Profil IKM Sekarang
              </Link>
              
              <Link
                href="/tracking"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-sky-300/30 flex items-center justify-center gap-2 transition-all"
              >
                <Search className="w-4 h-4 text-sky-300" />
                Cek Status STBP-IKM
              </Link>
            </div>

            {/* Verified Badge info */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-sky-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400" /> 100% Layanan Resmi Pemerintah
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400" /> Cakupan 15 Kabupaten / Kota
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Terbit Surat Bukti Terdaftar (STBP)
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Pilar Pembinaan IKM Sesuai PRD SIPIKEM SULUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
            Program Kerja Unggulan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            4 Tahapan Akselerasi IKM Naik Kelas
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Mendorong transformasi pelaku usaha mikro dan kecil di Sulawesi Utara menuju standardisasi produk bermutu dan mandiri secara ekonomi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative group hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-900 font-black text-base flex items-center justify-center mb-4 group-hover:bg-[#0c233c] group-hover:text-white transition-colors">
              01
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1.5">Pendataan 8 Kluster</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pengumpulan data menyeluruh identitas usaha, produk utama, legalitas NIB, peralatan kerja, finansial, dan saluran pasar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative group hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-900 font-black text-base flex items-center justify-center mb-4 group-hover:bg-[#0c233c] group-hover:text-white transition-colors">
              02
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1.5">Penilaian IKM Score</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pemeringkatan objektif (Pemula, Berkembang, Maju, Unggulan) untuk menentukan intervensi bantuan yang tepat sasaran.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative group hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-900 font-black text-base flex items-center justify-center mb-4 group-hover:bg-[#0c233c] group-hover:text-white transition-colors">
              03
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1.5">Fasilitasi Standarisasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bantuan pengurusan Sertifikat Halal BPJPH, uji lab BPOM / P-IRT, pendaftaran HAKI Merek dagang, dan desain kemasan higienis.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative group hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-900 font-black text-base flex items-center justify-center mb-4 group-hover:bg-[#0c233c] group-hover:text-white transition-colors">
              04
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1.5">Akses Pasar & Ekspor</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Business matching dengan perbankan SulutGo, masuk ritel modern dan supermarket, e-katalog, serta kurasi ekspor komoditas unggulan.
            </p>
          </div>
        </div>
      </section>

      {/* GIS Live Map Preview Sulut */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <h3 className="text-xl font-extrabold text-slate-900">
                  GIS Pemetaan Geospasial IKM Sulawesi Utara
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visualisasi geografis sebaran sentra IKM di 15 Kabupaten/Kota se-Sulawesi Utara.
              </p>
            </div>
            <Link
              href="/peta"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition-colors"
            >
              Buka Peta Layar Penuh <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <MapDisplay merchants={mapPins} height="420px" />
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0c233c] via-[#123963] to-[#0c233c] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-sky-800/40">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tingkatkan Daya Saing IKM Anda Menuju Pasar Global
            </h3>
            <p className="text-sky-100/90 text-xs sm:text-sm leading-relaxed">
              Daftarkan usaha Anda sekarang di portal SIPIKEM SULUT untuk mendapatkan pendampingan sertifikasi halal, uji laboratorium, fasilitasi kemasan, dan peluang kurasi ekspor Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara.
            </p>
          </div>
          <Link
            href="/daftar"
            className="px-8 py-4 bg-gradient-to-r from-sky-400 to-amber-300 text-slate-950 font-extrabold rounded-2xl shadow-lg hover:scale-105 transition-transform shrink-0 text-sm"
          >
            Daftarkan IKM Sekarang &rarr;
          </Link>
        </div>
      </section>

    </div>
  );
}
