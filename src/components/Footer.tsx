'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Mail, Phone, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide in admin backoffice dashboard
  const isAdminDashboard = pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (isAdminDashboard) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Desc */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-perindag-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">SI-PERINDAG</span>
                <p className="text-xs text-slate-400">Sistem Informasi Dinas Perdagangan</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Platform layanan digital resmi pendataan, perizinan, dan pemetaan geografis Usaha Mikro, Kecil, dan Menengah (UMKM) serta Pedagang Daerah dalam rangka percepatan ekonomi kerakyatan.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Terpadu & Terintegrasi Vercel Serverless
            </div>
          </div>

          {/* Col 2: Layanan Publik */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Layanan Publik
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/daftar" className="hover:text-emerald-400 transition-colors">
                  Pendaftaran Pedagang / UMKM
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-emerald-400 transition-colors">
                  Cek Status Registrasi
                </Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-emerald-400 transition-colors">
                  Peta GIS Sebaran Pedagang
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  Portal Masuk Petugas <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Kontak Instansi */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Hubungi Kami
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Jl. Balai Kota No. 1, Tikala Ares, Kec. Tikala, Kota Manado, Sulawesi Utara</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>(0431) 851103 / 0812-4455-6677</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>disperindag@manadokota.go.id</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Dinas Perindustrian dan Perdagangan Kota Manado. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-4">
            <span>Privasi & Kebijakan</span>
            <span>Syarat Ketentuan</span>
            <span className="text-emerald-500 font-semibold">v1.0.0 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
