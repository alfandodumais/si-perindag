import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminNavbar from '@/components/AdminNavbar';
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
  AlertCircle
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

  // Fetch KPI data
  const [total, pending, approved, rejected, allMerchants, categoryStats, districtStats] = await Promise.all([
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
  ]);

  const recentPending = allMerchants.filter((m) => m.status === 'PENDING').slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AdminNavbar user={session} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sistem Informasi Terpadu Dinas Perdagangan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Selamat Datang, {session.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau arus pendaftaran pedagang/UMKM dan lakukan verifikasi dokumen permohonan secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/verifikasi"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" /> Buka Ruang Verifikasi
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Pendaftaran
              </span>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{total}</div>
            <p className="text-[11px] text-slate-500">Seluruh UMKM masuk ke sistem</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Menunggu Verifikasi
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
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

          <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Telah Disetujui
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-800">{approved}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Surat Tanda Terdaftar Terbit</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Ditolak / Revisi
              </span>
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-rose-800">{rejected}</div>
            <p className="text-[11px] text-rose-600 font-medium">Berkas belum memenuhi syarat</p>
          </div>

        </div>

        {/* GIS Interactive Map for Admin */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  GIS Pemetaan Seluruh Pelaku Usaha (Hijau: Sah, Kuning: Pending, Merah: Ditolak)
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Peta sebaran koordinat seluruh pemohon pendaftaran UMKM.
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
                  Antrean Permohonan Terbaru (Pending)
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
                        {m.ownerName} • {m.category} ({m.district})
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
    </div>
  );
}
