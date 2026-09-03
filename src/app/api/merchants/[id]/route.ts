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
    const { status, adminNotes } = body;

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

    const updated = await prisma.merchantRegistration.update({
      where: { id: params.id },
      data: {
        status,
        adminNotes: adminNotes ? adminNotes.trim() : null,
        verifiedAt: status !== 'PENDING' ? new Date() : null,
        verifiedBy: status !== 'PENDING' ? session.name : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Permohonan pendaftaran berhasil di-${status === 'APPROVED' ? 'setujui' : status === 'REJECTED' ? 'tolak' : 'reset'}`,
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

// DELETE: Delete record (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak.' },
        { status: 401 }
      );
    }

    await prisma.merchantRegistration.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Data pendaftaran berhasil dihapus',
    });
  } catch (error: any) {
    console.error('Error deleting merchant:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus data pendaftaran' },
      { status: 500 }
    );
  }
}
