'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Building2, 
  LayoutDashboard, 
  Database, 
  MapPin, 
  GraduationCap, 
  Award, 
  ShoppingBag, 
  Laptop, 
  Handshake, 
  FileText, 
  Users, 
  LogOut, 
  ExternalLink, 
  Crown, 
  UserCheck, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown,
  Globe,
  UserCog,
  Search, 
  Bell, 
  Sparkles,
  FileCheck2,
  Settings 
} from 'lucide-react';
import ArtisanCraftingAnimation from '@/components/ArtisanCraftingAnimation';
import EditProfileModal from '@/components/EditProfileModal';

interface AdminSidebarLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    username: string;
    email?: string | null;
    role: string;
  } | null;
}

export default function AdminSidebarLayout({ children, user }: AdminSidebarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(user);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

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
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      desc: 'Ringkasan & Analitik Provinsi',
    },
    {
      label: 'Data IKM',
      href: '/admin/ikm',
      icon: Database,
      desc: 'Database 15 Kab/Kota & Profil IKM',
      badge: '15 Kab/Kota',
    },
    {
      label: 'Verifikasi IKM',
      href: '/admin/verifikasi',
      icon: FileCheck2,
      desc: 'Persetujuan & Validasi Berkas',
    },
    {
      label: 'Pemetaan IKM',
      href: '/admin/peta',
      icon: MapPin,
      desc: 'Sebaran Geografis GIS Sulut',
    },
    {
      label: 'Pembinaan & Pendampingan',
      href: '/admin/pembinaan',
      icon: GraduationCap,
      desc: 'Kurasi, Pelatihan, & Sertifikasi',
    },
    {
      label: 'IKM Score',
      href: '/admin/ikm-score',
      icon: Award,
      desc: 'Pemeringkatan Level & Validasi',
    },
    {
      label: 'Katalog Produk',
      href: '/admin/katalog',
      icon: ShoppingBag,
      desc: 'Showcase Produk Unggulan IKM',
    },
    {
      label: 'Klinik Digital',
      href: '/admin/klinik-digital',
      icon: Laptop,
      desc: 'Konsultasi & Pengaduan Usaha',
    },
    {
      label: 'Business Matching',
      href: '/admin/business-matching',
      icon: Handshake,
      desc: 'Akses Perbankan & Kemitraan',
    },
    {
      label: 'Laporan',
      href: '/admin/laporan',
      icon: FileText,
      desc: 'Ekspor Statistik & Rekapitulasi',
    },
    ...(isSuperadmin
      ? [
          {
            label: 'Manajemen Pengguna',
            href: '/admin/users',
            icon: Users,
            desc: 'Hak Akses & Petugas Verifikator',
            isSuperExclusive: true,
          },
          {
            label: 'Pengaturan',
            href: '/admin/pengaturan',
            icon: Settings,
            desc: 'Banner Portal & Kategori IKM',
            isSuperExclusive: true,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col lg:flex-row text-slate-800 font-sans">
      
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR CONTAINER - DEEP OCEAN NAVY #0c233c */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0c233c] text-slate-200 border-r border-[#163554] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top Section */}
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          
          {/* Logo & Header */}
          <div className="h-20 px-5 border-b border-[#163554] flex items-center justify-between bg-[#081a2e]">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-amber-500 p-0.5 shadow-md shadow-sky-950/50">
                <div className="w-full h-full bg-[#0c233c] rounded-[10px] flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-wide text-white">SIPIKEM SULUT</span>
                </div>
                <p className="text-[10px] text-sky-300 font-medium truncate max-w-[150px] leading-tight">
                  Disperindag Prov. Sulut
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

          {/* Navigation Menu (10 Items matching dashboard.jpeg) */}
          <nav className="p-3 space-y-1 mt-2">
            <div className="px-3 py-1.5 text-[10px] font-bold text-sky-400/70 uppercase tracking-wider">
              Navigasi Utama
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold shadow-md shadow-sky-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-[#122d4a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-sky-400 group-hover:text-sky-300'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                  ) : item.badge ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-300 border border-sky-700/50">
                      {item.badge}
                    </span>
                  ) : item.isSuperExclusive ? (
                    <Crown className="w-3 h-3 text-amber-400 opacity-80" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner Card: "IKM NAIK KELAS SULAWESI UTARA MAJU BERSAMA" */}
        <div className="p-3 border-t border-[#163554] space-y-2.5 bg-[#081a2e] shrink-0">
          
          {/* Animated Artisan Crafting Product Scene */}
          <ArtisanCraftingAnimation />

          {/* Sulut Motivational Card matching dashboard.jpeg */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0c2f54] via-[#103a66] to-[#0a233d] p-2.5 border border-sky-800/40 text-center shadow-inner">
            <div className="relative z-10 space-y-0.5">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-bold">
                <Sparkles className="w-3 h-3" /> SIPIKEM SULUT
              </div>
              <h4 className="text-[10.5px] font-extrabold text-white uppercase tracking-tight leading-snug">
                IKM Naik Kelas<br />Sulawesi Utara Maju Bersama
              </h4>
              <p className="text-[8.5px] text-sky-200/80">
                Dinas Perindustrian & Perdagangan
              </p>
            </div>
            
            {/* Background Graphic Accents */}
            <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-sky-500/10 rounded-full blur-sm pointer-events-none" />
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-amber-500/10 rounded-full blur-sm pointer-events-none" />
          </div>

        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR matching dashboard.jpeg */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              aria-label="Buka Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input Bar (matching dashboard.jpeg) */}
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari data IKM, produk, kab/kota, legalitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Disperindag Sulut Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-xs text-sky-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Pemerintah Provinsi Sulawesi Utara</span>
            </div>

            {/* Notification Bell with Badge */}
            <button
              title="Notifikasi Sistem"
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Interactive Profile Circle Avatar & Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-slate-50 hover:bg-slate-100/90 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                title="Menu Pengguna & Profil"
              >
                {/* Profile Circle Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs select-none transition-transform hover:scale-105 ${
                  isSuperadmin
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black ring-2 ring-amber-300/80'
                    : 'bg-gradient-to-tr from-sky-500 to-blue-600 ring-2 ring-sky-300/80'
                }`}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>

                {/* Name & Role Text (visible on sm screens and up) */}
                <div className="hidden sm:block text-left pr-0.5">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
                    {currentUser?.name || 'Petugas Disperindag'}
                  </div>
                  <div className="text-[10px] text-sky-700 font-semibold flex items-center gap-1">
                    {isSuperadmin ? (
                      <span className="text-amber-700 font-bold flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" /> Superadmin
                      </span>
                    ) : (
                      <span>Verifikator</span>
                    )}
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden sm:block ${
                  profileDropdownOpen ? 'rotate-180 text-sky-600' : ''
                }`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                  {/* Dropdown Header Info */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shadow-xs shrink-0 ${
                        isSuperadmin
                          ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950'
                          : 'bg-gradient-to-tr from-sky-500 to-blue-600'
                      }`}>
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-extrabold text-slate-900 truncate" title={currentUser?.name}>
                          {currentUser?.name || 'Petugas Disperindag'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">
                          @{currentUser?.username || 'admin'}
                        </div>
                        <div className="mt-1">
                          {isSuperadmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-extrabold border border-amber-200">
                              <Crown className="w-2.5 h-2.5" /> SUPERADMIN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[9px] font-bold border border-sky-200">
                              <UserCheck className="w-2.5 h-2.5" /> VERIFIKATOR IKM
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="p-1.5 space-y-0.5">
                    {/* 1. Lihat Portal Publik */}
                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="leading-tight flex items-center justify-between">
                          <span>Lihat Portal Publik</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-600" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5 truncate">
                          Buka website portal utama
                        </p>
                      </div>
                    </Link>

                    {/* 2. Edit Profil */}
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setEditProfileOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-amber-800 hover:bg-amber-50/80 transition-colors group text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <UserCog className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="leading-tight">
                          <span>Edit Profil</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5 truncate">
                          Nama, username & password
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="my-1 border-t border-slate-100" />

                  {/* 3. Logout Button */}
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors group text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="leading-tight">
                          <span>Keluar (Logout)</span>
                        </div>
                        <p className="text-[10px] text-rose-400 font-normal leading-tight mt-0.5 truncate">
                          Akhiri sesi kerja admin
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Page Content Body */}
        <div className="flex-1 bg-[#f8fafc]">
          {children}
        </div>

      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        currentUser={currentUser}
        onSuccess={(updated) => {
          setCurrentUser((prev: any) => ({ ...prev, ...updated }));
          router.refresh();
        }}
      />

    </div>
  );
}
