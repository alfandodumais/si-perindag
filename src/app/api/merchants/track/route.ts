import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Nomor Pendaftaran atau NIK harus diisi' },
        { status: 400 }
      );
    }

    const merchant = await prisma.merchantRegistration.findFirst({
      where: {
        OR: [
          { registrationNo: query },
          { registrationNo: query.toUpperCase() },
          { nik: query },
        ],
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { success: false, message: 'Data pendaftaran tidak ditemukan. Pastikan Nomor Pendaftaran atau NIK sudah benar.' },
        { status: 404 }
      );
    }

    // Mask NIK partially for public privacy if checked by regNo (e.g. 1472**********01)
    const maskedNik = merchant.nik.length > 8
      ? merchant.nik.substring(0, 4) + '*'.repeat(merchant.nik.length - 8) + merchant.nik.substring(merchant.nik.length - 4)
      : merchant.nik;

    return NextResponse.json({
      success: true,
      data: {
        ...merchant,
        nikMasked: maskedNik,
      },
    });
  } catch (error: any) {
    console.error('Error tracking merchant:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal melakukan pelacakan status' },
      { status: 500 }
    );
  }
}
