const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportData() {
  console.log('Mengambil data dari Supabase Cloud...');
  
  const users = await prisma.user.findMany();
  const merchants = await prisma.merchantRegistration.findMany();
  const settings = await prisma.appSetting.findMany();

  console.log(`Ditemukan:`);
  console.log(`- Users: ${users.length}`);
  console.log(`- Merchants: ${merchants.length}`);
  console.log(`- AppSettings: ${settings.length}`);

  const backupData = {
    timestamp: new Date().toISOString(),
    users,
    merchants,
    settings,
  };

  const backupDir = path.join(__dirname, '..', 'backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFile = path.join(backupDir, 'supabase-backup.json');
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

  console.log(`\nBerhasil diekspor ke: ${backupFile}`);
}

exportData()
  .catch((err) => {
    console.error('Error saat ekspor:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
