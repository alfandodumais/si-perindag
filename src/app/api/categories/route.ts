import { NextResponse } from 'next/server';
import { getAppSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getAppSettings();
    return NextResponse.json({
      success: true,
      categories: settings.categories,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data kategori IKM' },
      { status: 500 }
    );
  }
}
