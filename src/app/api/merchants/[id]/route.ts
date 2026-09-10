import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

// GET detail
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
        { success: false, message: 'Data pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: merchant,
    });
  } catch (error: any) {
    console.error('Error fetching merchant detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail pendaftaran' },
      { status: 500 }
    );
  }
}

// PATCH: Verify merchant (Approve / Reject)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Silakan login sebagai petugas admin.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, adminNotes, businessName, ownerName, phone, email, address, district, category, scale } = body;

    const updateData: any = {};

    // Verification status update (Allowed for both SUPERADMIN and ADMIN)
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

    // Full data correction / editing (Only allowed for SUPERADMIN)
    const isEditingDetails = businessName || ownerName || phone || email !== undefined || address || district || category || scale;
    if (isEditingDetails) {
      if (session.role !== 'SUPERADMIN') {
        return NextResponse.json(
          { success: false, message: 'Hanya Superadmin yang memiliki izin untuk mengubah rincian data pendaftar.' },
          { status: 403 }
        );
      }

      if (businessName) updateData.businessName = businessName.trim();
      if (ownerName) updateData.ownerName = ownerName.trim();
      if (phone) updateData.phone = phone.trim();
      if (email !== undefined) updateData.email = email ? email.trim() : null;
      if (address) updateData.address = address.trim();
      if (district) updateData.district = district.trim();
      if (category) updateData.category = category.trim();
      if (scale) updateData.scale = scale.trim();
    }

    const updated = await prisma.merchantRegistration.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: isEditingDetails
        ? 'Data UMKM berhasil diperbarui oleh Superadmin'
        : `Permohonan pendaftaran berhasil di-${status === 'APPROVED' ? 'setujui' : status === 'REJECTED' ? 'tolak' : 'reset'}`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating merchant verification:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses verifikasi permohonan' },
      { status: 500 }
    );
  }
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

    // Role check: Only SUPERADMIN can delete registrations
    if (session.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Hanya Superadmin yang berwenang menghapus data UMKM.' },
        { status: 403 }
      );
    }

    const target = await prisma.merchantRegistration.findUnique({
      where: { id: params.id },
    });

    if (!target) {
      return NextResponse.json(
        { success: false, message: 'Data pendaftaran tidak ditemukan.' },
        { status: 404 }
      );
    }

    await prisma.merchantRegistration.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: `Data pendaftaran "${target.businessName}" (${target.registrationNo}) berhasil dihapus permanen oleh Superadmin.`,
    });
  } catch (error: any) {
    console.error('Error deleting merchant:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus data pendaftaran' },
      { status: 500 }
    );
  }
}
