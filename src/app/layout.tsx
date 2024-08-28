import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Base Dict | Hiểu tiếng nhật từ nơi khởi nguồn",
  description:
    "Trang từ điển Nhật - Việt hỗ trợ dịch từ, tra cứu ngữ pháp, và luyện đọc JLPT từ N1 đến N5. Nâng cao kỹ năng tiếng Nhật của bạn với các công cụ học tập toàn diện.",
  keywords: [
    "BaseDict",
    "từ điển Nhật Việt",
    "dịch từ Nhật Việt",
    "tra cứu ngữ pháp tiếng Nhật",
    "luyện đọc JLPT",
    "học tiếng Nhật N1",
    "học tiếng Nhật N2",
    "học tiếng Nhật N3",
    "học tiếng Nhật N4",
    "học tiếng Nhật N5",
    "từ điển tiếng Nhật online",
  ],
  icons: [
    {
      url: "/favicon.ico",
      sizes: "16x16",
      type: "image/x-icon",
    },
  ],
  applicationName: "Base Dict",
  robots: "index, follow",
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
