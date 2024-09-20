import { PropsWithChildren } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContentWrapper } from "@/components/ContentWrapper";
import { LogoImage } from "@/app/(home)/_components/LogoImage";

const Layout = async ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen flex flex-col overflow-auto bg-gray-50">
      <div className="flex flex-col flex-1">
        <Header />
        <LogoImage />
        <ContentWrapper>{children}</ContentWrapper>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
