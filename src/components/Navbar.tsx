'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, FileText, Search, MapPin, ShieldCheck, Home } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in admin backoffice (except login page), let admin layout handle its own navigation
  const isAdminDashboard = pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (isAdminDashboard) {
    return null;
  }

  const navItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Daftar UMKM', href: '/daftar', icon: FileText },
    { label: 'Cek Status', href: '/tracking', icon: Search },
    { label: 'Peta Sebaran', href: '/peta', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Agency Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-perindag-800 to-perindag-600 flex items-center justify-center text-white shadow-md shadow-perindag-700/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  SI-PERINDAG
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-800 bg-emerald-100 rounded-full uppercase">
                  Portal Resmi
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Dinas Perindustrian & Perdagangan Kota Manado
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-perindag-700 bg-perindag-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-perindag-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-perindag-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-perindag-600" />
              Portal Petugas
            </Link>
            <Link
              href="/daftar"
              className="px-4 py-2 text-sm font-semibold text-white bg-perindag-600 hover:bg-perindag-700 active:bg-perindag-800 rounded-lg shadow-sm shadow-perindag-600/30 transition-all hover:shadow-md"
            >
              Daftar Usaha Baru
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'text-perindag-700 bg-perindag-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-perindag-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/daftar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-perindag-600 hover:bg-perindag-700 rounded-lg shadow-sm"
            >
              Daftar Usaha Sekarang
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Login Petugas Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
