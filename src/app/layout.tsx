import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SI-PERINDAG Kota Manado | Portal Pendaftaran & Verifikasi UMKM",
  description: "Sistem Informasi Pendataan dan Verifikasi Pelaku Usaha / UMKM Dinas Perindustrian dan Perdagangan Kota Manado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-perindag-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
