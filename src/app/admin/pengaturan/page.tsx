'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebarLayout from '@/components/AdminSidebarLayout';
import { 
  Settings, 
  Crown, 
  Image as ImageIcon, 
  Tags, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Sparkles, 
  Info,
  ExternalLink,
  Layers,
  Check,
  RefreshCw
} from 'lucide-react';
import { DEFAULT_LANDING_BANNER, DEFAULT_DASHBOARD_BANNER, DEFAULT_CATEGORIES } from '@/lib/settings';

export default function SettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'banner' | 'category'>('banner');

  // Banner states
  const [bannerLanding, setBannerLanding] = useState<string>(DEFAULT_LANDING_BANNER);
  const [bannerDashboard, setBannerDashboard] = useState<string>(DEFAULT_DASHBOARD_BANNER);
  const [uploadingLanding, setUploadingLanding] = useState(false);
  const [uploadingDashboard, setUploadingDashboard] = useState(false);

  // Category states
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [categoryCounts, setCategoryCounts] = useState<{ [cat: string]: number }>({});

  // Feedback states
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const landingFileRef = useRef<HTMLInputElement>(null);
  const dashboardFileRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Check user session & authorize Superadmin
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.user) {
          router.push('/admin/login');
          return;
        }
        if (data.user.role !== 'SUPERADMIN') {
          alert('Akses ditolak! Modul Pengaturan hanya dapat diakses oleh Superadmin.');
          router.push('/admin/dashboard');
          return;
        }
        setCurrentUser(data.user);
        loadSettings();
        loadCategoryStats();
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  // 2. Load settings from API
  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setBannerLanding(data.settings.bannerLanding || DEFAULT_LANDING_BANNER);
        setBannerDashboard(data.settings.bannerDashboard || DEFAULT_DASHBOARD_BANNER);
        if (Array.isArray(data.settings.categories) && data.settings.categories.length > 0) {
          setCategories(data.settings.categories);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      showToast('error', 'Gagal memuat pengaturan aplikasi');
    } finally {
      setLoading(false);
    }
  };

  // 3. Load category counts from DB
  const loadCategoryStats = async () => {
    try {
      const res = await fetch('/api/merchants?limit=250');
      const data = await res.json();
      if (data.success && Array.isArray(data.merchants)) {
        const counts: { [cat: string]: number } = {};
        data.merchants.forEach((m: any) => {
          if (m.category) {
            counts[m.category] = (counts[m.category] || 0) + 1;
          }
        });
        setCategoryCounts(counts);
      }
    } catch (e) {
      console.error('Error loading category counts:', e);
    }
  };

  // Client-side image optimization to prevent payload issues and ensure fast upload
  const optimizeImageForUpload = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/') || file.size < 1.2 * 1024 * 1024) {
      return file;
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const maxWidth = 2560;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              resolve(new File([blob], file.name, { type: mime, lastModified: Date.now() }));
            },
            mime,
            0.88
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  // 4. Handle banner file upload with resilient Vercel fallback
  const handleUpload = async (file: File, target: 'landing' | 'dashboard') => {
    const isLanding = target === 'landing';
    if (isLanding) setUploadingLanding(true);
    else setUploadingDashboard(true);

    try {
      // 1. Optimize image client-side if file is heavy
      const readyFile = await optimizeImageForUpload(file);

      let uploadedUrl = '';

      // 2. Try uploading via API route
      try {
        const formData = new FormData();
        formData.append('file', readyFile);
        formData.append('target', target);

        const res = await fetch('/api/settings/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success && data.url) {
          uploadedUrl = data.url;
        }
      } catch (apiErr) {
        console.warn('API upload route threw an error, falling back to direct base64 encoding:', apiErr);
      }

      // 3. Resilient Fallback: If server API returned no URL (e.g. Vercel read-only filesystem limit),
      // read directly as high-res Base64 Data URL in browser
      if (!uploadedUrl) {
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(readyFile);
        });
      }

      const newLanding = isLanding ? uploadedUrl : bannerLanding;
      const newDashboard = !isLanding ? uploadedUrl : bannerDashboard;

      if (isLanding) {
        setBannerLanding(uploadedUrl);
      } else {
        setBannerDashboard(uploadedUrl);
      }

      // 4. Persist immediately to Supabase PostgreSQL database!
      const saveRes = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerLanding: newLanding,
          bannerDashboard: newDashboard,
          categories,
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.message || 'Gagal menyimpan perubahan ke database.');
      }

      showToast('success', `Banner ${isLanding ? 'Landing Page' : 'Dashboard'} berhasil diunggah dan langsung aktif diterapkan!`);
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('error', err.message || 'Terjadi kesalahan saat upload banner.');
    } finally {
      if (isLanding) setUploadingLanding(false);
      else setUploadingDashboard(false);
    }
  };

  // Reset banner landing with auto-save
  const handleResetLanding = async () => {
    setBannerLanding(DEFAULT_LANDING_BANNER);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerLanding: DEFAULT_LANDING_BANNER,
          bannerDashboard,
          categories,
        }),
      });
      showToast('success', 'Banner Landing Page di-reset ke default dan langsung aktif!');
    } catch {
      showToast('success', 'Banner Landing Page di-reset. Klik Simpan Perubahan.');
    }
  };

  // Reset banner dashboard with auto-save
  const handleResetDashboard = async () => {
    setBannerDashboard(DEFAULT_DASHBOARD_BANNER);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerLanding,
          bannerDashboard: DEFAULT_DASHBOARD_BANNER,
          categories,
        }),
      });
      showToast('success', 'Banner Dashboard di-reset ke default dan langsung aktif!');
    } catch {
      showToast('success', 'Banner Dashboard di-reset. Klik Simpan Perubahan.');
    }
  };

  // 5. Save all settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerLanding,
          bannerDashboard,
          categories,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan pengaturan.');
      }

      showToast('success', 'Pengaturan berhasil disimpan dan diterapkan!');
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menyimpan pengaturan sistem.');
    } finally {
      setSaving(false);
    }
  };

  // 6. Category CRUD actions
  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      showToast('error', 'Nama kategori tidak boleh kosong.');
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('error', `Kategori "${trimmed}" sudah ada di dalam daftar.`);
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategoryName('');
    showToast('success', `Kategori "${trimmed}" ditambahkan. Jangan lupa klik Simpan Pengaturan.`);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(categories[index]);
  };

  const handleSaveEdit = (index: number) => {
    const trimmed = editingValue.trim();
    if (!trimmed) {
      showToast('error', 'Nama kategori tidak boleh kosong.');
      return;
    }
    const exists = categories.some((c, i) => i !== index && c.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      showToast('error', `Kategori "${trimmed}" sudah ada.`);
      return;
    }
    const updated = [...categories];
    updated[index] = trimmed;
    setCategories(updated);
    setEditingIndex(null);
    setEditingValue('');
    showToast('success', 'Nama kategori diperbarui.');
  };

  const handleDeleteCategory = (index: number) => {
    const catName = categories[index];
    const count = categoryCounts[catName] || 0;
    
    if (categories.length <= 1) {
      showToast('error', 'Tidak dapat menghapus. Minimal harus ada 1 kategori aktif.');
      return;
    }

    if (count > 0) {
      const confirmDelete = window.confirm(
        `Peringatan: Kategori "${catName}" saat ini digunakan oleh ${count} data IKM di database.\n\nApakah Anda yakin ingin tetap menghapusnya dari daftar pilihan?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(`Hapus kategori "${catName}" dari daftar pilihan?`);
      if (!confirmDelete) return;
    }

    setCategories(categories.filter((_, i) => i !== index));
    showToast('success', `Kategori "${catName}" dihapus.`);
  };

  const handleResetCategories = () => {
    if (window.confirm('Kembalikan daftar kategori ke 8 kategori awal bawaan database?')) {
      setCategories(DEFAULT_CATEGORIES);
      showToast('success', 'Daftar kategori di-reset ke bawaan awal. Klik Simpan untuk menerapkan.');
    }
  };

  return (
    <AdminSidebarLayout user={currentUser}>
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6">
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 animate-bounce">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold ${
              toast.type === 'success' 
                ? 'bg-emerald-950 text-emerald-200 border-emerald-500/50' 
                : 'bg-rose-950 text-rose-200 border-rose-500/50'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span>{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold inline-flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                KHUSUS SUPERADMIN
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-500 text-xs font-semibold">Konfigurasi Sentral SIPIKEM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Settings className="w-7 h-7 text-sky-600" />
              Pengaturan Sistem
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Atur tampilan visual banner portal pada Landing Page dan Dashboard Admin, serta kelola kustomisasi kategori komoditas IKM sesuai kebutuhan pembinaan daerah.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={handleSaveSettings}
              disabled={saving || loading}
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs">
          <button
            onClick={() => setActiveTab('banner')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
              activeTab === 'banner'
                ? 'bg-[#0c233c] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-sky-400" />
            <span>Pengaturan Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('category')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
              activeTab === 'category'
                ? 'bg-[#0c233c] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Tags className="w-4 h-4 text-amber-400" />
            <span>Pengaturan Kategori IKM ({categories.length})</span>
          </button>
        </div>

        {/* TAB 1: PENGATURAN BANNER */}
        {activeTab === 'banner' && (
          <div className="space-y-6">
            
            {/* 1.1 Banner Landing Page */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                    <h2 className="text-lg font-extrabold text-slate-900">
                      1. Banner Portal Landing Page
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Gambar banner latar belakang hero section pada portal publik.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a 
                    href="/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Lihat di Portal Publik
                  </a>
                  <button
                    type="button"
                    onClick={handleResetLanding}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    Reset Default
                  </button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Pratinjau Banner Landing Page:</span>
                  <span className="text-[11px] text-slate-500 font-normal truncate max-w-md">
                    URL: {bannerLanding}
                  </span>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-[#0c233c] shadow-inner max-h-[220px] flex items-center justify-center">
                  <img
                    src={bannerLanding}
                    alt="Pratinjau Banner Landing Page"
                    className="w-full h-auto object-cover max-h-[220px]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_LANDING_BANNER;
                    }}
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur text-white text-[11px] font-medium flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400" /> Sedang Digunakan
                  </div>
                </div>
              </div>

              {/* Upload & Path Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Path atau URL Gambar Banner Landing:
                  </label>
                  <input
                    type="text"
                    value={bannerLanding}
                    onChange={(e) => setBannerLanding(e.target.value)}
                    placeholder="/banner.png atau URL eksternal"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-sky-600" />
                    Rekomendasi rasio lanskap resolusi tinggi (misal: 2534 × 416 px), format PNG atau JPG.
                  </p>
                </div>

                <div className="md:col-span-4 flex flex-col justify-end">
                  <input
                    type="file"
                    ref={landingFileRef}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file, 'landing');
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => landingFileRef.current?.click()}
                    disabled={uploadingLanding}
                    className="w-full px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:border-sky-400"
                  >
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span>{uploadingLanding ? 'Mengunggah Banner...' : 'Unggah File Gambar Baru'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 1.2 Banner Dashboard Admin */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-lg font-extrabold text-slate-900">
                      2. Banner Hero Dashboard Admin
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Gambar banner panorama yang tampil di bagian paling atas halaman ringkasan analitik dashboard admin.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a 
                    href="/admin/dashboard" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka Dashboard
                  </a>
                  <button
                    type="button"
                    onClick={handleResetDashboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    Reset Default
                  </button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Pratinjau Banner Dashboard:</span>
                  <span className="text-[11px] text-slate-500 font-normal truncate max-w-md">
                    URL: {bannerDashboard}
                  </span>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-[#0c233c] shadow-inner max-h-[220px] flex items-center justify-center">
                  <img
                    src={bannerDashboard}
                    alt="Pratinjau Banner Dashboard Admin"
                    className="w-full h-auto object-cover max-h-[220px]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_DASHBOARD_BANNER;
                    }}
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur text-white text-[11px] font-medium flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400" /> Sedang Digunakan
                  </div>
                </div>
              </div>

              {/* Upload & Path Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Path atau URL Gambar Banner Dashboard:
                  </label>
                  <input
                    type="text"
                    value={bannerDashboard}
                    onChange={(e) => setBannerDashboard(e.target.value)}
                    placeholder="/banner.png atau URL eksternal"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-sky-600" />
                    Rekomendasi rasio 6:1 (2534 × 416 px) untuk tampilan bersih tanpa terpotong di desktop.
                  </p>
                </div>

                <div className="md:col-span-4 flex flex-col justify-end">
                  <input
                    type="file"
                    ref={dashboardFileRef}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file, 'dashboard');
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => dashboardFileRef.current?.click()}
                    disabled={uploadingDashboard}
                    className="w-full px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:border-sky-400"
                  >
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span>{uploadingDashboard ? 'Mengunggah Banner...' : 'Unggah File Gambar Baru'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PENGATURAN KATEGORI IKM */}
        {activeTab === 'category' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Pengaturan Kategori Komoditas IKM
                  </h2>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Daftar kategori di bawah ini secara otomatis menjadi pilihan pada form pendaftaran publik (<code className="text-sky-700 bg-sky-50 px-1 rounded">/daftar</code>), modul penambahan IKM baru, serta bilah filter di Data IKM.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetCategories}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Reset 8 Kategori Bawaan Database
              </button>
            </div>

            {/* Add New Category Box */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-sky-600" /> Tambah Kategori Baru:
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  placeholder="Ketik nama kategori baru, misal: Batik & Tenun Minahasa, Farmasi & Herbal, dll..."
                  className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Kategori</span>
                </button>
              </div>
            </div>

            {/* Active Categories List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                <span>Daftar Kategori Aktif ({categories.length}):</span>
                <span className="text-slate-400 font-normal">Klik ikon pensil untuk mengubah nama kategori</span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {categories.map((cat, idx) => {
                  const count = categoryCounts[cat] || 0;
                  const isEditing = editingIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                        <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-900 text-[11px] font-black flex items-center justify-center shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1 max-w-md">
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(idx);
                                if (e.key === 'Escape') setEditingIndex(null);
                              }}
                              autoFocus
                              className="flex-1 px-3 py-1.5 rounded-lg border border-sky-400 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                            />
                            <button
                              onClick={() => handleSaveEdit(idx)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                              title="Simpan nama"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingIndex(null)}
                              className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                              title="Batal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-sm font-bold text-slate-800">
                              {cat}
                            </span>
                            {count > 0 ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                {count} IKM Terdata
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-500">
                                Belum ada IKM
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(idx)}
                            className="p-2 rounded-xl text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                            title="Edit nama kategori"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(idx)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus kategori"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-sky-600" />
                Semua perubahan kategori akan langsung tersinkronisasi ke form publik dan filter tabel setelah Anda mengklik tombol Simpan Perubahan.
              </span>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Menyimpan...' : 'Simpan Kategori'}</span>
              </button>
            </div>

          </div>
        )}

      </main>
    </AdminSidebarLayout>
  );
}
