import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PATCH: Update user (Superadmin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Fitur ini hanya untuk Superadmin.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, role, password } = body;

    const userToUpdate = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!userToUpdate) {
      return NextResponse.json(
        { success: false, message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email ? email.trim() : null;
    if (role && ['SUPERADMIN', 'ADMIN'].includes(role)) {
      // Prevent demoting self from SUPERADMIN if it's the current user
      if (params.id === session.id && role !== 'SUPERADMIN') {
        return NextResponse.json(
          { success: false, message: 'Anda tidak dapat menurunkan peran (demote) akun Anda sendiri.' },
          { status: 400 }
        );
      }
      updateData.role = role;
    }

    if (password && password.trim()) {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: 'Kata sandi baru minimal 6 karakter.' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Data petugas ${updated.name} berhasil diperbarui.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui data petugas' },
      { status: 500 }
    );
  }
}

// DELETE: Delete user (Superadmin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Fitur ini hanya untuk Superadmin.' },
        { status: 403 }
      );
    }

    // Safety: prevent self-deletion
    if (params.id === session.id) {
      return NextResponse.json(
        { success: false, message: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.' },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'Data petugas tidak ditemukan.' },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: `Akun petugas "${targetUser.name}" (@${targetUser.username}) berhasil dihapus permanen.`,
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus data petugas' },
      { status: 500 }
    );
  }
}
