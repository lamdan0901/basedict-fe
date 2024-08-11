"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";
import { ACCESS_TOKEN } from "@/constants";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (getCookie(ACCESS_TOKEN)) {
      setIsLogin(true);
    }
  }, []);

  return (
    <header className="flex w-full fixed z-10 top-0 text-white items-center justify-end p-4 bg-gradient-to-r from-[#8b0000] to-[#cd5c5c]">
      <div className="font-bold">
        {isLogin ? "Xin chào ABC" : "Đăng nhập Đăng kí"}
      </div>
    </header>
  );
};

export default Header;
