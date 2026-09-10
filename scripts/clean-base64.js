const { PrismaClient } = require('@prisma/client');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function saveBase64ToDisk(base64String, prefix) {
  if (!base64String || !base64String.startsWith('data:image/')) {
    return base64String;
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const matches = base64String.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return base64String;
  }

  const rawExt = matches[1].toLowerCase();
  let ext = 'jpg';
  if (rawExt === 'png') ext = 'png';
  else if (rawExt === 'webp') ext = 'webp';

  const buffer = Buffer.from(matches[2], 'base64');
  const uniqueId = crypto.randomBytes(6).toString('hex');
  const fileName = `${prefix}-${Date.now()}-${uniqueId}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);
  console.log(`Saved physical file: ${fileName} (${Math.round(buffer.length / 1024)} KB)`);

  return `/uploads/${fileName}`;
}

async function main() {
  console.log('Checking database for merchants with base64 images...');

  const allMerchants = await prisma.merchantRegistration.findMany();
  let updatedCount = 0;

  for (const m of allMerchants) {
    let hasBase64 = false;
    let newKtp = m.ktpImage;
    let newBusiness = m.businessImage;

    if (m.ktpImage && m.ktpImage.startsWith('data:image/')) {
      hasBase64 = true;
      newKtp = await saveBase64ToDisk(m.ktpImage, 'ktp');
    }

    if (m.businessImage && m.businessImage.startsWith('data:image/')) {
      hasBase64 = true;
      newBusiness = await saveBase64ToDisk(m.businessImage, 'usaha');
    }

    if (hasBase64) {
      await prisma.merchantRegistration.update({
        where: { id: m.id },
        data: {
          ktpImage: newKtp,
          businessImage: newBusiness,
        },
      });
      console.log(`Updated merchant "${m.businessName}" (${m.registrationNo}) -> physical file URLs saved to Supabase.`);
      updatedCount++;
    }
  }

  console.log(`Migration finished. Updated ${updatedCount} records to physical file storage.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
