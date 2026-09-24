import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SIPIKEM SULUT | Sistem Informasi Pembinaan IKM Sulawesi Utara",
  description: "Portal Resmi Dinas Perindustrian dan Perdagangan Provinsi Sulawesi Utara untuk Pendataan 8 Kluster, Standardisasi Sertifikasi, dan Pembinaan IKM di 15 Kabupaten/Kota.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-sipikem-icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="overflow-x-clip">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-sky-600 selection:text-white overflow-x-clip">
        <Navbar />
        <main className="flex-grow w-full overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
