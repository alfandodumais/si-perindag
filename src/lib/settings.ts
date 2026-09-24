import { prisma } from '@/lib/prisma';
import { KATEGORI_IKM } from '@/lib/constants';

export const DEFAULT_LANDING_BANNER = '/banner.png';
export const DEFAULT_DASHBOARD_BANNER = '/banner.png';

// 8 Kategori standar awal yang sudah ada di database saat ini
export const DEFAULT_CATEGORIES: string[] = [
  'Makanan & Minuman',
  'Kerajinan',
  'Fashion',
  'Olahan Kelapa',
  'Perikanan',
  'Kimia & Bahan Bangunan',
  'Pertanian & Perkebunan',
  'Jasa Industri & Lainnya',
];

export interface OrgMember {
  id: string;
  name: string;
  title: string;
  nip: string;
  department?: string;
  echelon?: string;
  group: 'PIMPINAN' | 'SEKRETARIAT' | 'BIDANG' | 'UPTD' | 'FUNGSIONAL';
  parentId?: string | null;
  photo?: string | null;
  order: number;
  active: boolean;
  description?: string;
}

export const DEFAULT_ORG_STRUCTURE: OrgMember[] = [
  {
    id: '1',
    title: 'KEPALA DINAS',
    name: 'Drs. Hendrik R. Tendean',
    nip: '197007081990101002',
    department: 'Dinas Perindustrian dan Perdagangan Daerah Provinsi Sulawesi Utara',
    echelon: 'Eselon II.a (Pimpinan Tinggi Pratama)',
    group: 'PIMPINAN',
    parentId: null,
    photo: null,
    order: 1,
    active: true,
    description: 'Memimpin, mengoordinasikan, dan mengawasi penyelenggaraan urusan pemerintahan di bidang perindustrian dan perdagangan di Provinsi Sulawesi Utara.',
  },
  {
    id: '2',
    title: 'SEKRETARIS',
    name: 'LEONARD LIWOSO SP.M.SI',
    nip: '197408071994031006',
    department: 'Sekretariat Disperindag Daerah Prov. Sulut',
    echelon: 'Eselon III.a (Administrator)',
    group: 'SEKRETARIAT',
    parentId: '1',
    photo: null,
    order: 2,
    active: true,
    description: 'Mengoordinasikan perencanaan, pembinaan administrasi umum, kepegawaian, keuangan, dan aset dinas.',
  },
  {
    id: '3',
    title: 'KEPALA SUB BAGIAN UMUM',
    name: 'TIRSA K. E. WANTANIA,S.STP',
    nip: '199501102016092001',
    department: 'Sub Bagian Umum & Kepegawaian',
    echelon: 'Eselon IV.a (Pengawas)',
    group: 'SEKRETARIAT',
    parentId: '2',
    photo: null,
    order: 3,
    active: true,
    description: 'Pengelolaan urusan surat-menyurat, tata usaha dinas, kepegawaian, perlengkapan, dan rumah tangga kantor.',
  },
  {
    id: '4',
    title: 'KEPALA SUB BAGIAN PERENCANAAN DAN KEUANGAN',
    name: 'BRYAN CHRISTO.S.HUM.MSI',
    nip: '198603282010011004',
    department: 'Sub Bagian Perencanaan & Keuangan',
    echelon: 'Eselon IV.a (Pengawas)',
    group: 'SEKRETARIAT',
    parentId: '2',
    photo: null,
    order: 4,
    active: true,
    description: 'Penyusunan rencana strategis dinas, penganggaran, pembukuan, perbendaharaan, dan pelaporan akuntabilitas keuangan.',
  },
  {
    id: '5',
    title: 'KELOMPOK JABATAN FUNGSIONAL',
    name: 'Kelompok Jabatan Fungsional Sekretariat',
    nip: '-',
    department: 'Sekretariat',
    echelon: 'Jabatan Fungsional Tertentu',
    group: 'FUNGSIONAL',
    parentId: '2',
    photo: null,
    order: 5,
    active: true,
    description: 'Pelaksanaan tugas teknis fungsional sesuai bidang keahlian di lingkungan Sekretariat.',
  },
  {
    id: '6',
    title: 'KEPALA BIDANG PERINDUSTRIAN',
    name: '-',
    nip: '-',
    department: 'Bidang Perindustrian',
    echelon: 'Eselon III.a (Administrator)',
    group: 'BIDANG',
    parentId: '1',
    photo: null,
    order: 6,
    active: true,
    description: 'Perumusan dan pelaksanaan kebijakan teknis pengembangan sarana industri, standardisasi, serta industri manufaktur daerah.',
  },
  {
    id: '7',
    title: 'KELOMPOK JABATAN FUNGSIONAL',
    name: 'Kelompok Jabatan Fungsional Perindustrian',
    nip: '-',
    department: 'Bidang Perindustrian',
    echelon: 'Jabatan Fungsional Tertentu',
    group: 'FUNGSIONAL',
    parentId: '6',
    photo: null,
    order: 7,
    active: true,
    description: 'Pelaksanaan keahlian teknis pengembangan dan standardisasi industri.',
  },
  {
    id: '8',
    title: 'KEPALA BIDANG FASILITASI DAN PENGEMBANGN IKM',
    name: 'NOVIANE K.S.KOAGOW,SE',
    nip: '197011121993032006',
    department: 'Bidang Fasilitasi dan Pengembangan IKM',
    echelon: 'Eselon III.a (Administrator)',
    group: 'BIDANG',
    parentId: '1',
    photo: null,
    order: 8,
    active: true,
    description: 'Pembinaan, pendataan terpadu SIPIKEM, fasilitasi sertifikasi halal/HAKI/BPOM, serta pendampingan naik kelas Industri Kecil dan Menengah di 15 Kab/Kota.',
  },
  {
    id: '9',
    title: 'KELOMPOK JABATAN FUNGSIONAL',
    name: 'Kelompok Jabatan Fungsional Fasilitasi & Pengembangan IKM',
    nip: '-',
    department: 'Bidang Fasilitasi dan Pengembangan IKM',
    echelon: 'Jabatan Fungsional Tertentu',
    group: 'FUNGSIONAL',
    parentId: '8',
    photo: null,
    order: 9,
    active: true,
    description: 'Pendampingan lapangan, verifikasi berkas izin usaha, dan kurasi produk IKM unggulan daerah.',
  },
  {
    id: '10',
    title: 'KEPALA BIDANG PERDAGANGAN LUAR NEGERI',
    name: 'DRS.STEYVEN RICO LASUT',
    nip: '1968110819899021002',
    department: 'Bidang Perdagangan Luar Negeri',
    echelon: 'Eselon III.a (Administrator)',
    group: 'BIDANG',
    parentId: '1',
    photo: null,
    order: 10,
    active: true,
    description: 'Fasilitasi ekspor, kerja sama perdagangan internasional, promosi komoditas unggulan Sulut ke pasar global, dan pengawasan ekspor-impor.',
  },
  {
    id: '11',
    title: 'KELOMPOK JABATAN FUNGSIONAL',
    name: 'Kelompok Jabatan Fungsional Perdagangan Luar Negeri',
    nip: '-',
    department: 'Bidang Perdagangan Luar Negeri',
    echelon: 'Jabatan Fungsional Tertentu',
    group: 'FUNGSIONAL',
    parentId: '10',
    photo: null,
    order: 11,
    active: true,
    description: 'Analisis pasar ekspor internasional dan pembinaan business matching buyer luar negeri.',
  },
  {
    id: '12',
    title: 'KEPALA BIDANG PERDAGANGAN DALAM NEGERI',
    name: 'LEYLA PAULA KARAMOY,SH',
    nip: '197110271995032002',
    department: 'Bidang Perdagangan Dalam Negeri',
    echelon: 'Eselon III.a (Administrator)',
    group: 'BIDANG',
    parentId: '1',
    photo: null,
    order: 12,
    active: true,
    description: 'Stabilisasi pasokan dan harga bahan pokok, pengawasan peredaran barang/jasa, perlindungan konsumen, dan pemberdayaan pasar tradisional.',
  },
  {
    id: '13',
    title: 'KELOMPOK JABATAN FUNGSIONAL',
    name: 'Kelompok Jabatan Fungsional Perdagangan Dalam Negeri',
    nip: '-',
    department: 'Bidang Perdagangan Dalam Negeri',
    echelon: 'Jabatan Fungsional Tertentu',
    group: 'FUNGSIONAL',
    parentId: '12',
    photo: null,
    order: 13,
    active: true,
    description: 'Pemantauan fluktuasi harga kebutuhan pokok dan pengawasan metrologi legal barang beredar.',
  },
  {
    id: '14',
    title: 'KEPALA UPTD BALAI PENGUJIAN DAN SERTIFIKASI MUTU DAN BARANG',
    name: 'TUTTY P. SAERANG ST',
    nip: '198011302011022001',
    department: 'UPTD Balai Pengujian dan Sertifikasi Mutu dan Barang',
    echelon: 'Eselon III.b (Administrator Teknis)',
    group: 'UPTD',
    parentId: '1',
    photo: null,
    order: 14,
    active: true,
    description: 'Pelayanan pengujian laboratorium, kalibrasi peralatan, dan sertifikasi mutu barang/komoditas perdagangan daerah.',
  },
];

