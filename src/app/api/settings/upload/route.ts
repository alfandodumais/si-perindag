import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { saveBufferAsPhysicalFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const target = (formData.get('target') as string) || 'banner';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada file banner yang diunggah.' },
        { status: 400 }
      );
    }

    // Allow high-res banner up to 15 MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Ukuran banner terlalu besar. Maksimal 15 MB.' },
        { status: 400 }
      );
    }

    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Format gambar tidak didukung. Harap gunakan file PNG, JPG, atau WEBP.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let prefix = 'banner';
    if (target === 'landing') {
      prefix = 'banner-landing';
    } else if (target === 'dashboard') {
      prefix = 'banner-dashboard';
    } else if (target === 'official') {
      prefix = 'pejabat';
    }

    const physicalUrl = await saveBufferAsPhysicalFile(buffer, file.name, prefix);

    return NextResponse.json({
      success: true,
      message: 'Berkas gambar berhasil diunggah ke server.',
      url: physicalUrl,
    });
  } catch (error: any) {
    console.error('Banner upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat mengunggah banner.' },
      { status: 500 }
    );
  }
}
