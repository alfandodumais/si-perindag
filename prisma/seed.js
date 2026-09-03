const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data for Dinas Perdagangan Kota Manado...');

  // 1. Create / Update Admin Account
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: hashedPassword,
      name: 'Administrator Disperindag Kota Manado',
      email: 'admin@manadokota.go.id',
    },
    create: {
      username: 'admin',
      name: 'Administrator Disperindag Kota Manado',
      email: 'admin@manadokota.go.id',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user ready:', admin.username);

  // 2. Clear existing merchants to replace with authentic Manado sample data
  await prisma.merchantRegistration.deleteMany({});
  console.log('Re-populating merchants specifically for Kota Manado...');

  const sampleMerchants = [
    {
      registrationNo: 'REG-2026-0001',
      nik: '7171015504900001',
      ownerName: 'Gisella Rompas',
      phone: '081244556677',
      email: 'gisella.klapper@gmail.com',
      businessName: 'Klappertaart Christine & Kue Khas Manado',
      category: 'Kuliner & Makanan Khas Manado',
      scale: 'Kecil',
      monthlyRevenue: 28000000,
      employeeCount: 4,
      address: 'Jl. Sam Ratulangi No. 120, Kawasan Tikala',
      district: 'Wenang',
      village: 'Wenang Selatan',
      postalCode: '95111',
      latitude: 1.4789,
      longitude: 124.8415,
      status: 'APPROVED',
      adminNotes: 'Dokumen KTP valid, tempat usaha terverifikasi berada di sentra kuliner Wenang.',
      verifiedAt: new Date(),
      verifiedBy: 'Administrator Disperindag Kota Manado',
      ktpImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60',
      businessImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=60',
    },
    {
      registrationNo: 'REG-2026-0002',
      nik: '7171021208880002',
      ownerName: 'Novry Manoppo',
      phone: '081398877665',
      email: 'novry.wakeke@yahoo.com',
      businessName: 'Rumah Kopi & Tinutuan Wakeke Asli',
      category: 'Kuliner & Makanan Khas Manado',
      scale: 'Mikro',
      monthlyRevenue: 18000000,
      employeeCount: 3,
      address: 'Jl. Wakeke No. 8, Wisata Kuliner Tinutuan',
      district: 'Wenang',
      village: 'Pinaesaan',
      postalCode: '95122',
      latitude: 1.4872,
      longitude: 124.8431,
      status: 'APPROVED',
      adminNotes: 'Kuliner legendaris Kota Manado terverifikasi aktif.',
      verifiedAt: new Date(),
      verifiedBy: 'Administrator Disperindag Kota Manado',
      ktpImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60',
      businessImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=60',
    },
    {
      registrationNo: 'REG-2026-0003',
      nik: '7171032506920003',
      ownerName: 'Meyke Sondakh',
      phone: '082155667788',
      email: 'meyke.cakalang@gmail.com',
      businessName: 'Cakalang Fufu & Sambal Roa Gepe Manado',
      category: 'Hasil Laut, Perikanan & Agribisnis',
      scale: 'Kecil',
      monthlyRevenue: 35000000,
      employeeCount: 5,
      address: 'Jl. Hasanuddin No. 45, Dekat Pelabuhan Perikanan',
      district: 'Tuminting',
      village: 'Tumumpa Satu',
      postalCode: '95239',
      latitude: 1.5050,
      longitude: 124.8480,
      status: 'PENDING',
      adminNotes: null,
      ktpImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=60',
      businessImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=60',
    },
    {
      registrationNo: 'REG-2026-0004',
      nik: '7171041803850004',
      ownerName: 'Christian Waworuntu',
      phone: '085299887766',
      email: 'christian.souvenir@gmail.com',
      businessName: 'Kain Tenun Bentenan & Souvenir Kriya Manado',
      category: 'Kerajinan Tangan, Kriya & Souvenir',
      scale: 'Mikro',
      monthlyRevenue: 15000000,
      employeeCount: 2,
      address: 'Kawasan Megamas Boulevard Blok C No. 10',
      district: 'Sario',
      village: 'Sario Tumpaan',
      postalCode: '95114',
      latitude: 1.4705,
      longitude: 124.8320,
      status: 'APPROVED',
      adminNotes: 'Produk kerajinan unggulan daerah Kota Manado terverifikasi.',
      verifiedAt: new Date(),
      verifiedBy: 'Administrator Disperindag Kota Manado',
      ktpImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60',
      businessImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=60',
    },
    {
      registrationNo: 'REG-2026-0005',
      nik: '7171052209930005',
      ownerName: 'Franky Lontoh',
      phone: '081277663322',
      email: 'franky.bahu@yahoo.com',
      businessName: 'Bengkel Presisi Bahu Unsrat Motor',
      category: 'Jasa & Perbengkelan',
      scale: 'Mikro',
      monthlyRevenue: 12000000,
      employeeCount: 2,
      address: 'Jl. Wolter Monginsidi No. 78, Dekat Kampus Unsrat',
      district: 'Malalayang',
      village: 'Bahu',
      postalCode: '95115',
      latitude: 1.4580,
      longitude: 124.8250,
      status: 'PENDING',
      adminNotes: null,
      ktpImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60',
      businessImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=60',
    },
    {
      registrationNo: 'REG-2026-0006',
      nik: '7171060911910006',
      ownerName: 'Grace Pangemanan',
      phone: '085344221100',
      email: 'grace.paniki@gmail.com',
      businessName: 'Toko Kelontong Sembako Paniki Sejahtera',
      category: 'Retail / Kelontong / Sembako',
      scale: 'Mikro',
      monthlyRevenue: 20000000,
      employeeCount: 2,
      address: 'Jl. AA Maramis Km. 9, Jalur Bandara Sam Ratulangi',
      district: 'Mapanget',
      village: 'Paniki Bawah',
      postalCode: '95256',
      latitude: 1.5200,
      longitude: 124.8900,
      status: 'REJECTED',
      adminNotes: 'Foto e-KTP buram dan terpotong. Mohon daftar ulang dengan melampirkan foto e-KTP yang jelas dan terbaca.',
      verifiedAt: new Date(),
      verifiedBy: 'Administrator Disperindag Kota Manado',
      ktpImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60',
      businessImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=60',
    },
    {
      registrationNo: 'REG-2026-0007',
      nik: '7171071401870007',
      ownerName: 'Hengky Kawilarang',
      phone: '081299881122',
      email: 'hengky.paal2@gmail.com',
      businessName: 'Kios Buah Segar & Hasil Kebun Paal Dua',
      category: 'Retail / Kelontong / Sembako',
      scale: 'Mikro',
      monthlyRevenue: 16000000,
      employeeCount: 2,
      address: 'Jl. Yos Sudarso No. 34, Simpang Tiga Paal Dua',
      district: 'Paal Dua',
      village: 'Paal Dua',
      postalCode: '95129',
      latitude: 1.4880,
      longitude: 124.8620,
      status: 'APPROVED',
      adminNotes: 'Usaha perdagangan buah segar resmi terdata.',
      verifiedAt: new Date(),
      verifiedBy: 'Administrator Disperindag Kota Manado',
      ktpImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60',
      businessImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60',
    }
  ];

  for (const merchant of sampleMerchants) {
    await prisma.merchantRegistration.create({
      data: merchant,
    });
  }
  console.log(`Successfully seeded ${sampleMerchants.length} Kota Manado merchants across various districts.`);
  console.log('Seeding Kota Manado complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
