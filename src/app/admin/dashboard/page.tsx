import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminSidebarLayout from '@/components/AdminSidebarLayout';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Store, 
  MapPin, 
  FileCheck2,
  TrendingUp,
  Crown,
  UserCheck,
  ShieldCheck,
  PlusCircle,
  Database,
  GraduationCap,
  Award,
  Sparkles,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  BarChart3,
  PieChart,
  CheckCircle
} from 'lucide-react';
import { KABUPATEN_KOTA_SULUT, KATEGORI_IKM_SULUT, IKM_SCORE_TIERS, DISPERINDAG_SULUT } from '@/lib/constants';
import { getAppSettings } from '@/lib/settings';
import dynamic from 'next/dynamic';

const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
      Memuat GIS Peta Sebaran 15 Kab/Kota Sulawesi Utara...
    </div>
  ),
});

export const revalidate = 0; // Dynamic data

export default async function AdminDashboardPage() {
  const session = getSessionUser();
  if (!session) {
    redirect('/admin/login');
  }

  const isSuperadmin = session.role === 'SUPERADMIN';

  // Fetch live DB records directly from PostgreSQL
  const [
    totalDb,
    integratedNibCount,
    naikKelasCount,
    allMerchants,
    categoryStatsDb,
    regencyStatsDb,
    mentoringStagesDb,
    ikmScoreStatsDb,
    appSettings,
  ] = await Promise.all([
    // Total registered IKM
    prisma.merchantRegistration.count(),
    // IKM with valid NIB
    prisma.merchantRegistration.count({
      where: {
        nib: { not: null, notIn: ['', '-'] },
      },
    }),
    // IKM with 'Maju' or 'Unggulan' tier
    prisma.merchantRegistration.count({
      where: {
        OR: [
          { ikmScore: { in: ['Maju', 'Unggulan', 'Level Unggulan'] } },
          { ikmScore: { contains: 'Maju', mode: 'insensitive' } },
          { ikmScore: { contains: 'Unggulan', mode: 'insensitive' } },
        ],
      },
    }),
    // Merchants for GIS Map (with valid coordinates)
    prisma.merchantRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    // Group by category
    prisma.merchantRegistration.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    // Group by regency
    prisma.merchantRegistration.groupBy({
      by: ['regency'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    // Group by mentoring status
    prisma.merchantRegistration.groupBy({
      by: ['mentoringStatus'],
      _count: { id: true },
    }),
    // Group by ikmScore tier
    prisma.merchantRegistration.groupBy({
      by: ['ikmScore'],
      _count: { id: true },
    }),
    // App settings (Banners & Categories)
    getAppSettings(),
  ]);

  // Transform merchants into MapPins
  const mapPins = allMerchants.map((m) => ({
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

  // Regency Map calculated from real DB records
  const regencyMap = new Map<string, number>();
  regencyStatsDb.forEach((r) => {
    if (r.regency) regencyMap.set(r.regency, r._count.id);
  });

  const regencyBreakdown = KABUPATEN_KOTA_SULUT.map((region) => {
    const count = regencyMap.get(region) || 0;
    const percent = totalDb > 0 ? ((count / totalDb) * 100).toFixed(1) : '0';
    return {
      name: region,
      count,
      percent: parseFloat(percent),
    };
  }).sort((a, b) => b.count - a.count);

  const maxRegencyCount = Math.max(...regencyBreakdown.map((r) => r.count), 1);

  // Category Distribution from real DB records
  const CATEGORY_COLORS = [
    'bg-sky-500',
    'bg-blue-600',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-rose-500',
  ];

  const categoryDistribution = categoryStatsDb.map((c, idx) => {
    const count = c._count.id;
    const percent = totalDb > 0 ? Math.round((count / totalDb) * 100) : 0;
    return {
      label: c.category || 'Lainnya',
      count,
      percent,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    };
  });

  const largestCategory = categoryDistribution[0]?.label || 'Makanan & Minuman';
  const largestCategoryPercent = categoryDistribution[0]?.percent || 0;

  // Mentoring Stage Counts from real DB
  const stageMap = new Map<string, number>();
  mentoringStagesDb.forEach((s) => {
    if (s.mentoringStatus) stageMap.set(s.mentoringStatus, s._count.id);
  });

  const kurasiCount = (stageMap.get('Analisis Kebutuhan') || 0) + (stageMap.get('Pendataan') || 0);
  const pelatihanCount = stageMap.get('Pendampingan') || 0;
  const sertifikasiCount = stageMap.get('Sertifikasi') || 0;
  const pasarCount = stageMap.get('Akses Pasar') || 0;
  const totalMentoring = kurasiCount + pelatihanCount + sertifikasiCount + pasarCount;

  // Tier counts from real DB
  const tierMap = new Map<string, number>();
  ikmScoreStatsDb.forEach((t) => {
    if (t.ikmScore) tierMap.set(t.ikmScore, t._count.id);
  });

  const completenessPercent = totalDb > 0 ? Math.round((integratedNibCount / totalDb) * 100) : 0;
  const incompleteCount = Math.max(0, totalDb - integratedNibCount);
  const incompletePercent = 100 - completenessPercent;

  const agendaPembinaan = [
    {
      title: 'Pelatihan Keamanan Pangan & Sertifikasi Halal',
      date: '18 - 20 Sept 2026',
      location: 'Sentra IKM Kota Bitung',
      participants: '35 IKM Mamin',
      status: 'Akan Datang',
      statusColor: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    {
      title: 'Kurasi Produk Unggulan Ekspor Sulut',
      date: '25 Sept 2026',
      location: 'Disperindag Prov. Sulut (Manado)',
      participants: '20 IKM Maju/Unggulan',
      status: 'Pendaftaran',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Workshop Digital Marketing & E-Katalog Nasional',
      date: '02 Okt 2026',
      location: 'Aula Pemkot Tomohon',
      participants: '50 IKM Kreatif',
      status: 'Segera',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      title: 'Fasilitasi Uji Lab & Pengujian BPOM/PIRT',
      date: '10 Okt 2026',
      location: 'Balai Standardisasi Manado',
      participants: '25 IKM Olahan Kelapa',
      status: 'Persiapan',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  return (
    <AdminSidebarLayout user={session}>
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6 sm:space-y-7">
        
        {/* HERO PANORAMIC BANNER (High-Res 2534x416 from banner.png) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs bg-white">
          <img
            src={appSettings.bannerDashboard || '/banner.png'}
            alt="SIPIKEM SULUT - Dari Potensi Lokal Menuju Pasar Global - Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara"
            className="w-full h-auto object-cover block select-none"
          />
        </div>

        {/* 4 TOP KPI CARDS (Matching dashboard.jpeg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Total IKM */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total IKM Terdata
              </span>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{totalDb.toLocaleString('id-ID')}</span>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                Riil Terdata
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Pelaku IKM aktif di 15 Kabupaten/Kota
            </p>
          </div>

          {/* Card 2: IKM Terintegrasi */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                IKM Terintegrasi NIB
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-900">{integratedNibCount.toLocaleString('id-ID')}</span>
              <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                {completenessPercent}% Lengkap
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Data profil, legalitas & foto terverifikasi
            </p>
          </div>

          {/* Card 3: Dalam Pendampingan */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Dalam Pendampingan
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-800">{totalMentoring.toLocaleString('id-ID')}</span>
              <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                4 Tahap Aktif
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Peserta kurasi, pelatihan & sertifikasi
            </p>
          </div>

          {/* Card 4: IKM Naik Kelas */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                IKM Naik Kelas
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-800">{naikKelasCount.toLocaleString('id-ID')}</span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                Maju & Unggulan
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tembus pasar modern, ritel & ekspor
            </p>
          </div>

        </div>

        {/* MIDDLE ROW: SEBARAN 15 KAB/KOTA & GIS MAP SULUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sebaran IKM per Kabupaten / Kota (Bar representation matching dashboard.jpeg) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Sebaran IKM per Kabupaten / Kota
                    </h3>
                    <p className="text-xs text-slate-400">
                      Distribusi {totalDb.toLocaleString('id-ID')} IKM di seluruh 15 daerah Sulawesi Utara
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/ikm"
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                >
                  Detail Tabel <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Bar List */}
              <div className="space-y-2.5 mt-4 max-h-[380px] overflow-y-auto pr-1">
                {regencyBreakdown.map((item, idx) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700 font-semibold truncate max-w-[220px]">
                        {idx + 1}. {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-black">{item.count.toLocaleString('id-ID')} IKM</span>
                        <span className="text-slate-400 text-[11px]">({item.percent}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all"
                        style={{ width: item.count > 0 ? `${Math.max(8, Math.round((item.count / maxRegencyCount) * 100))}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Sumber: Database Terpadu SIPIKEM SULUT 2026</span>
              <span className="font-bold text-slate-700">Total 15 Kab/Kota</span>
            </div>
          </div>

          {/* GIS Pemetaan Sebaran IKM Sulut */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      GIS Pemetaan IKM Sulut
                    </h3>
                    <p className="text-xs text-slate-400">
                      Peta koordinat sebaran sentra IKM
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/peta"
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                >
                  Layar Penuh <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Map Preview */}
              <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200">
                <MapDisplay merchants={mapPins} height="320px" />
              </div>
            </div>

            {/* Quick Map Stats */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Terdata</div>
                <div className="font-black text-slate-900">{totalDb.toLocaleString('id-ID')} IKM</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-bold">GPS Aktif</div>
                <div className="font-black text-emerald-700">{allMerchants.filter(m => m.latitude && m.longitude).length} Valid</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Cakupan</div>
                <div className="font-black text-sky-700">{regencyStatsDb.length} Daerah</div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: DONUT / KATEGORI, STATUS INTEGRASI & SCORE, AGENDA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Col 1: Komposisi Kategori IKM */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-sky-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Kategori Komoditas IKM
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Proporsi (%)</span>
              </div>

              <div className="space-y-3 mt-4 max-h-[380px] overflow-y-auto pr-1">
                {categoryDistribution.map((c) => (
                  <div key={c.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium truncate max-w-[200px]">{c.label}</span>
                      <span className="text-slate-900 font-extrabold">{c.count} IKM ({c.percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${c.color} h-full rounded-full transition-all`} style={{ width: `${Math.max(c.percent > 0 ? 6 : 0, c.percent)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Sektor Terbesar: <b>{largestCategory}</b></span>
              <span className="font-bold text-sky-600">{largestCategoryPercent}% ({categoryDistribution[0]?.count || 0} IKM)</span>
            </div>
          </div>

          {/* Col 2: Status Integrasi Data & Tahap Pendampingan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Status Integrasi & Pendampingan
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-blue-600">Aktif</span>
              </div>

              {/* Data Completeness Ratio */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Integrasi Legalitas & Profil</span>
                  <span className="text-sky-700">{integratedNibCount.toLocaleString('id-ID')} / {totalDb.toLocaleString('id-ID')} ({completenessPercent}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-sky-600 h-full transition-all" style={{ width: `${completenessPercent}%` }} />
                  <div className="bg-slate-300 h-full transition-all" style={{ width: `${incompletePercent}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-600" /> Terintegrasi ({completenessPercent}%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" /> Belum Lengkap ({incompletePercent}%)</span>
                </div>
              </div>

              {/* Mentoring Stages */}
              <div className="mt-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tahap Pendampingan ({totalMentoring} IKM)
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-sky-50/70 border border-sky-100 rounded-xl">
                    <div className="text-slate-500 text-[10px]">Kurasi & Asesmen</div>
                    <div className="font-black text-sky-900 text-sm mt-0.5">{kurasiCount} IKM</div>
                  </div>
                  <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl">
                    <div className="text-slate-500 text-[10px]">Pelatihan Teknis</div>
                    <div className="font-black text-blue-900 text-sm mt-0.5">{pelatihanCount} IKM</div>
                  </div>
                  <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl">
                    <div className="text-slate-500 text-[10px]">Fasilitasi Sertifikasi</div>
                    <div className="font-black text-amber-900 text-sm mt-0.5">{sertifikasiCount} IKM</div>
                  </div>
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                    <div className="text-slate-500 text-[10px]">Akses Pasar & Ekspor</div>
                    <div className="font-black text-emerald-900 text-sm mt-0.5">{pasarCount} IKM</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link href="/admin/pembinaan" className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1">
                Buka Ruang Pembinaan &rarr;
              </Link>
            </div>
          </div>

          {/* Col 3: Agenda Pembinaan & Pelatihan Terdekat */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Agenda Kegiatan & Pembinaan
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Jadwal</span>
              </div>

              <div className="space-y-3 mt-3">
                {agendaPembinaan.map((ag) => (
                  <div key={ag.title} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-sky-50/40 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ag.statusColor}`}>
                        {ag.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{ag.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                      {ag.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{ag.location}</span>
                      <span className="font-medium text-sky-700">{ag.participants}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Disperindag Prov. Sulut 2026</span>
              <span className="font-bold text-sky-600 cursor-pointer hover:underline">
                Lihat Kalender &rarr;
              </span>
            </div>
          </div>

        </div>

        {/* IKM SCORE LEVEL METRICS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Distribusi Pemeringkatan IKM Score Sulawesi Utara
                </h3>
                <p className="text-xs text-slate-400">
                  Standarisasi level kematangan usaha: Pemula, Berkembang, Maju, hingga Unggulan
                </p>
              </div>
            </div>
            <Link
              href="/admin/ikm-score"
              className="text-xs font-bold text-sky-600 hover:text-sky-800"
            >
              Matriks Penilaian Lengkap &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {IKM_SCORE_TIERS.map((tier) => {
              const count = tierMap.get(tier.name) || 0;
              const percent = totalDb > 0 ? Math.round((count / totalDb) * 100) : 0;
              return (
                <div key={tier.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${tier.color}`}>
                      {tier.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Skor: {tier.minScore}-{tier.maxScore}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-xl font-black text-slate-900">
                      {count.toLocaleString('id-ID')} IKM
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {percent}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {tier.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </AdminSidebarLayout>
  );
}
