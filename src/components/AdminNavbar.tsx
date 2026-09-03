'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Building2, 
  LayoutDashboard, 
  FileCheck2, 
  MapPin, 
  LogOut, 
  ExternalLink,
  ShieldAlert,
  UserCheck
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

  const navs = [
    { label: 'Dashboard & Statistik', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Verifikasi UMKM', href: '/admin/verifikasi', icon: FileCheck2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/50">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    SI-PERINDAG
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300 bg-emerald-950 border border-emerald-800 rounded uppercase">
                    Backoffice
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Sistem Verifikasi Dinas Perdagangan
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
                        ? 'bg-emerald-600 text-white shadow-sm'
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
                <div className="text-xs font-bold text-white">
                  {user?.name || 'Petugas Verifikator'}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  {user?.role || 'ADMIN DINAS'}
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
