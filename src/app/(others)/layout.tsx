import { PropsWithChildren } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContentWrapper } from "@/components/ContentWrapper";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen flex flex-col overflow-auto bg-gray-50">
      <div className="flex flex-col flex-1">
        <Header />
        <ContentWrapper className="mt-[100px]">{children}</ContentWrapper>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
