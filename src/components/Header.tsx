"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";
import { ACCESS_TOKEN } from "@/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (getCookie(ACCESS_TOKEN)) {
      setIsLogin(true);
    }
  }, []);

  return (
    <header className="flex w-full fixed z-10 gap-2 top-0 text-white items-center justify-end px-2 py-0.5 bg-gradient-to-r from-[#8b0000] to-[#cd5c5c]">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="hover:bg-white/30 hover:text-white rounded-full gap-2 text-xl size-15 px-2 py-0.5"
            variant="ghost"
          >
            <Image src="/apps.svg" width={50} height={50} alt="apps" />{" "}
            <span> Ứng dụng</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex gap-4">
            <Link href={"/"}>
              <Button
                className="hover:bg-gray-300/30 py-10 text-[#444] text-lg flex-col"
                variant="ghost"
              >
                <Image
                  src="/dictionary.svg"
                  width={50}
                  height={50}
                  alt="japanese dictionary"
                />
                Từ vựng
              </Button>
            </Link>
            <Link href={"/reading"}>
              <Button
                className="hover:bg-gray-300/30 py-10 text-[#444]  text-lg flex-col"
                variant="ghost"
              >
                <Image
                  src="/library.svg"
                  width={50}
                  height={50}
                  alt="readings learn"
                />
                Luyện đọc
              </Button>{" "}
            </Link>
          </div>
        </PopoverContent>
      </Popover>
      {/* <div className="font-bold">
        {isLogin ? "Xin chào ABC" : "Đăng nhập Đăng kí"}
      </div> */}
    </header>
  );
};

export default Header;
