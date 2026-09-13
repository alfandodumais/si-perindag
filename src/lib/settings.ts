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

export interface AppSettingsData {
  bannerLanding: string;
  bannerDashboard: string;
  categories: string[];
}

/**
 * Mengambil seluruh pengaturan aplikasi (Banner & Kategori IKM)
 * dengan jaminan fallback nilai bawaan bila belum diatur di database.
 */
export async function getAppSettings(): Promise<AppSettingsData> {
  try {
    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['banner_landing', 'banner_dashboard', 'ikm_categories'],
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

    return {
      bannerLanding: settingsMap.get('banner_landing') || DEFAULT_LANDING_BANNER,
      bannerDashboard: settingsMap.get('banner_dashboard') || DEFAULT_DASHBOARD_BANNER,
      categories,
    };
  } catch (error) {
    console.error('Failed to get app settings, falling back to defaults:', error);
    return {
      bannerLanding: DEFAULT_LANDING_BANNER,
      bannerDashboard: DEFAULT_DASHBOARD_BANNER,
      categories: DEFAULT_CATEGORIES,
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
