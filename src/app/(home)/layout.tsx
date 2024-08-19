import { ReactNode } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { TranslationPopup } from "@/components/TranslationPopup";
import { Footer } from "@/components/Footer";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex flex-col overflow-auto bg-gray-50">
      <div className="flex flex-col flex-1">
        <Header />
        <Image
          className="mt-16 mx-auto object-contain max-h-[150px] w-[417px]"
          src="/images/logo.png"
          priority
          alt="basedict | học tiếng nhật"
          width={500}
          height={500}
        />
        <main className="max-w-[1440px] flex-1 mx-auto p-4 w-full">
          <TranslationPopup>{children} </TranslationPopup>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
