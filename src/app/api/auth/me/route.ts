import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSessionUser, signToken, COOKIE_NAME } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json(
      { success: false, user: null },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
    }
  });

  if (!user) {
    return NextResponse.json(
      { success: false, user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Sesi telah berakhir, silakan login kembali' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, username, email, password } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap wajib diisi' },
        { status: 400 }
      );
    }

    if (!username || !username.trim()) {
      return NextResponse.json(
        { success: false, message: 'Username wajib diisi' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { success: false, message: 'Username minimal 3 karakter' },
        { status: 400 }
      );
    }

    // Check if username is used by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: cleanUsername,
        NOT: { id: session.id }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: `Username "${cleanUsername}" sudah digunakan oleh akun lain.` },
        { status: 400 }
      );
    }

    const updateData: any = {
      name: name.trim(),
      username: cleanUsername,
      email: email ? email.trim() : null,
    };

    if (password && password.trim()) {
      if (password.trim().length < 6) {
        return NextResponse.json(
          { success: false, message: 'Kata sandi baru minimal 6 karakter' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
      }
    });

    // Re-sign token so session cookie matches updated info
    const token = signToken({
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      user: updatedUser,
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat memperbarui profil' },
      { status: 500 }
    );
  }
}

