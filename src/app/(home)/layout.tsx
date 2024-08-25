import { PropsWithChildren } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { ContentWrapper } from "@/components/ContentWrapper";
import { fetchUserProfile } from "@/service/server";

const Layout = async ({ children }: PropsWithChildren) => {
  const user = await fetchUserProfile();

  return (
    <div className="h-screen flex flex-col overflow-auto bg-gray-50">
      <div className="flex flex-col flex-1">
        <Header user={user} />
        <Image
          className="mt-16 mx-auto object-contain max-h-[150px] w-[417px]"
          src="/images/logo.png"
          priority
          alt="basedict | học tiếng nhật"
          width={500}
          height={500}
        />
        <ContentWrapper>{children}</ContentWrapper>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
