import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { saveBase64AsPhysicalFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';

// GET: Get single IKM by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const merchant = await prisma.merchantRegistration.findUnique({
      where: { id: params.id },
    });

    if (!merchant) {
      return NextResponse.json(
        { success: false, message: 'Data IKM tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: merchant,
    });
  } catch (error: any) {
    console.error('Error fetching single IKM:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail IKM' },
      { status: 500 }
    );
  }
}

// PATCH: Update / Verify IKM
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Silakan login sebagai petugas dinas.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      status,
      adminNotes,
      ikmScore,
      mentoringStatus,
      businessName,
      ownerName,
      nik,
      phone,
      email,
      address,
      regency,
      district,
      village,
      postalCode,
      latitude,
      longitude,
      yearFounded,
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
      ktpImage,
      businessImage,
    } = body;

    const updateData: any = {};

    // 1. Verification status
    if (status) {
      if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
        return NextResponse.json(
          { success: false, message: 'Status verifikasi tidak valid' },
          { status: 400 }
        );
      }

      if (status === 'REJECTED' && (!adminNotes || !adminNotes.trim())) {
        return NextResponse.json(
          { success: false, message: 'Alasan penolakan / catatan revisi wajib diisi jika menolak pendaftaran' },
          { status: 400 }
        );
      }

      updateData.status = status;
      updateData.adminNotes = adminNotes ? adminNotes.trim() : null;
      updateData.verifiedAt = status !== 'PENDING' ? new Date() : null;
      updateData.verifiedBy = status !== 'PENDING' ? session.name : null;
    }

    // 2. IKM Score & Mentoring status
    if (ikmScore) updateData.ikmScore = ikmScore;
    if (mentoringStatus) updateData.mentoringStatus = mentoringStatus;
    if (adminNotes !== undefined && !status) updateData.adminNotes = adminNotes ? adminNotes.trim() : null;

    // 3. Full detail edits (8 Clusters from DATA IKM.pdf)
    if (businessName) updateData.businessName = businessName.trim();
    if (ownerName) updateData.ownerName = ownerName.trim();
    if (nik !== undefined) updateData.nik = nik ? nik.trim() : undefined;
    if (phone) updateData.phone = phone.trim();
    if (email !== undefined) updateData.email = email ? email.trim() : null;
    if (address) updateData.address = address.trim();
    if (regency) updateData.regency = regency.trim();
    if (district) updateData.district = district.trim();
    if (village !== undefined) updateData.village = village ? village.trim() : null;
    if (postalCode !== undefined) updateData.postalCode = postalCode ? postalCode.trim() : null;
    if (latitude !== undefined && latitude !== null && !isNaN(Number(latitude))) {
      updateData.latitude = parseFloat(latitude);
    }
    if (longitude !== undefined && longitude !== null && !isNaN(Number(longitude))) {
      updateData.longitude = parseFloat(longitude);
    }
    if (yearFounded !== undefined && yearFounded !== null && !isNaN(Number(yearFounded))) {
      updateData.yearFounded = parseInt(yearFounded);
    }
    if (category) updateData.category = category.trim();
    if (scale) updateData.scale = scale.trim();
    if (employeeCount !== undefined) updateData.employeeCount = parseInt(employeeCount) || 1;
    if (mainProduct !== undefined) updateData.mainProduct = mainProduct ? mainProduct.trim() : null;
    if (productType !== undefined) updateData.productType = productType ? productType.trim() : null;
    if (rawMaterial !== undefined) updateData.rawMaterial = rawMaterial ? rawMaterial.trim() : null;
    if (productionCapacity !== undefined) updateData.productionCapacity = productionCapacity ? productionCapacity.trim() : null;
    if (productPrice !== undefined) updateData.productPrice = productPrice ? parseFloat(productPrice) : null;
    if (productAdvantage !== undefined) updateData.productAdvantage = productAdvantage ? productAdvantage.trim() : null;
    if (nib !== undefined) updateData.nib = nib ? nib.trim() : null;
    if (businessLicense !== undefined) updateData.businessLicense = businessLicense ? businessLicense.trim() : null;
    if (npwp !== undefined) updateData.npwp = npwp ? npwp.trim() : null;
    if (halalCert !== undefined) updateData.halalCert = halalCert ? halalCert.trim() : null;
    if (bpomPirt !== undefined) updateData.bpomPirt = bpomPirt ? bpomPirt.trim() : null;
    if (haki !== undefined) updateData.haki = haki ? haki.trim() : null;
    if (productionEquipment !== undefined) updateData.productionEquipment = productionEquipment ? productionEquipment.trim() : null;
    if (monthlyRevenue !== undefined) updateData.monthlyRevenue = monthlyRevenue ? parseFloat(monthlyRevenue) : null;
    if (marketChannels !== undefined) updateData.marketChannels = marketChannels;
    if (socialMedia !== undefined) updateData.socialMedia = socialMedia ? socialMedia.trim() : null;
    if (fundingSource !== undefined) updateData.fundingSource = fundingSource ? fundingSource.trim() : null;
    if (bankAccess !== undefined) updateData.bankAccess = bankAccess ? bankAccess.trim() : null;
    if (partnerships !== undefined) updateData.partnerships = partnerships ? partnerships.trim() : null;
    if (needs !== undefined) updateData.needs = needs ? needs.trim() : null;

    if (ktpImage && ktpImage.startsWith('data:image/')) {
      updateData.ktpImage = await saveBase64AsPhysicalFile(ktpImage, 'ktp');
    }
    if (businessImage && businessImage.startsWith('data:image/')) {
      updateData.businessImage = await saveBase64AsPhysicalFile(businessImage, 'usaha');
    }

    const updated = await prisma.merchantRegistration.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Data IKM berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating IKM:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui data IKM' },
      { status: 500 }
    );
  }
}

// PUT: Full / Partial update of IKM (same as PATCH)
export async function PUT(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  return PATCH(req, ctx);
}

// DELETE: Delete record (Strictly Superadmin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    if (session.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Hanya Superadmin yang berwenang menghapus data IKM.' },
        { status: 403 }
      );
    }

    const target = await prisma.merchantRegistration.findUnique({
      where: { id: params.id },
    });

    if (!target) {
      return NextResponse.json(
        { success: false, message: 'Data IKM tidak ditemukan.' },
        { status: 404 }
      );
    }

    await prisma.merchantRegistration.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: `Data IKM "${target.businessName}" (${target.registrationNo}) berhasil dihapus permanen oleh Superadmin.`,
    });
  } catch (error: any) {
    console.error('Error deleting IKM:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus data IKM' },
      { status: 500 }
    );
  }
}
