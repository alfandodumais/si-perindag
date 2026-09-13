import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveBase64AsPhysicalFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';

// Helper to generate unique registration number: IKM-SULUT-YYYYMM-XXXX
async function generateRegistrationNo(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const prefix = `IKM-SULUT-${year}${month}`;

  // Find count for this prefix
  const count = await prisma.merchantRegistration.count({
    where: {
      registrationNo: {
        startsWith: prefix,
      },
    },
  });

  const sequential = String(count + 1).padStart(4, '0');
  return `${prefix}-${sequential}`;
}

// Mapping from standard regency name to search keywords & aliases
const REGENCY_KEYWORD_MAP: Record<string, string[]> = {
  'Kota Manado': ['Kota Manado', 'Manado'],
  'Kota Bitung': ['Kota Bitung', 'Bitung'],
  'Kota Tomohon': ['Kota Tomohon', 'Tomohon'],
  'Kota Kotamobagu': ['Kota Kotamobagu', 'Kotamobagu'],
  'Kab. Minahasa': ['Kab. Minahasa', 'Minahasa', 'Kabupaten Minahasa'],
  'Kab. Minahasa Utara': ['Kab. Minahasa Utara', 'Minahasa Utara', 'Minut'],
  'Kab. Minahasa Selatan': ['Kab. Minahasa Selatan', 'Minahasa Selatan', 'Minsel'],
  'Kab. Minahasa Tenggara': ['Kab. Minahasa Tenggara', 'Minahasa Tenggara', 'Mitra'],
  'Kab. Bolaang Mongondow': ['Kab. Bolaang Mongondow', 'Bolaang Mongondow', 'Bolmong'],
  'Kab. Bolaang Mongondow Utara': ['Kab. Bolaang Mongondow Utara', 'Bolaang Mongondow Utara', 'Bolmut'],
  'Kab. Bolaang Mongondow Timur': ['Kab. Bolaang Mongondow Timur', 'Bolaang Mongondow Timur', 'Boltim'],
  'Kab. Bolaang Mongondow Selatan': ['Kab. Bolaang Mongondow Selatan', 'Bolaang Mongondow Selatan', 'Bolsel'],
  'Kab. Kepulauan Sitaro': ['Kab. Kepulauan Sitaro', 'Kepulauan Sitaro', 'Sitaro', 'Siau Tagulandang Biaro', 'Siau', 'Tagulandang'],
  'Kab. Kepulauan Sangihe': ['Kab. Kepulauan Sangihe', 'Kepulauan Sangihe', 'Sangihe', 'Tahuna'],
  'Kab. Kepulauan Talaud': ['Kab. Kepulauan Talaud', 'Kepulauan Talaud', 'Talaud', 'Melonguane'],
};

// GET: Filter & retrieve IKM registrations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();
    const category = searchParams.get('category');
    const regency = searchParams.get('regency') || searchParams.get('district');
    const legalitas = searchParams.get('legalitas');
    const mentoringStatus = searchParams.get('mentoringStatus');
    const ikmScore = searchParams.get('ikmScore');
    const publicOnly = searchParams.get('publicOnly') === 'true';
    const limit = searchParams.get('limit');
    const take = limit ? parseInt(limit, 10) : undefined;

    const andConditions: any[] = [];

    // 1. Status Filter
    if (status && status !== 'ALL') {
      andConditions.push({ status });
    } else if (publicOnly) {
      andConditions.push({ status: 'APPROVED' });
    }

    // 2. Category Filter
    if (category && category !== 'ALL') {
      andConditions.push({
        category: { contains: category, mode: 'insensitive' }
      });
    }

    // 3. Regency Filter (Multi-alias aware)
    if (regency && regency !== 'ALL') {
      const cleanRegency = regency.trim();
      const baseName = cleanRegency.replace(/^(Kota|Kab\.|Kabupaten)\s+/i, '').trim();
      const mappedKeywords = REGENCY_KEYWORD_MAP[cleanRegency] || [cleanRegency, baseName];

      andConditions.push({
        OR: mappedKeywords.flatMap((kw) => [
          { regency: { contains: kw, mode: 'insensitive' } },
          { district: { contains: kw, mode: 'insensitive' } },
        ])
      });
    }

    // 4. Legalitas (NIB) Filter
    if (legalitas && legalitas !== 'ALL') {
      if (legalitas === 'LENGKAP' || legalitas === 'Ada') {
        andConditions.push({
          nib: { not: null, notIn: ['', '-'] }
        });
      } else if (legalitas === 'BELUM' || legalitas === 'Belum Ada') {
        andConditions.push({
          OR: [{ nib: null }, { nib: '' }, { nib: '-' }]
        });
      }
    }

    // 5. Mentoring Status Filter
    if (mentoringStatus && mentoringStatus !== 'ALL') {
      andConditions.push({
        mentoringStatus: { contains: mentoringStatus, mode: 'insensitive' }
      });
    }

    // 6. IKM Score Filter
    if (ikmScore && ikmScore !== 'ALL') {
      andConditions.push({
        ikmScore: { contains: ikmScore, mode: 'insensitive' }
      });
    }

    // 7. General Text Search across multiple fields
    if (search) {
      andConditions.push({
        OR: [
          { businessName: { contains: search, mode: 'insensitive' } },
          { ownerName: { contains: search, mode: 'insensitive' } },
          { mainProduct: { contains: search, mode: 'insensitive' } },
          { registrationNo: { contains: search, mode: 'insensitive' } },
          { nik: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { regency: { contains: search, mode: 'insensitive' } },
          { district: { contains: search, mode: 'insensitive' } },
        ]
      });
    }

    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    const merchants = await prisma.merchantRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(take ? { take } : {}),
    });

    return NextResponse.json({
      success: true,
      count: merchants.length,
      data: merchants,
    });
  } catch (error: any) {
    console.error('Error fetching IKM:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data IKM Sulawesi Utara' },
      { status: 500 }
    );
  }
}

