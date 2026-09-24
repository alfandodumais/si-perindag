'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, AlertCircle, ArrowLeft, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="w-full h-full bg-white rounded-[14px] p-2 flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src="/logo-sipikem-icon.png"
                alt="Logo SIPIKEM SULUT"
                className="w-full h-full object-contain"
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
                  placeholder="Masukkan username atau email"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium placeholder:text-slate-500"
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
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-white transition-colors"
                  title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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

          <div className="pt-2 text-center text-[11px] text-slate-500">
            Akses khusus petugas verifikator & administrator berwenang Disperindag Sulut.
          </div>

        </div>

      </div>
    </div>
  );
}
