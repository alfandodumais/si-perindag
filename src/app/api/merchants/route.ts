import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Helper to generate unique registration number: REG-YYYYMM-XXXX
async function generateRegistrationNo(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const prefix = `REG-${year}${month}`;

  // Find count for this prefix
  const count = await prisma.merchantRegistration.count({
    where: {
      registrationNo: {
        startsWith: prefix,
      },
    },
  });

  const sequence = String(count + 1).padStart(4, '0');
  const regNo = `${prefix}-${sequence}`;

  // Double check uniqueness just in case
  const exists = await prisma.merchantRegistration.findUnique({
    where: { registrationNo: regNo },
  });

  if (exists) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomSuffix}`;
  }

  return regNo;
}

// GET: Fetch list of merchants (used by Admin Dashboard and Public Map)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();
    const category = searchParams.get('category');
    const district = searchParams.get('district');
    const publicOnly = searchParams.get('publicOnly') === 'true';

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    } else if (publicOnly) {
      // For public directory, only show APPROVED merchants
      where.status = 'APPROVED';
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (district && district !== 'ALL') {
      where.district = district;
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search } },
        { ownerName: { contains: search } },
        { registrationNo: { contains: search } },
        { nik: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const merchants = await prisma.merchantRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: merchants.length,
      data: merchants,
    });
  } catch (error: any) {
    console.error('Error fetching merchants:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data pendaftaran UMKM' },
      { status: 500 }
    );
  }
}

// POST: Public submission of merchant registration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      nik,
      ownerName,
      phone,
      email,
      businessName,
      category,
      scale,
      monthlyRevenue,
      employeeCount,
      address,
      district,
      village,
      postalCode,
      latitude,
      longitude,
      ktpImage,
      businessImage,
    } = body;

    // Validation
    if (!nik || !ownerName || !phone || !businessName || !category || !address || !district) {
      return NextResponse.json(
        { success: false, message: 'Harap lengkapi semua kolom wajib' },
        { status: 400 }
      );
    }

    if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
      return NextResponse.json(
        { success: false, message: 'Titik koordinat usaha pada peta wajib dipilih' },
        { status: 400 }
      );
    }

    const registrationNo = await generateRegistrationNo();

    const newRegistration = await prisma.merchantRegistration.create({
      data: {
        registrationNo,
        nik: String(nik).trim(),
        ownerName: String(ownerName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        businessName: String(businessName).trim(),
        category: String(category).trim(),
        scale: scale || 'Mikro',
        monthlyRevenue: monthlyRevenue ? parseFloat(monthlyRevenue) : null,
        employeeCount: employeeCount ? parseInt(employeeCount) : 1,
        address: String(address).trim(),
        district: String(district).trim(),
        village: village ? String(village).trim() : null,
        postalCode: postalCode ? String(postalCode).trim() : null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        ktpImage: ktpImage || null,
        businessImage: businessImage || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran UMKM berhasil dikirim dan sedang menunggu verifikasi Dinas Perdagangan',
      data: newRegistration,
    });
  } catch (error: any) {
    console.error('Error submitting merchant registration:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses pendaftaran. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
