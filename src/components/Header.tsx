"use client";

// import { useEffect, useState } from "react";
// import { getCookie } from "@/lib/cookies";
// import { ACCESS_TOKEN } from "@/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { useState } from "react";

const menu = [
  {
    href: "/",
    icon: "/dictionary.svg",
    title: "Từ vựng",
  },
  {
    href: "/reading",
    icon: "/library.svg",
    title: "Luyện đọc",
  },
  {
    href: "/grammar",
    icon: "/local_library.svg",
    title: "Ngữ pháp",
  },
  {
    href: "/quizzes",
    icon: "/quiz.svg",
    title: "Luyện thi",
  },
];

const Header = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  // const [isLogin, setIsLogin] = useState(false);

  // useEffect(() => {
  //   if (getCookie(ACCESS_TOKEN)) {
  //     setIsLogin(true);
  //   }
  // }, []);

  return (
    <header className="flex w-full fixed z-10 gap-2 top-0 text-white items-center justify-end px-2 py-0.5 bg-gradient-to-r from-[#8b0000] to-[#cd5c5c]">
      <Popover open={openMenu} onOpenChange={setOpenMenu}>
        <PopoverTrigger asChild>
          <Button
            className="hover:bg-white/30 hover:text-white gap-2 text-xl size-15 px-2 py-0.5"
            variant="ghost"
          >
            <Image src="/apps.svg" width={50} height={50} alt="apps" />{" "}
            <span> Ứng dụng</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="grid grid-cols-2 place-items-center gap-2">
            {menu.map((item) => (
              <Link href={item.href} key={item.href}>
                <Button
                  onClick={() => setOpenMenu(false)}
                  className={cn(
                    "hover:bg-gray-300/30 py-10 text-[#444]  text-lg flex-col",
                    pathname === item.href && "bg-gray-300/30"
                  )}
                  variant="ghost"
                >
                  <Image
                    src={item.icon}
                    width={50}
                    height={50}
                    alt={item.title}
                  />
                  {item.title}
                </Button>
              </Link>
            ))}
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
