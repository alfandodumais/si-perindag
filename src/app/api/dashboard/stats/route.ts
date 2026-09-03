import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak.' },
        { status: 401 }
      );
    }

    const [total, pending, approved, rejected] = await Promise.all([
      prisma.merchantRegistration.count(),
      prisma.merchantRegistration.count({ where: { status: 'PENDING' } }),
      prisma.merchantRegistration.count({ where: { status: 'APPROVED' } }),
      prisma.merchantRegistration.count({ where: { status: 'REJECTED' } }),
    ]);

    // Group by category
    const categoryGroup = await prisma.merchantRegistration.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Group by district
    const districtGroup = await prisma.merchantRegistration.groupBy({
      by: ['district'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Recent 5 registrations
    const recent = await prisma.merchantRegistration.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          total,
          pending,
          approved,
          rejected,
        },
        byCategory: categoryGroup.map(c => ({
          category: c.category,
          count: c._count.id,
        })),
        byDistrict: districtGroup.map(d => ({
          district: d.district,
          count: d._count.id,
        })),
        recent,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data statistik dashboard' },
      { status: 500 }
    );
  }
}
