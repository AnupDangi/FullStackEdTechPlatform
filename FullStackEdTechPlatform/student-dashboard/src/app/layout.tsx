import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "360WorldEducation - Learn from Anywhere",
  description: "A modern learning platform for global education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-black">
        <Navbar />
        <main className="flex-grow bg-white text-black">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
