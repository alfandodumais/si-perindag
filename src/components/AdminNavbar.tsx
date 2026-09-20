'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Users, 
  LogOut, 
  ExternalLink,
  Crown,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

interface AdminNavbarProps {
  user?: {
    name: string;
    username: string;
    role: string;
  } | null;
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isSuperadmin = user?.role === 'SUPERADMIN';

  const navs = [
    { 
      label: isSuperadmin ? 'Dashboard & Analitik' : 'Dashboard Verifikator', 
      href: '/admin/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      label: 'Verifikasi UMKM', 
      href: '/admin/verifikasi', 
      icon: FileCheck2 
    },
    ...(isSuperadmin
      ? [
          {
            label: 'Kelola Petugas',
            href: '/admin/users',
            icon: Users,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0c233c] border border-sky-600/40 flex items-center justify-center p-1 shadow-md shadow-sky-950/50 overflow-hidden">
                <img src="/logo-sipikem-icon.png" alt="Logo SIPIKEM SULUT" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    SIPIKEM SULUT
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider rounded uppercase ${
                    isSuperadmin 
                      ? 'text-amber-300 bg-amber-950/80 border border-amber-800/80' 
                      : 'text-emerald-300 bg-emerald-950 border border-emerald-800'
                  }`}>
                    {isSuperadmin ? 'Superadmin' : 'Backoffice'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {isSuperadmin ? 'Pusat Kendali Administrasi' : 'Sistem Verifikasi Dinas Perdagangan'}
                </p>
              </div>
            </Link>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-800">
              {navs.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? isSuperadmin 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                          : 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Lihat Portal Publik <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                  {user?.name || 'Petugas Dinas'}
                </div>
                <div className="mt-0.5 flex justify-end">
                  {isSuperadmin ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                      <Crown className="w-3 h-3 text-amber-400" /> SUPERADMIN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                      <UserCheck className="w-3 h-3 text-emerald-400" /> VERIFIKATOR
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout dari Sistem"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
