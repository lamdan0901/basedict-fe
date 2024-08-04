import { ReactNode } from "react";
import Header from "@/components/Header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <div className="grid grid-rows-[56px_1fr] flex-1">
        <Header />
        <main className="h-[calc(100vh-60px)] max-w-[1440px] p-4 mx-auto w-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
