// =================================================================
// SIPIKEM SULUT - SISTEM INFORMASI PEMBINAAN IKM SULAWESI UTARA
// Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara
// =================================================================

// Daftar 15 Kabupaten / Kota Resmi di Provinsi Sulawesi Utara
export const KABUPATEN_KOTA_SULUT = [
  'Kota Manado',
  'Kota Bitung',
  'Kota Tomohon',
  'Kota Kotamobagu',
  'Kab. Minahasa',
  'Kab. Minahasa Utara',
  'Kab. Minahasa Selatan',
  'Kab. Minahasa Tenggara',
  'Kab. Bolaang Mongondow',
  'Kab. Bolaang Mongondow Utara',
  'Kab. Bolaang Mongondow Timur',
  'Kab. Bolaang Mongondow Selatan',
  'Kab. Kepulauan Sitaro',
  'Kab. Kepulauan Sangihe',
  'Kab. Kepulauan Talaud',
] as const;

// Nama ringkas Kabupaten / Kota sesuai grafik & tabel dashboard
export const SULUT_REGIONS_SHORT = [
  'Manado',
  'Minahasa',
  'Bitung',
  'Tomohon',
  'Minut',
  'Minsel',
  'Mitra',
  'Bolmong',
  'Bolmut',
  'Boltim',
  'Bolsel',
  'Kotamobagu',
  'Sitaro',
  'Sangihe',
  'Talaud',
] as const;

// Titik Pusat Geografis Provinsi Sulawesi Utara untuk GIS Peta
export const SULUT_CENTER = {
  latitude: 1.45,
  longitude: 124.84,
  zoom: 8,
};

// Backwards compatibility untuk Kota Manado
export const KECAMATAN_MANADO = [
  'Bunaken',
  'Bunaken Kepulauan',
  'Malalayang',
  'Mapanget',
  'Paal Dua',
  'Sario',
  'Singkil',
  'Tikala',
  'Tuminting',
  'Wanea',
  'Wenang',
] as const;

export const MANADO_CENTER = {
  latitude: 1.4822,
  longitude: 124.8428,
  zoom: 12,
};

// Kategori Komoditas IKM Resmi SIPIKEM SULUT
export const KATEGORI_IKM = [
  'Makanan & Minuman',
  'Kerajinan',
  'Fashion',
  'Olahan Kelapa',
  'Perikanan',
  'Kimia & Bahan Bangunan',
  'Pertanian & Perkebunan',
  'Jasa Industri & Lainnya',
] as const;

export const KATEGORI_IKM_SULUT = KATEGORI_IKM;
export const KATEGORI_USAHA = KATEGORI_IKM;

// Kategori IKM Score (Tingkat Kesiapan & Daya Saing)
export const IKM_SCORE_LEVELS = [
  'Pemula',
  'Berkembang',
  'Maju',
  'Unggulan',
] as const;

export const IKM_SCORE_TIERS = [
  {
    name: 'Pemula',
    minScore: 0,
    maxScore: 50,
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Usaha rintisan/mikro, belum memiliki perizinan lengkap (NIB), membutuhkan pendampingan dasar & legalitas.',
  },
  {
    name: 'Berkembang',
    minScore: 51,
    maxScore: 70,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Legalitas NIB dan PIRT terpenuhi, kapasitas produksi reguler, aktif penjualan lokal & media sosial.',
  },
  {
    name: 'Maju',
    minScore: 71,
    maxScore: 85,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Standar mutu BPOM/Halal lengkap, manajemen keuangan tertata, menembus pasar ritel modern regional.',
  },
  {
    name: 'Unggulan',
    minScore: 86,
    maxScore: 100,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Siap ekspor internasional, sertifikasi industri lengkap (HAKI, Halal, BPOM), rantai pasok industri kuat.',
  },
];

// Tahapan Status Pendampingan IKM (Siklus SIPIKEM)
export const STATUS_PENDAMPINGAN = [
  'Belum Didampingi',
  'Terdaftar Pelatihan',
  'Sedang Pendampingan',
  'Selesai Pembinaan',
  'Mandiri',
] as const;

export const STATUS_PENDAMPINGAN_IKM = STATUS_PENDAMPINGAN;

// Status Legalitas NIB / Perizinan
export const STATUS_LEGALITAS = [
  'Ada',
  'Dalam Proses',
  'Belum Ada',
] as const;

// Identitas Resmi Instansi & Sistem
export const AGENCY_CONFIG = {
  systemName: 'SIPIKEM SULUT',
  systemFullName: 'Sistem Informasi Pembinaan IKM Sulawesi Utara',
  tagline: 'Dari Potensi Lokal Menuju Pasar Global',
  subTagline: 'Kolaborasi untuk IKM yang Lebih Maju',
  motto: 'Dari Data, Menuju Pembinaan. Dari Pembinaan, Menuju IKM Naik Kelas',
  province: 'Provinsi Sulawesi Utara',
  agencyName: 'Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara',
  headOfAgency: 'Drs. Hendrik R. Tendean',
  headNdh: 'NDH: 21',
  nip: 'NIP. 19680512 199303 1 005',
  officeAddress: 'Jl. Balai Kota No. 1, Tikala Ares, Manado, Sulawesi Utara',
  phone: '(0431) 851103 / 0812-4455-6677',
  email: 'disperindag@sulutprov.go.id',
  website: 'https://disperindag.sulutprov.go.id',
};

export const DISPERINDAG_SULUT = AGENCY_CONFIG;
