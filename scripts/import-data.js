const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importData() {
  const backupFile = path.join(__dirname, '..', 'backup', 'supabase-backup.json');
  if (!fs.existsSync(backupFile)) {
    console.error(`File backup tidak ditemukan di: ${backupFile}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(backupFile, 'utf-8');
  const data = JSON.parse(raw);

  console.log(`Mengimpor data ke database lokal (${process.env.DATABASE_URL})...`);

  // 1. Users
  console.log(`Mengimpor ${data.users.length} Users...`);
  for (const user of data.users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: user,
      create: user,
    });
  }

  // 2. AppSettings
  console.log(`Mengimpor ${data.settings.length} AppSettings...`);
  for (const setting of data.settings) {
    await prisma.appSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  // 3. Merchants
  console.log(`Mengimpor ${data.merchants.length} Merchants...`);
  for (const merchant of data.merchants) {
    // ensure date types
    const m = { ...merchant };
    if (m.createdAt) m.createdAt = new Date(m.createdAt);
    if (m.updatedAt) m.updatedAt = new Date(m.updatedAt);
    if (m.verifiedAt) m.verifiedAt = new Date(m.verifiedAt);

    await prisma.merchantRegistration.upsert({
      where: { registrationNo: m.registrationNo },
      update: m,
      create: m,
    });
  }

  console.log('\n[BERHASIL!] Seluruh data berhasil diimpor ke database lokal!');
}

importData()
  .catch((err) => {
    console.error('Error saat impor:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
