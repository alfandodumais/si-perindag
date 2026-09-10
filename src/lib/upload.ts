import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/**
 * Ensures the physical upload directory exists in public/uploads
 */
export async function getUploadDir(): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

/**
 * Saves a base64 string or file buffer as a physical file on disk.
 * Returns the public URL path (e.g., '/uploads/ktp-1725...jpg') to store in the database.
 */
export async function saveBase64AsPhysicalFile(
  base64String: string | null | undefined,
  prefix: string = 'img'
): Promise<string | null> {
  if (!base64String) return null;

  // If it's already an existing file path or web URL, keep it as-is
  if (!base64String.startsWith('data:image/')) {
    return base64String;
  }

  try {
    const uploadDir = await getUploadDir();

    // Parse mime type and extension
    const matches = base64String.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64String; // Return as-is if parsing fails
    }

    const rawExt = matches[1].toLowerCase();
    let ext = 'jpg';
    if (rawExt === 'png') ext = 'png';
    else if (rawExt === 'webp') ext = 'webp';
    else if (rawExt === 'jpeg' || rawExt === 'jpg') ext = 'jpg';

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique random filename
    const uniqueId = crypto.randomBytes(6).toString('hex');
    const fileName = `${prefix}-${Date.now()}-${uniqueId}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    // Return the clean public URL path
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error saving physical file from base64:', error);
    return base64String;
  }
}

/**
 * Saves a File / Buffer directly from multipart/form-data to physical disk.
 */
export async function saveBufferAsPhysicalFile(
  buffer: Buffer,
  originalFilename: string,
  prefix: string = 'doc'
): Promise<string> {
  const uploadDir = await getUploadDir();

  const parsedExt = path.extname(originalFilename).toLowerCase().replace('.', '') || 'jpg';
  const ext = ['jpg', 'jpeg', 'png', 'webp'].includes(parsedExt) ? parsedExt : 'jpg';

  const uniqueId = crypto.randomBytes(6).toString('hex');
  const fileName = `${prefix}-${Date.now()}-${uniqueId}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}
