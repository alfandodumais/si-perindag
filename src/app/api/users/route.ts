import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: List all users (Superadmin only)
export async function GET(req: NextRequest) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Fitur ini hanya untuk Superadmin.' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data pengguna/petugas' },
      { status: 500 }
    );
  }
}

// POST: Create new user (Superadmin only)
export async function POST(req: NextRequest) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Fitur ini hanya untuk Superadmin.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { username, name, email, password, role } = body;

    // Validation
    if (!username || !name || !password) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap, username, dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { success: false, message: 'Username minimal terdiri dari 3 karakter' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Kata sandi minimal terdiri dari 6 karakter' },
        { status: 400 }
      );
    }

    const validRole = role === 'SUPERADMIN' ? 'SUPERADMIN' : 'ADMIN';

    // Check unique username
    const existing = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Username "${cleanUsername}" sudah digunakan oleh petugas lain.` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        name: name.trim(),
        email: email ? email.trim() : null,
        password: hashedPassword,
        role: validRole,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Petugas "${newUser.name}" dengan peran ${newUser.role} berhasil didaftarkan.`,
      data: newUser,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat membuat akun petugas' },
      { status: 500 }
    );
  }
}
