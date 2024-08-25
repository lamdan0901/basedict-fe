"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib";
import { useEffect, useState } from "react";
import { login } from "@/service/actions";
import { createClient } from "@/utils/supabase/client";
import { useAppStore } from "@/store/useAppStore";

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

const defaultAvatarUrl = "/default-avatar.svg";

const Header = ({ user }: { user: TUser | undefined }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { clearProfile, setProfile, profile } = useAppStore();
  const [openMenu, setOpenMenu] = useState(false);

  async function signOut() {
    const client = createClient();
    const { error } = await client.auth.signOut({ scope: "local" });
    if (!error) {
      clearProfile();
      router.refresh();
    }
  }

  useEffect(() => {
    if (!profile && user) setProfile(user);
  }, [profile, setProfile, user]);

  return (
    <header className="flex w-full fixed z-10 gap-2 top-0 text-white items-center justify-end px-2 py-0.5 bg-gradient-to-r from-[#8b0000] to-[#cd5c5c]">
      {!user && (
        <form action={login}>
          <Button type="submit" variant={"secondary"} className="text-lg">
            Đăng nhập
          </Button>
        </form>
      )}

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="hover:bg-white/30 hover:text-white gap-2 text-xl size-15 px-2 py-0.5"
              variant="ghost"
            >
              <Image
                src={user.avatar || defaultAvatarUrl}
                width={50}
                height={50}
                className="rounded-full"
                alt="avatar"
              />
              <div>{user.name}</div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild className="text-xl">
              <Link href={"/profile"}>Trang cá nhân</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xl" onClick={signOut}>
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

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
    </header>
  );
};

export default Header;
