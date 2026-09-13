'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Mail, Phone, MapPin, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { DISPERINDAG_SULUT } from '@/lib/constants';

export default function Footer() {
  const pathname = usePathname();

  // Hide in admin backoffice dashboard
  const isAdminDashboard = pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (isAdminDashboard) {
    return null;
  }

  return (
    <footer className="bg-[#081a2e] text-slate-300 pt-16 pb-12 border-t border-[#163554]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Desc */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-amber-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0c233c] rounded-[10px] flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">SIPIKEM SULUT</span>
                <p className="text-xs text-sky-300">Sistem Informasi Pembinaan IKM Sulawesi Utara</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Platform layanan digital resmi Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara untuk pendataan, pembinaan, standardisasi mutu, dan pemetaan geografis Industri Kecil dan Menengah (IKM) di 15 Kabupaten/Kota.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-sky-400 font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              Pemerintah Provinsi Sulawesi Utara
            </div>
          </div>

          {/* Col 2: Layanan Publik */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Layanan Publik
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/daftar" className="hover:text-sky-400 transition-colors">
                  Pendaftaran IKM Baru
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-sky-400 transition-colors">
                  Cek Status Registrasi (STBP-IKM)
                </Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-sky-400 transition-colors">
                  Peta GIS Sebaran IKM Sulut
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-sky-400 transition-colors">
                  Katalog Produk IKM Sulut
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  Portal Petugas Disperindag <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Kontak Instansi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Hubungi Kami
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <span>Jl. Balai Kota No. 1, Tikala Ares, Kec. Tikala, Kota Manado, Sulawesi Utara</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>(0431) 851103 / Disperindag Prov. Sulut</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>disperindag@sulutprov.go.id</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#163554] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>SIPIKEM SULUT</span>
            <span>15 Kabupaten/Kota</span>
            <span className="text-sky-400 font-bold">Produksi 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
