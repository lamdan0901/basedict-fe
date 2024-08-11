import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Base Dict | Hiểu tiếng nhật từ nơi khởi nguồn",
  description: "Base Dict | Hiểu tiếng nhật từ nơi khởi nguồn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children} <Toaster />
      </body>
    </html>
  );
}
