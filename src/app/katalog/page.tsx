import React from 'react';
import { prisma } from '@/lib/prisma';
import { getAppSettings } from '@/lib/settings';
import KatalogClientView from './KatalogClientView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Katalog Produk IKM Sulawesi Utara - SIPIKEM SULUT',
  description: 'Daftar produk unggulan pelaku Industri Kecil dan Menengah (IKM) terverifikasi resmi oleh Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara.',
};

export default async function KatalogPage() {
  // Ambil seluruh data IKM yang berstatus APPROVED dari PostgreSQL
  const [approvedMerchants, settings] = await Promise.all([
    prisma.merchantRegistration.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        registrationNo: true,
        businessName: true,
        ownerName: true,
        phone: true,
        email: true,
        regency: true,
        district: true,
        village: true,
        address: true,
        category: true,
        scale: true,
        employeeCount: true,
        mainProduct: true,
        productType: true,
        rawMaterial: true,
        productionCapacity: true,
        productPrice: true,
        productAdvantage: true,
        nib: true,
        businessLicense: true,
        halalCert: true,
        bpomPirt: true,
        haki: true,
        monthlyRevenue: true,
        marketChannels: true,
        socialMedia: true,
        ikmScore: true,
        mentoringStatus: true,
        businessImage: true,
        createdAt: true,
      },
    }),
    getAppSettings(),
  ]);

  return (
    <KatalogClientView
      initialMerchants={approvedMerchants}
      categories={settings.categories}
    />
  );
}
