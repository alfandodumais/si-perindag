'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
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
  Bell, 
  Sparkles,
  FileCheck2,
  Settings,
  Clock,
  CheckCircle2,
  XCircle,
  Check,
  Network,
  Layers
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

  // Notification System State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sipikem_read_notifications');
      if (stored) {
        setReadNotificationIds(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !readNotificationIds.includes(n.id)).length;

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotificationIds(allIds);
    try {
      localStorage.setItem('sipikem_read_notifications', JSON.stringify(allIds));
    } catch (e) {}
  };

  const handleNotificationClick = (item: any) => {
    if (!readNotificationIds.includes(item.id)) {
      const updated = [...readNotificationIds, item.id];
      setReadNotificationIds(updated);
      try {
        localStorage.setItem('sipikem_read_notifications', JSON.stringify(updated));
      } catch (e) {}
    }
    setNotificationDropdownOpen(false);
    if (item.url) {
      router.push(item.url);
    }
  };

  function formatRelativeTime(dateString: string) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Baru saja';
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes} mnt lalu`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} jam lalu`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays} hari lalu`;
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch (e) {
      return '';
    }
  }

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
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    }
    if (profileDropdownOpen || notificationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, notificationDropdownOpen]);

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
            desc: 'Banner, Kategori & Struktur Disperindag',
            isSuperExclusive: true,
            subItems: [
              {
                label: 'Banner & Kategori',
                href: '/admin/pengaturan',
                icon: Layers,
              },
              {
                label: 'Struktur Disperindag',
                href: '/admin/pengaturan?tab=struktur',
                icon: Network,
              },
            ],
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
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1 overflow-hidden shadow-inner">
                  <img
                    src="/logo-sipikem-icon.png"
                    alt="Logo SIPIKEM SULUT"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                  />
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
              const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
              const isParentActive = pathname === item.href || (hasSubItems && pathname.startsWith(item.href));

              if (hasSubItems) {
                return (
                  <div key={item.href} className="space-y-1">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isParentActive
                          ? 'bg-[#122d4a] text-white font-bold border border-sky-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-[#122d4a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isParentActive ? 'text-sky-400' : 'text-sky-400 group-hover:text-sky-300'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <Crown className="w-3 h-3 text-amber-400 opacity-80" />
                    </Link>

                    {/* Submenu links */}
                    <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-sky-500/30 ml-5 my-0.5">
                      {item.subItems?.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-sky-200/90 hover:text-white hover:bg-sky-500/20 transition-all group"
                          >
                            {SubIcon && <SubIcon className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform shrink-0" />}
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

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
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          
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

            {/* Portal Badge / Title (Search removed as requested) */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">Portal Manajemen SIPIKEM SULUT</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-[11px]">Disperindag Provinsi Sulawesi Utara</span>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Disperindag Sulut Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-xs text-sky-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Pemerintah Provinsi Sulawesi Utara</span>
            </div>

            {/* Interactive Notification Bell with Badge & Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                title="Notifikasi Pendaftaran & Verifikasi IKM"
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                aria-label="Buka Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150">
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-[#0c233c] to-[#123963] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-sky-400" />
                      <span className="font-bold text-xs tracking-wide">Notifikasi Sistem</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-rose-500 text-[10px] font-extrabold rounded-full shadow-xs">
                          {unreadCount} baru
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[10px] text-sky-200 hover:text-white underline hover:no-underline transition-colors font-medium"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs space-y-1">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-60" />
                        <p className="font-semibold text-slate-600">Belum ada notifikasi baru</p>
                        <p className="text-[11px] text-slate-400">Pendaftaran IKM dan hasil verifikasi akan muncul di sini.</p>
                      </div>
                    ) : (
                      notifications.map((item) => {
                        const isRead = readNotificationIds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 text-left group ${
                              !isRead ? 'bg-sky-50/40' : ''
                            }`}
                          >
                            {/* Icon Indicator */}
                            <div className="shrink-0 mt-0.5">
                              {item.status === 'PENDING' ? (
                                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                                  <Clock className="w-4 h-4" />
                                </div>
                              ) : item.status === 'APPROVED' ? (
                                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
                                  <XCircle className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md ${
                                  item.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200/60'
                                    : item.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200/60'
                                }`}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                  {formatRelativeTime(item.timestamp)}
                                </span>
                              </div>

                              <p className="text-xs font-bold text-slate-800 truncate">
                                {item.businessName}
                              </p>
                              <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight mt-0.5">
                                {item.message}
                              </p>

                              <div className="mt-1 flex items-center gap-1 text-[10px] text-sky-600 font-bold group-hover:text-sky-700">
                                <span>Buka data IKM</span>
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>

                            {/* Unread indicator dot */}
                            {!isRead && (
                              <div className="shrink-0 self-center">
                                <span className="w-2 h-2 rounded-full bg-sky-500 block shadow-xs" />
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <Link
                      href="/admin/verifikasi"
                      onClick={() => setNotificationDropdownOpen(false)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
                    >
                      <span>Lihat Semua Antrean Verifikasi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

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
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-[100] animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
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
