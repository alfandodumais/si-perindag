'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ShieldCheck, AlertCircle, ArrowLeft, KeyRound, Crown } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login gagal. Periksa username dan password.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-perindag-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#16a34a15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Back to portal button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 backdrop-blur transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portal Publik
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        
        {/* Logo and Headings */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-amber-400 p-0.5 flex items-center justify-center text-white mx-auto shadow-xl shadow-sky-950/50">
            <div className="w-full h-full bg-[#08192c] rounded-[14px] p-2 flex items-center justify-center overflow-hidden">
              <img
                src="/logo-sipikem-icon.png"
                alt="Logo SIPIKEM SULUT"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
          </div>
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Backoffice SIPIKEM SULUT
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Portal Petugas Dinas
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verifikasi &amp; Pembinaan IKM Sulawesi Utara
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="mt-8 bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3.5 bg-rose-950/50 border border-rose-800/60 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / Email Petugas
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Memverifikasi Akses...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Masuk ke Sistem
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Helper for Testing */}
          <div className="pt-4 border-t border-slate-800/80 bg-slate-950/50 -mx-6 -mb-8 p-6 rounded-b-3xl text-center space-y-3">
            <div className="text-xs font-semibold text-slate-400">
              Pilih Akun Demo untuk Uji Coba Role:
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setUsername('superadmin');
                  setPassword('superadmin123');
                }}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-850 border border-amber-500/40 text-left transition-all hover:border-amber-400 group"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                  <Crown className="w-3 h-3 text-amber-400" /> Superadmin
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  superadmin / superadmin123
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUsername('verifikator');
                  setPassword('admin123');
                }}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-850 border border-emerald-500/40 text-left transition-all hover:border-emerald-400 group"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verifikator
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  verifikator / admin123
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
