import { redirect } from 'next/navigation';

export default function PengaturanStrukturRedirectPage() {
  redirect('/admin/pengaturan?tab=struktur');
}
