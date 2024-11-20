import { PropsWithChildren } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContentWrapper } from "@/components/ContentWrapper";
import Image from "next/image";
import { DownloadAppButtons } from "@/components/DownloadAppButtons";

const Layout = async ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen flex flex-col overflow-auto bg-gray-50">
      <div className="flex flex-col flex-1">
        <Header />
        <div className="relative mb-6">
          <Image
            className="mt-16 mx-auto object-contain max-h-[150px] w-[417px]"
            src="/images/logo2.png"
            priority
            alt="basedict | học tiếng nhật"
            width={500}
            height={500}
          />
          <DownloadAppButtons />
        </div>
        <ContentWrapper>{children}</ContentWrapper>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