export interface AppSettingsData {
  bannerLanding: string;
  bannerDashboard: string;
  categories: string[];
  orgStructure: OrgMember[];
}

/**
 * Mengambil seluruh pengaturan aplikasi (Banner, Kategori IKM, & Struktur Organisasi)
 * dengan jaminan fallback nilai bawaan bila belum diatur di database.
 */
export async function getAppSettings(): Promise<AppSettingsData> {
  try {
    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['banner_landing', 'banner_dashboard', 'ikm_categories', 'org_structure'],
        },
      },
    });

    const settingsMap = new Map(settings.map((s) => [s.key, s.value]));

    let categories = DEFAULT_CATEGORIES;
    const catValue = settingsMap.get('ikm_categories');
    if (catValue) {
      try {
        const parsed = JSON.parse(catValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          categories = parsed;
        }
      } catch (e) {
        console.error('Error parsing ikm_categories setting:', e);
      }
    }

    let orgStructure = DEFAULT_ORG_STRUCTURE;
    const orgValue = settingsMap.get('org_structure');
    if (orgValue) {
      try {
        const parsed = JSON.parse(orgValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          orgStructure = parsed;
        }
      } catch (e) {
        console.error('Error parsing org_structure setting:', e);
      }
    }

    return {
      bannerLanding: settingsMap.get('banner_landing') || DEFAULT_LANDING_BANNER,
      bannerDashboard: settingsMap.get('banner_dashboard') || DEFAULT_DASHBOARD_BANNER,
      categories,
      orgStructure,
    };
  } catch (error) {
    console.error('Failed to get app settings, falling back to defaults:', error);
    return {
      bannerLanding: DEFAULT_LANDING_BANNER,
      bannerDashboard: DEFAULT_DASHBOARD_BANNER,
      categories: DEFAULT_CATEGORIES,
      orgStructure: DEFAULT_ORG_STRUCTURE,
    };
  }
}

/**
 * Menyimpan pembaruan pengaturan aplikasi.
 */
export async function saveAppSetting(key: string, value: string): Promise<void> {
  await prisma.appSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
