import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAppSettings, saveAppSetting, DEFAULT_ORG_STRUCTURE, OrgMember } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getAppSettings();
    return NextResponse.json({
      success: true,
      data: settings.orgStructure || DEFAULT_ORG_STRUCTURE,
    });
  } catch (error: any) {
    console.error('Error fetching org structure:', error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_ORG_STRUCTURE,
    });
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
    const { orgStructure } = body;

    if (!Array.isArray(orgStructure)) {
      return NextResponse.json(
        { success: false, message: 'Data struktur organisasi tidak valid' },
        { status: 400 }
      );
    }

    await saveAppSetting('org_structure', JSON.stringify(orgStructure));

    return NextResponse.json({
      success: true,
      message: 'Struktur organisasi Disperindag berhasil diperbarui.',
      data: orgStructure,
    });
  } catch (error: any) {
    console.error('Error updating org structure:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat menyimpan struktur organisasi.' },
      { status: 500 }
    );
  }
}
