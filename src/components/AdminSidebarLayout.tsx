'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Building2, 
  LayoutDashboard, 
  FileCheck2, 
  Users, 
  LogOut, 
  ExternalLink,
  Crown,
  UserCheck,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  HelpCircle
} from 'lucide-react';

interface AdminSidebarLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    username: string;
    role: string;
  } | null;
}

export default function AdminSidebarLayout({ children, user }: AdminSidebarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSuperadmin = user?.role === 'SUPERADMIN';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    {
      label: isSuperadmin ? 'Dashboard & Analitik' : 'Dashboard Verifikator',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      desc: isSuperadmin ? 'Pusat statistik & GIS' : 'Antrean verifikasi harian',
    },
    {
      label: 'Verifikasi UMKM',
      href: '/admin/verifikasi',
      icon: FileCheck2,
      desc: 'Validasi berkas & pendaftaran',
    },
    ...(isSuperadmin
      ? [
          {
            label: 'Kelola Petugas',
            href: '/admin/users',
            icon: Users,
            desc: 'CRUD akun verifikator & role',
            isSuperExclusive: true,
          },
        ]
      : []),
  ];

  // Current page title mapping
  const getPageTitle = () => {
    if (pathname === '/admin/dashboard') return isSuperadmin ? 'Pusat Kontrol Super Administrator' : 'Ruang Kerja Verifikator';
    if (pathname === '/admin/verifikasi') return 'Verifikasi Pendaftaran UMKM';
    if (pathname === '/admin/users') return 'Manajemen Petugas & Pengguna';
    return 'Panel Administrasi';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top Header in Sidebar */}
        <div className="flex flex-col">
          <div className="h-20 px-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-white">SI-PERINDAG</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                  Kota Manado
                </p>
              </div>
            </Link>

            {/* Mobile close button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Banner Inside Sidebar */}
          <div className={`p-4 mx-4 mt-4 rounded-2xl border transition-all ${
            isSuperadmin 
              ? 'bg-amber-950/20 border-amber-500/30' 
              : 'bg-emerald-950/20 border-emerald-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isSuperadmin ? (
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className={`text-[11px] font-black uppercase tracking-wider block ${
                    isSuperadmin ? 'text-amber-300' : 'text-emerald-300'
                  }`}>
                    {isSuperadmin ? 'Superadmin' : 'Verifikator'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isSuperadmin ? 'Akses Penuh CRUD' : 'Khusus Verifikasi'}
                  </span>
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full ${
                isSuperadmin ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`} />
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5 mt-2">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Menu Utama
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all group ${
                    isActive
                      ? isSuperadmin && item.isSuperExclusive
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/50'
                        : 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? (isSuperadmin && item.isSuperExclusive ? 'text-slate-950' : 'text-white') : 'text-slate-400 group-hover:text-emerald-400'
                    }`} />
                    <div>
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                      <div className={`text-[10px] font-normal mt-0.5 ${
                        isActive ? (isSuperadmin && item.isSuperExclusive ? 'text-slate-900/80' : 'text-emerald-100') : 'text-slate-500'
                      }`}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <ChevronRight className="w-4 h-4 opacity-80" />
                  ) : item.isSuperExclusive ? (
                    <Crown className="w-3.5 h-3.5 text-amber-500 opacity-60" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Card & Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
          
          {/* Quick link to public portal */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat Portal Publik
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
              Publik
            </span>
          </Link>

          {/* User Account Capsule */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                isSuperadmin
                  ? 'bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
              }`}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate" title={user?.name || 'Petugas Dinas'}>
                  {user?.name || 'Petugas Dinas'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  @{user?.username || 'admin'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout dari Sistem"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-xl transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* MAIN CONTENT AREA TO THE RIGHT OF SIDEBAR */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Sticky Bar on Right Panel */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              aria-label="Buka Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                {getPageTitle()}
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Dinas Perindustrian dan Perdagangan Kota Manado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* System Cloud Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Cloud Supabase</span>
            </div>

            {/* Role indicator pill */}
            <div className="flex items-center">
              {isSuperadmin ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">SUPERADMIN</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">VERIFIKATOR</span>
                </span>
              )}
            </div>
          </div>

        </header>

        {/* Page Content Body */}
        <div className="flex-1">
          {children}
        </div>

      </div>

    </div>
  );
}
