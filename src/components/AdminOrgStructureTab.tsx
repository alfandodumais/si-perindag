'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Network, 
  Crown, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  User, 
  Upload, 
  X, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  AlertCircle,
  Building2,
  Image as ImageIcon
} from 'lucide-react';
import { OrgMember, DEFAULT_ORG_STRUCTURE } from '@/lib/settings';
import ConfirmModal from '@/components/ConfirmModal';

interface AdminOrgStructureTabProps {
  members: OrgMember[];
  onChangeMembers: (updated: OrgMember[]) => void;
  onSaveAll: () => Promise<void>;
  saving: boolean;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export default function AdminOrgStructureTab({
  members,
  onChangeMembers,
  onSaveAll,
  saving,
  showToast,
}: AdminOrgStructureTabProps) {
  const [filterGroup, setFilterGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirm Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState<OrgMember>({
    id: '',
    name: '',
    title: '',
    nip: '',
    department: 'Dinas Perindustrian dan Perdagangan Daerah Provinsi Sulawesi Utara',
    echelon: 'Eselon III.a (Administrator)',
    group: 'BIDANG',
    parentId: '1',
    photo: null,
    order: 1,
    active: true,
    description: '',
  });

  // Open modal for new official
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      id: Date.now().toString(),
      name: '',
      title: '',
      nip: '',
      department: 'Dinas Perindustrian dan Perdagangan Daerah Provinsi Sulawesi Utara',
      echelon: 'Eselon III.a (Administrator)',
      group: 'BIDANG',
      parentId: '1',
      photo: null,
      order: members.length + 1,
      active: true,
      description: '',
    });
    setIsModalOpen(true);
  };

  // Open modal to edit existing official
  const handleOpenEdit = (member: OrgMember) => {
    setEditingId(member.id);
    setFormData({ ...member });
    setIsModalOpen(true);
  };

  // Handle upload official photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Ukuran foto maksimal 5 MB');
      return;
    }

    setUploadingPhoto(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('target', 'official');

      const res = await fetch('/api/settings/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengunggah foto');
      }

      setFormData((prev) => ({ ...prev, photo: data.url }));
      showToast('success', 'Foto resmi berhasil diunggah.');
    } catch (err: any) {
      showToast('error', err.message || 'Gagal mengunggah foto.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save form data into members list
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Jabatan resmi tidak boleh kosong.');
      return;
    }
    if (!formData.name.trim()) {
      showToast('error', 'Nama pejabat tidak boleh kosong (gunakan tanda - jika belum terisi).');
      return;
    }

    let updatedList: OrgMember[];
    if (editingId) {
      updatedList = members.map((m) => (m.id === editingId ? { ...formData } : m));
      showToast('success', `Data "${formData.title}" diperbarui. Klik Simpan Perubahan.`);
    } else {
      updatedList = [...members, { ...formData }];
      showToast('success', `Pejabat baru "${formData.title}" ditambahkan.`);
    }

    // Sort by order ascending
    updatedList.sort((a, b) => a.order - b.order);
    onChangeMembers(updatedList);
    setIsModalOpen(false);
  };

  // Delete member
  const handleDeleteMember = (id: string, title: string) => {
    if (members.length <= 1) {
      showToast('error', 'Minimal harus ada 1 entitas struktur.');
      return;
    }
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Dari Bagan Struktur?',
      message: `Apakah Anda yakin ingin menghapus "${title}" dari bagan struktur organisasi? Tindakan ini akan diterapkan saat Anda menekan tombol "Simpan Perubahan".`,
      confirmText: 'Ya, Hapus Pejabat',
      variant: 'danger',
      onConfirm: () => {
        const updated = members.filter((m) => m.id !== id);
        onChangeMembers(updated);
        showToast('success', `"${title}" dihapus. Klik Simpan Perubahan.`);
        setConfirmDialog(null);
      },
    });
  };

  // Move order up / down
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === members.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...members];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Re-assign order numbers
    newItems.forEach((item, idx) => {
      item.order = idx + 1;
    });

    onChangeMembers(newItems);
  };

  // Reset to default Sulut structure
  const handleResetToDefault = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Struktur ke Standar SK?',
      message: 'Perhatian: Seluruh susunan bagan dan foto pejabat yang telah diubah akan dikembalikan ke struktur standar resmi Disperindag Sulawesi Utara (14 pejabat sesuai SK). Perubahan yang belum disimpan akan digantikan.',
      confirmText: 'Ya, Reset ke Standar SK',
      variant: 'warning',
      onConfirm: () => {
        onChangeMembers(DEFAULT_ORG_STRUCTURE);
        showToast('success', 'Struktur dikembalikan ke susunan resmi Disperindag Sulut.');
        setConfirmDialog(null);
      },
    });
  };

  // Filtered members for display
  const filtered = members.filter((m) => {
    const matchGroup = filterGroup === 'ALL' || m.group === filterGroup;
    const matchSearch =
      !searchQuery.trim() ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.nip && m.nip.includes(searchQuery.trim()));
    return matchGroup && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner Notice */}
      <div className="p-6 bg-gradient-to-r from-[#0c233c] via-[#113254] to-[#091b2e] rounded-3xl border border-sky-500/30 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase">
              Bagan Resmi Pemerintah Daerah
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-sky-300 text-xs font-semibold">Tersinkronisasi ke Portal Publik</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Network className="w-6 h-6 text-sky-400" />
            Kelola Struktur Organisasi Disperindag Sulut
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Kustomisasi nama pejabat, NIP, jabatan struktural/fungsional, dan foto profil dinas. Struktur yang Anda simpan di sini akan langsung ditampilkan pada menu <b>Struktur Disperindag</b> di portal utama.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-sky-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pejabat / Posisi</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Kembalikan ke struktur resmi awal sesuai SK"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar SK</span>
          </button>

          <Link
            href="/struktur"
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Publik</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { key: 'ALL', label: `Semua (${members.length})` },
            { key: 'PIMPINAN', label: 'Pimpinan' },
            { key: 'SEKRETARIAT', label: 'Sekretariat' },
            { key: 'BIDANG', label: 'Bidang Urusan' },
            { key: 'UPTD', label: 'UPTD Balai Mutu' },
            { key: 'FUNGSIONAL', label: 'Fungsional' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterGroup(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterGroup === tab.key
                  ? 'bg-[#0c233c] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pejabat, NIP, atau jabatan..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

      </div>

      {/* List / Table of Officials */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
            Daftar Pejabat & Posisi Struktural ({filtered.length} Pejabat)
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Gunakan tombol panah untuk mengatur urutan susunan hirarki
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <Info className="w-8 h-8 text-sky-500 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-slate-600">Tidak ada pejabat ditemukan</p>
              <p className="text-slate-400 mt-0.5">Silakan ganti filter atau tambahkan pejabat baru.</p>
            </div>
          ) : (
            filtered.map((m, idx) => {
              const isPimpinan = m.group === 'PIMPINAN';
              const globalIndex = members.findIndex((item) => item.id === m.id);

              return (
                <div
                  key={m.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  {/* Left: Avatar + Title & Name */}
                  <div className="flex items-center gap-4 min-w-0">
                    
                    {/* Order Badge */}
                    <div className="text-xs font-mono font-bold text-slate-400 w-6 text-center shrink-0">
                      #{m.order}
                    </div>

                    {/* Official Photo Thumbnail */}
                    <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 shadow-xs bg-slate-100 flex items-center justify-center ${
                      isPimpinan ? 'border-amber-400 ring-2 ring-amber-300/40' : 'border-slate-300'
                    }`}>
                      {m.photo ? (
                        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-sky-50 text-sky-600 font-extrabold text-xs">
                          {m.name && m.name !== '-' ? m.name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-slate-400" />}
                        </div>
                      )}
                    </div>

                    {/* Officer Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          isPimpinan
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : m.group === 'SEKRETARIAT'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : m.group === 'BIDANG'
                            ? 'bg-sky-100 text-sky-900 border border-sky-300'
                            : m.group === 'UPTD'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}>
                          {m.group}
                        </span>

                        <span className="text-xs font-black text-slate-800 truncate">
                          {m.title}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                        {m.name || '-'}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        {m.nip && m.nip !== '-' && (
                          <span className="font-mono text-slate-600">NIP: <b>{m.nip}</b></span>
                        )}
                        {m.echelon && <span>• {m.echelon}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    
                    {/* Move Up/Down buttons */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(globalIndex, 'up')}
                        disabled={globalIndex === 0}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500"
                        title="Geser Naik"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(globalIndex, 'down')}
                        disabled={globalIndex === members.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500"
                        title="Geser Turun"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(m)}
                      className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(m.id, m.title)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Hapus Pejabat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer save note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sky-600" />
            Setelah mengubah atau menambah pejabat, pastikan klik <b>Simpan Perubahan</b> di sudut kanan atas agar tersimpan ke database.
          </span>
          <button
            type="button"
            onClick={onSaveAll}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL TAMBAH / EDIT PEJABAT                              */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#0c233c] to-[#123860] text-white flex items-center justify-between border-b border-[#163c66]">
              <div className="flex items-center gap-2.5">
                <Network className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="font-extrabold text-sm">
                    {editingId ? 'Edit Pejabat & Posisi Struktural' : 'Tambah Pejabat / Posisi Baru'}
                  </h3>
                  <p className="text-[10px] text-sky-200">
                    Struktur Organisasi Disperindag Prov. Sulawesi Utara
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveMember} className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800 text-xs">
              
              {/* Photo Upload Row */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shadow-xs flex items-center justify-center shrink-0">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Foto Pejabat" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-300" />
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-[10px] font-bold">
                      Mengunggah...
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <div className="font-extrabold text-xs text-slate-900">Foto Profil Resmi Pejabat</div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Unggah pasfoto resmi dengan pakaian dinas (JPG, PNG, atau WebP, maks. 5 MB).
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.photo ? 'Ganti Foto' : 'Unggah Foto'}</span>
                    </button>

                    {formData.photo && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, photo: null }))}
                        className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-[11px] font-bold transition-colors"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Jabatan Resmi */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">
                    Nama Jabatan Resmi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
                    placeholder="Contoh: KEPALA BIDANG PERINDUSTRIAN"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                  />
                </div>

                {/* Nama Pejabat */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">
                    Nama Lengkap & Gelar Pejabat <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Drs. Hendrik R. Tendean (atau isi - jika kosong)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* NIP */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value.trim() })}
                    placeholder="Contoh: 197007081990101002 atau -"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Golongan / Kategori Hirarki */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Kategori Hirarki <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="PIMPINAN">Pimpinan (Kepala Dinas)</option>
                    <option value="SEKRETARIAT">Sekretariat</option>
                    <option value="BIDANG">Bidang Urusan</option>
                    <option value="UPTD">UPTD Balai Mutu</option>
                    <option value="FUNGSIONAL">Kelompok Jabatan Fungsional</option>
                  </select>
                </div>

                {/* Jenjang Eselon / Pangkat */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jenjang Eselon / Golongan</label>
                  <input
                    type="text"
                    value={formData.echelon || ''}
                    onChange={(e) => setFormData({ ...formData, echelon: e.target.value })}
                    placeholder="Contoh: Eselon III.a (Administrator)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Nomor Urut */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nomor Urut Tampilan</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Unit Organisasi / Bidang */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">Unit Organisasi / Bidang</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Contoh: Bidang Fasilitasi dan Pengembangan IKM"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Deskripsi / Tupoksi */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">Tugas Pokok & Fungsi (Tupoksi)</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tuliskan uraian tugas pokok dan fungsi jabatan ini secara ringkas..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
                  />
                </div>

              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition-all hover:scale-[1.02]"
                >
                  {editingId ? 'Simpan Pejabat' : 'Tambahkan Pejabat'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Custom Professional Confirmation Modal */}
      {confirmDialog && (
        <ConfirmModal
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          variant={confirmDialog.variant}
        />
      )}

    </div>
  );
}
