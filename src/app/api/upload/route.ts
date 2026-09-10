import { NextRequest, NextResponse } from 'next/server';
import { saveBufferAsPhysicalFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const prefix = (formData.get('type') as string) || 'img';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada file yang diunggah.' },
        { status: 400 }
      );
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Ukuran file terlalu besar. Maksimal 5 MB.' },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Format file tidak didukung. Harap unggah foto berformat JPG, PNG, atau WEBP.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const physicalUrl = await saveBufferAsPhysicalFile(buffer, file.name, prefix);

    return NextResponse.json({
      success: true,
      message: 'Foto fisik berhasil disimpan ke server.',
      url: physicalUrl,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat menyimpan berkas fisik.' },
      { status: 500 }
    );
  }
}
