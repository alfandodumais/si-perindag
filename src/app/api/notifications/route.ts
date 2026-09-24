import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch latest pending registrations (waiting for verification)
    const pendingMerchants = await prisma.merchantRegistration.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: {
        id: true,
        registrationNo: true,
        businessName: true,
        ownerName: true,
        category: true,
        regency: true,
        status: true,
        createdAt: true,
      },
    });

    // 2. Fetch latest verified registrations (approved or rejected)
    const verifiedMerchants = await prisma.merchantRegistration.findMany({
      where: {
        status: { in: ['APPROVED', 'REJECTED'] },
        verifiedAt: { not: null },
      },
      orderBy: { verifiedAt: 'desc' },
      take: 15,
      select: {
        id: true,
        registrationNo: true,
        businessName: true,
        ownerName: true,
        category: true,
        regency: true,
        status: true,
        adminNotes: true,
        verifiedBy: true,
        verifiedAt: true,
        updatedAt: true,
      },
    });

    // 3. Map into normalized notification items
    const notifications = [
      ...pendingMerchants.map((m) => ({
        id: `pending-${m.id}`,
        merchantId: m.id,
        registrationNo: m.registrationNo,
        type: 'NEW_REGISTRATION' as const,
        status: 'PENDING' as const,
        title: 'Pendaftaran IKM Baru',
        message: `${m.businessName} (${m.ownerName}) dari ${m.regency || 'Sulut'} telah mendaftar dan menunggu verifikasi berkas.`,
        businessName: m.businessName,
        ownerName: m.ownerName,
        regency: m.regency,
        category: m.category,
        timestamp: m.createdAt.toISOString(),
        url: `/admin/verifikasi?id=${m.id}`,
      })),
      ...verifiedMerchants.map((m) => ({
        id: `verified-${m.id}-${m.status}`,
        merchantId: m.id,
        registrationNo: m.registrationNo,
        type: m.status === 'APPROVED' ? ('VERIFICATION_APPROVED' as const) : ('VERIFICATION_REJECTED' as const),
        status: m.status as 'APPROVED' | 'REJECTED',
        title: m.status === 'APPROVED' ? 'IKM Disetujui' : 'IKM Ditolak',
        message:
          m.status === 'APPROVED'
            ? `${m.businessName} telah diverifikasi & DISETUJUI${m.verifiedBy ? ` oleh ${m.verifiedBy}` : ''}. STBP-IKM diterbitkan.`
            : `${m.businessName} DITOLAK${m.verifiedBy ? ` oleh ${m.verifiedBy}` : ''}.${m.adminNotes ? ` Alasan: "${m.adminNotes}"` : ''}`,
        businessName: m.businessName,
        ownerName: m.ownerName,
        regency: m.regency,
        category: m.category,
        adminNotes: m.adminNotes,
        verifiedBy: m.verifiedBy,
        timestamp: (m.verifiedAt || m.updatedAt).toISOString(),
        url: m.status === 'APPROVED' ? `/admin/ikm?id=${m.id}` : `/admin/verifikasi?id=${m.id}`,
      })),
    ];

    // 4. Sort newest first
    notifications.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const pendingCount = pendingMerchants.length;

    return NextResponse.json({
      success: true,
      pendingCount,
      total: notifications.length,
      data: notifications.slice(0, 20),
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat notifikasi sistem.' },
      { status: 500 }
    );
  }
}