// POST: Submission of IKM registration (Public or Admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      nik,
      ownerName,
      phone,
      email,
      businessName,
      yearFounded,
      regency,
      district,
      village,
      address,
      postalCode,
      latitude,
      longitude,
      category,
      scale,
      employeeCount,
      mainProduct,
      productType,
      rawMaterial,
      productionCapacity,
      productPrice,
      productAdvantage,
      nib,
      businessLicense,
      npwp,
      halalCert,
      bpomPirt,
      haki,
      productionEquipment,
      monthlyRevenue,
      marketChannels,
      socialMedia,
      fundingSource,
      bankAccess,
      partnerships,
      needs,
      ikmScore,
      mentoringStatus,
      ktpImage,
      businessImage,
    } = body;

    // Validation
    if (!nik || !ownerName || !phone || !businessName || !category || !address) {
      return NextResponse.json(
        { success: false, message: 'Harap lengkapi kolom identitas wajib (NIK, Nama Pemilik, Telepon, Nama Usaha, Kategori, Alamat)' },
        { status: 400 }
      );
    }

    const registrationNo = await generateRegistrationNo();

    // Ensure images are physically saved as files on disk
    const physicalKtpImage = await saveBase64AsPhysicalFile(ktpImage, 'ktp');
    const physicalBusinessImage = await saveBase64AsPhysicalFile(businessImage, 'usaha');

    const newRegistration = await prisma.merchantRegistration.create({
      data: {
        registrationNo,
        nik: String(nik).trim(),
        ownerName: String(ownerName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        businessName: String(businessName).trim(),
        yearFounded: yearFounded ? parseInt(yearFounded) : new Date().getFullYear(),
        regency: regency ? String(regency).trim() : 'Manado',
        district: district ? String(district).trim() : (regency || 'Manado'),
        village: village ? String(village).trim() : null,
        address: String(address).trim(),
        postalCode: postalCode ? String(postalCode).trim() : null,
        latitude: latitude ? parseFloat(latitude) : 1.4822,
        longitude: longitude ? parseFloat(longitude) : 124.8428,
        category: String(category).trim(),
        scale: scale || 'Mikro',
        employeeCount: employeeCount ? parseInt(employeeCount) : 1,
        mainProduct: mainProduct ? String(mainProduct).trim() : null,
        productType: productType ? String(productType).trim() : null,
        rawMaterial: rawMaterial ? String(rawMaterial).trim() : null,
        productionCapacity: productionCapacity ? String(productionCapacity).trim() : null,
        productPrice: productPrice ? parseFloat(productPrice) : null,
        productAdvantage: productAdvantage ? String(productAdvantage).trim() : null,
        nib: nib ? String(nib).trim() : null,
        businessLicense: businessLicense || (nib ? 'Ada' : 'Belum Ada'),
        npwp: npwp ? String(npwp).trim() : null,
        halalCert: halalCert ? String(halalCert).trim() : null,
        bpomPirt: bpomPirt ? String(bpomPirt).trim() : null,
        haki: haki ? String(haki).trim() : null,
        productionEquipment: productionEquipment ? String(productionEquipment).trim() : null,
        monthlyRevenue: monthlyRevenue ? parseFloat(monthlyRevenue) : null,
        marketChannels: marketChannels || 'Offline',
        socialMedia: socialMedia ? String(socialMedia).trim() : null,
        fundingSource: fundingSource ? String(fundingSource).trim() : null,
        bankAccess: bankAccess ? String(bankAccess).trim() : null,
        partnerships: partnerships ? String(partnerships).trim() : null,
        needs: needs ? String(needs).trim() : null,
        ikmScore: ikmScore || 'Berkembang',
        mentoringStatus: mentoringStatus || 'Pendataan',
        ktpImage: physicalKtpImage || null,
        businessImage: physicalBusinessImage || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran IKM berhasil dikirim ke sistem SIPIKEM SULUT',
      data: newRegistration,
    });
  } catch (error: any) {
    console.error('Error submitting IKM registration:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses pendaftaran IKM. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
