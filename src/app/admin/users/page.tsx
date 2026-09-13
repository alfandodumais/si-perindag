'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebarLayout from '@/components/AdminSidebarLayout';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Crown, 
  UserCheck, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { formatDateIndo } from '@/lib/utils';

function UsersContent() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form States
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 1. Fetch current session user & verify Superadmin
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.user) {
          router.push('/admin/login');
          return;
        }
        if (data.user.role !== 'SUPERADMIN') {
          // Denied access for non-superadmin
          alert('Akses Ditolak. Halaman ini hanya untuk Superadmin.');
          router.push('/admin/dashboard');
          return;
        }
        setCurrentUser(data.user);
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  // 2. Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setFormError(data.message || 'Gagal memuat data pengguna');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'SUPERADMIN') {
      fetchUsers();
    }
  }, [currentUser]);

  // Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  // Calculate Metrics
  const totalUsers = users.length;
  const totalSuperadmin = users.filter((u) => u.role === 'SUPERADMIN').length;
  const totalVerifikator = users.filter((u) => u.role === 'ADMIN').length;

  // Handle Add User Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menambahkan petugas');
      }

      setShowAddModal(false);
      setFormData({ username: '', name: '', email: '', password: '', role: 'ADMIN' });
      fetchUsers();
      showToast(data.message);
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email || '',
      password: '', // Empty means unchanged
      role: user.role,
    });
    setFormError('');
    setShowEditModal(true);
  };

  // Handle Edit User Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError('');
    setSubmitting(true);

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password && formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memperbarui petugas');
      }

      setShowEditModal(false);
      fetchUsers();
      showToast(data.message);
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete User Submit
  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menghapus petugas');
      }

      setShowDeleteModal(false);
      fetchUsers();
      showToast(data.message);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menghapus');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminSidebarLayout user={currentUser}>
      <main className="w-full px-3 sm:px-5 lg:px-6 py-6 space-y-6">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-emerald-100 px-5 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              Modul Kontrol Superadmin
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manajemen Pengguna & Petugas Dinas
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kelola seluruh akun petugas verifikator dan hak akses operasional sistem SI-PERINDAG Kota Manado.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setFormData({ username: '', name: '', email: '', password: '', role: 'ADMIN' });
                setFormError('');
                setShowAddModal(true);
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Petugas Baru</span>
            </button>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Akun Petugas
              </span>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{totalUsers}</div>
            <p className="text-[11px] text-slate-500">Akun terdaftar dalam database</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Super Administrator
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-800">{totalSuperadmin}</div>
            <p className="text-[11px] text-amber-600 font-medium">Memiliki izin CRUD penuh</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Petugas Verifikator
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-800">{totalVerifikator}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Khusus operasional verifikasi</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, username, atau email..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-52 font-medium"
            >
              <option value="ALL">Semua Peran (Role)</option>
              <option value="SUPERADMIN">Super Administrator</option>
              <option value="ADMIN">Petugas Verifikator</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Petugas</th>
                  <th className="py-3.5 px-4">Kontak / Email</th>
                  <th className="py-3.5 px-4">Peran (Role) & Hak Akses</th>
                  <th className="py-3.5 px-4">Tanggal Bergabung</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Memuat daftar petugas...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Tidak ada data petugas yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = currentUser && currentUser.id === u.id;
                    const isSuper = u.role === 'SUPERADMIN';

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Name & Avatar */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-white shadow-sm ${
                              isSuper 
                                ? 'bg-gradient-to-tr from-amber-600 to-amber-400' 
                                : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                            }`}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isSelf && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
                                    (Anda)
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-mono text-slate-400">@{u.username}</span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-4 text-slate-600">
                          {u.email || <span className="text-slate-400 italic">Tidak ada email</span>}
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-4">
                          {isSuper ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                              <Crown className="w-3.5 h-3.5 text-amber-600" />
                              <span>SUPERADMIN</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>VERIFIKATOR</span>
                            </div>
                          )}
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {isSuper ? 'Full CRUD User & Data' : 'Khusus Verifikasi UMKM'}
                          </p>
                        </td>

                        {/* Created At */}
                        <td className="py-4 px-4 text-slate-500 text-xs">
                          {formatDateIndo(u.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEdit(u)}
                              title="Edit Petugas"
                              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setShowDeleteModal(true);
                              }}
                              disabled={isSelf}
                              title={isSelf ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Petugas'}
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Tambah Petugas */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Tambah Petugas Baru</h3>
                    <p className="text-xs text-slate-400">Daftarkan akun petugas dinas atau administrator baru</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Petugas <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Mario Sumampouw, S.STP"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Username Login <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="mario123"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="mario@manadokota.go.id"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Tingkat Peran (Role Hak Akses) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.role === 'ADMIN'
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="ADMIN"
                        checked={formData.role === 'ADMIN'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs text-slate-900">Verifikator</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Hanya verifikasi permohonan UMKM.</p>
                    </label>

                    <label className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.role === 'SUPERADMIN'
                        ? 'border-amber-600 bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="SUPERADMIN"
                        checked={formData.role === 'SUPERADMIN'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-xs text-slate-900">Superadmin</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Full CRUD user & kontrol data UMKM.</p>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Petugas'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Petugas */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Edit Data Petugas</h3>
                    <p className="text-xs text-slate-400">@{selectedUser.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Petugas
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ubah Kata Sandi (Kosongkan jika tidak ingin diubah)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Masukkan kata sandi baru"
                      className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Peran (Role)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.role === 'ADMIN'
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="role_edit"
                        value="ADMIN"
                        checked={formData.role === 'ADMIN'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs text-slate-900">Verifikator</span>
                      </div>
                    </label>

                    <label className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.role === 'SUPERADMIN'
                        ? 'border-amber-600 bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="role_edit"
                        value="SUPERADMIN"
                        checked={formData.role === 'SUPERADMIN'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-xs text-slate-900">Superadmin</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Perbarui Data'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Hapus Petugas */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-8 p-6 sm:p-8 space-y-5 animate-fadeIn text-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Hapus Akun Petugas?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus akun <strong className="text-slate-800">{selectedUser.name}</strong> (@{selectedUser.username})? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleDeleteSubmit}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-xl shadow transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menghapus...' : 'Ya, Hapus Akun'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </AdminSidebarLayout>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Memuat halaman manajemen petugas...</div>}>
      <UsersContent />
    </Suspense>
  );
}
