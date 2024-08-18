import { ReactNode } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import { TranslationPopup } from "@/components/TranslationPopup";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen overflow-auto bg-gray-50">
      <div className="flex-1">
        <Header />
        <Image
          className="mt-16 mx-auto object-contain max-h-[150px] w-[417px]"
          src={logo}
          priority
          alt="basedict | học tiếng nhật"
          width={500}
          height={500}
        />
        <main className="max-w-[1440px] mx-auto p-4 w-full">
          <TranslationPopup>{children} </TranslationPopup>
        </main>
      </div>
    </div>
  );
};

export default Layout;
