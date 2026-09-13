import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAppSettings, saveAppSetting } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getAppSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pengaturan sistem' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Sesi telah berakhir, silakan login kembali' },
        { status: 401 }
      );
    }

    if (session.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Fitur ini khusus untuk Superadmin.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { bannerLanding, bannerDashboard, categories } = body;

    if (bannerLanding !== undefined && typeof bannerLanding === 'string') {
      await saveAppSetting('banner_landing', bannerLanding.trim() || '/banner.png');
    }

    if (bannerDashboard !== undefined && typeof bannerDashboard === 'string') {
      await saveAppSetting('banner_dashboard', bannerDashboard.trim() || '/banner.png');
    }

    if (categories !== undefined && Array.isArray(categories)) {
      // Clean and sanitize categories
      const cleanCategories = categories
        .map((c: any) => (typeof c === 'string' ? c.trim() : ''))
        .filter((c: string) => c.length > 0);

      if (cleanCategories.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Daftar kategori tidak boleh kosong minimal harus ada 1 kategori.' },
          { status: 400 }
        );
      }

      await saveAppSetting('ikm_categories', JSON.stringify(cleanCategories));
    }

    const updatedSettings = await getAppSettings();

    return NextResponse.json({
      success: true,
      message: 'Pengaturan sistem berhasil disimpan.',
      settings: updatedSettings,
    });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat menyimpan pengaturan.' },
      { status: 500 }
    );
  }
}
