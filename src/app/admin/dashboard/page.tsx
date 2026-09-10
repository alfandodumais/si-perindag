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
  UserPlus,
  Settings,
  ChevronRight
} from 'lucide-react';
import { formatDateIndo, formatDateTimeIndo, formatRupiah } from '@/lib/utils';
import dynamic from 'next/dynamic';

const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500">
      Memuat GIS Peta Sebaran Wilayah...
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

  // Fetch KPI data & users count
  const [total, pending, approved, rejected, allMerchants, categoryStats, districtStats, totalUsers, totalVerifikator] = await Promise.all([
    prisma.merchantRegistration.count(),
    prisma.merchantRegistration.count({ where: { status: 'PENDING' } }),
    prisma.merchantRegistration.count({ where: { status: 'APPROVED' } }),
    prisma.merchantRegistration.count({ where: { status: 'REJECTED' } }),
    prisma.merchantRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.merchantRegistration.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    prisma.merchantRegistration.groupBy({
      by: ['district'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
  ]);

  const recentPending = allMerchants.filter((m) => m.status === 'PENDING').slice(0, 6);

  return (
    <AdminSidebarLayout user={session}>
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Personalized Welcome Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
          isSuperadmin 
            ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700/60' 
            : 'bg-white text-slate-900 border-slate-200'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isSuperadmin ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    Pusat Kontrol Super Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Ruang Kerja Petugas Verifikator
                  </span>
                )}
                <span className="text-xs text-slate-400 hidden sm:inline">• Dinas Perdagangan Kota Manado</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Selamat Datang, {session.name}
              </h1>

              <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isSuperadmin ? 'text-slate-300' : 'text-slate-500'}`}>
                {isSuperadmin 
                  ? 'Anda memiliki hak akses penuh untuk mengelola pengguna (petugas), mengontrol data permohonan UMKM, menghapus duplikasi, dan mengawasi jalannya verifikasi.' 
                  : 'Fokus pada validasi dan verifikasi berkas permohonan pendaftaran pelaku UMKM Kota Manado agar cepat diterbitkan tanda terdaftar resmi.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isSuperadmin && (
                <Link
                  href="/admin/users"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold rounded-xl shadow transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Users className="w-4 h-4 text-amber-400" /> Kelola Petugas
                </Link>
              )}

              <Link
                href="/admin/verifikasi"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <FileCheck2 className="w-4 h-4" /> Buka Ruang Verifikasi
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Total UMKM */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Pendaftar
              </span>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{total}</div>
            <p className="text-[11px] text-slate-500">Pelaku UMKM terdata di sistem</p>
          </div>

          {/* Card 2: Pending Verifikasi */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Menunggu Verifikasi
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-800">{pending}</div>
            <Link
              href="/admin/verifikasi?status=PENDING"
              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
            >
              Perlu ditindaklanjuti <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3: Telah Disetujui */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Telah Disetujui
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-800">{approved}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Surat Terdaftar Sah Terbit</p>
          </div>

          {/* Card 4: Ditolak atau Petugas (if Superadmin) */}
          {isSuperadmin ? (
            <div className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Pengguna Sistem
                </span>
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-indigo-900">{totalUsers}</div>
              <Link
                href="/admin/users"
                className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
              >
                {totalVerifikator} Verifikator aktif <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Ditolak / Revisi
                </span>
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-rose-800">{rejected}</div>
              <p className="text-[11px] text-rose-600 font-medium">Memerlukan perbaikan berkas</p>
            </div>
          )}

        </div>

        {/* Superadmin Exclusive Quick Panel */}
        {isSuperadmin && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Panel Hak Akses Super Administrator</h3>
                  <p className="text-xs text-slate-400">Pusat kendali pengaturan dan integritas database dinas</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold self-start sm:self-auto">
                Full CRUD Mode Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span>Kelola Akun & Petugas</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Tambah akun baru verifikator, ubah role, reset kata sandi petugas, atau hapus user yang tidak bertugas lagi.
                </p>
                <Link href="/admin/users" className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 pt-1">
                  Buka Manajemen User &rarr;
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                  <span>Kontrol Penuh Data UMKM</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Superadmin dapat mengoreksi data pendaftaran, menghapus permohonan fiktif/spam, serta meninjau catatan verifikasi.
                </p>
                <Link href="/admin/verifikasi" className="text-blue-700 font-bold hover:underline inline-flex items-center gap-1 pt-1">
                  Buka Ruang Verifikasi &rarr;
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Database Cloud Supabase</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Database PostgreSQL terintegrasi aman di cloud Supabase Singapore (ap-southeast-1) siap melayani vercel live production.
                </p>
                <span className="text-purple-700 font-bold inline-flex items-center gap-1 pt-1">
                  Status: Terhubung & Sinkron
                </span>
              </div>
            </div>
          </div>
        )}

        {/* GIS Interactive Map for Manado */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  GIS Pemetaan Pelaku Usaha Kota Manado
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Peta sebaran koordinat seluruh pemohon pendaftaran UMKM di 11 Kecamatan.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Disetujui ({approved})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending ({pending})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Ditolak ({rejected})</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <MapDisplay merchants={allMerchants} height="400px" />
          </div>
        </div>

        {/* Grid: Pending Action list & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Permohonan Mendesak Menunggu Verifikasi */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Antrean Permohonan Masuk (Pending)
                </h3>
              </div>
              <Link
                href="/admin/verifikasi?status=PENDING"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Lihat Semua ({pending})
              </Link>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {recentPending.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                  Semua permohonan telah selesai diverifikasi!
                </div>
              ) : (
                recentPending.map((m) => (
                  <div key={m.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{m.businessName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {m.registrationNo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {m.ownerName} • {m.category} (Kec. {m.district})
                      </p>
                    </div>

                    <Link
                      href={`/admin/verifikasi?id=${m.id}`}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold shrink-0 transition-colors"
                    >
                      Verifikasi &rarr;
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Col 2: Komoditas & Wilayah */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Category Stats */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Distribusi Komoditas Usaha</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </h3>

              <div className="space-y-3">
                {categoryStats.map((item) => {
                  const percent = total > 0 ? Math.round((item._count.id / total) * 100) : 0;
                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 truncate max-w-[200px]">{item.category}</span>
                        <span className="text-slate-500 font-bold">{item._count.id} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* District distribution */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Sebaran Per Kecamatan</span>
                <MapPin className="w-4 h-4 text-emerald-600" />
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {districtStats.map((d) => (
                  <div key={d.district} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-500 font-medium truncate">{d.district}</div>
                    <div className="text-base font-black text-slate-900">{d._count.id} Usaha</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </AdminSidebarLayout>
  );
}
