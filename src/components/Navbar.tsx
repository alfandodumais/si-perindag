'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  FileText,
  Search,
  MapPin,
  ShieldCheck,
  Home,
  Sparkles,
  ShoppingBag,
  Network,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in admin backoffice (except login page), let admin layout handle its own navigation
  const isAdminDashboard = pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (isAdminDashboard) {
    return null;
  }

  const navItems = [
    { label: 'Beranda', shortLabel: 'Beranda', href: '/', icon: Home },
    { label: 'Pendaftaran IKM', shortLabel: 'Pendaftaran', href: '/daftar', icon: FileText },
    { label: 'Cek Status STBP', shortLabel: 'Cek STBP', href: '/tracking', icon: Search },
    { label: 'Peta Sebaran IKM', shortLabel: 'Peta Sebaran', href: '/peta', icon: MapPin },
    { label: 'Katalog IKM', shortLabel: 'Katalog IKM', href: '/katalog', icon: ShoppingBag },
    { label: 'Struktur Disperindag', shortLabel: 'Struktur', href: '/struktur', icon: Network },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#08192c]/95 backdrop-blur-xl border-b border-sky-500/15 text-white shadow-lg shadow-sky-950/20 transition-all duration-200 overflow-x-clip">
      {/* Top subtle radiant accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-sky-400/70 to-amber-400/40" />

      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex items-center justify-between h-[68px] sm:h-[72px]">
          
          {/* Brand / Logo & Agency Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-amber-400 p-[1.5px] shadow-md shadow-sky-950/60 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1 overflow-hidden shadow-inner">
                <img
                  src="/logo-sipikem-icon.png"
                  alt="Logo SIPIKEM SULUT"
                  className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-110 transition-transform duration-200"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-white leading-tight">
                  SIPIKEM <span className="text-sky-400">SULUT</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-amber-300 bg-amber-400/15 border border-amber-400/30 rounded-md uppercase shrink-0">
                  Sulut
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-sky-200/70 font-medium tracking-tight whitespace-nowrap leading-tight hidden sm:block">
                Dinas Perindustrian dan Perdagangan
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (>= xl: 1280px) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group/nav relative flex items-center gap-1.5 px-2.5 2xl:px-3.5 py-2 rounded-xl text-xs 2xl:text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-sky-500/20 border border-sky-400/35 shadow-xs shadow-sky-950/40 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.07] border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 2xl:w-4 2xl:h-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110 ${
                      isActive ? 'text-sky-300' : 'text-sky-400/80 group-hover/nav:text-sky-300'
                    }`}
                  />
                  <span className="hidden 2xl:inline">{item.label}</span>
                  <span className="2xl:hidden">{item.shortLabel}</span>
                  {isActive && (
                    <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-[2px] bg-sky-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA Action Buttons (>= xl) */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <Link
              href="/admin/login"
              className="whitespace-nowrap flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] rounded-xl transition-all duration-200 border border-white/10 hover:border-sky-400/30 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Portal Petugas</span>
            </Link>
            <Link
              href="/daftar"
              className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 rounded-xl shadow-md shadow-sky-950/40 hover:shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              <span className="hidden 2xl:inline">Daftar IKM Baru</span>
              <span className="2xl:hidden">Daftar IKM</span>
            </Link>
          </div>

          {/* Mobile/Tablet Controls (< xl) */}
          <div className="xl:hidden flex items-center gap-2">
            <Link
              href="/admin/login"
              className="whitespace-nowrap sm:flex hidden items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-sky-200 hover:text-white bg-white/[0.05] border border-white/10 rounded-lg"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Portal</span>
            </Link>
            <Link
              href="/daftar"
              className="whitespace-nowrap sm:flex hidden items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-sky-200" />
              <span>Daftar IKM</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-sky-200 hover:text-white hover:bg-white/[0.08] focus:outline-none transition-colors border border-white/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#071626]/98 backdrop-blur-2xl border-b border-sky-500/20 px-4 pt-3 pb-6 space-y-1.5 shadow-2xl">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-sky-500/20 border border-sky-400/30 font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-300' : 'text-sky-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-xs shadow-sky-400" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/daftar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-xl shadow-md"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Daftar IKM Sekarang</span>
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-medium text-sky-200 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl border border-white/10"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Login Portal Petugas</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
