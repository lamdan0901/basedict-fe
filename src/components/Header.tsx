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
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { cn } from "@/lib";
import { useEffect, useState } from "react";
import { login } from "@/service/actions";
import { client } from "@/lib/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import { DEFAULT_AVATAR_URL } from "@/constants";
import useSWR from "swr";
import { fetchUserProfile } from "@/service/user";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import { useFormStatus } from "react-dom";
import { menu } from "@/components/const";

export const Header = () => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { clearProfile, setProfile, profile } = useAppStore();
  const [openMenu, setOpenMenu] = useState(false);

  const {
    data: user,
    mutate,
    isLoading,
  } = useSWR<TUser>("get-user-profile", fetchUserProfile, {
    revalidateOnFocus: false,
  });

  async function signOut() {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (!error) {
      await mutate();
      clearProfile();
      router.refresh();
    }
  }

  useEffect(() => {
    if (user && profile?.id !== user.id) {
      setProfile(user);
      toast({
        title: "Đăng nhập thành công",
        action: <Check className="h-5 w-5 text-green-500" />,
      });
    }
  }, [profile, setProfile, user, toast]);

  return (
    <header className="flex w-full fixed z-10 gap-2 top-0 text-white items-center justify-end px-2 py-0.5 bg-gradient-to-r from-tertiary to-[#cd5c5c]">
      <Link
        className="mr-auto ml-2 sm:block hidden hover:bg-slate-300/40 transition rounded-sm px-2 py-1"
        href={"/"}
      >
        <Image
          src={"/images/header_logo.png"}
          width={68}
          height={31}
          alt="basedict-header"
        />
      </Link>

      {!user && !isLoading && (
        <form action={login}>
          <LoginButton />
        </form>
      )}

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="hover:bg-white/30 hover:text-white gap-2 text-lg sm:text-xl size-15 px-2 py-1"
              variant="ghost"
            >
              <Image
                src={user.avatar || DEFAULT_AVATAR_URL}
                width={40}
                height={40}
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
            className="hover:bg-white/30 hover:text-white gap-2 text-lg sm:text-xl p-1 h-12"
            variant="ghost"
          >
            <Image src="/apps.svg" width={45} height={45} alt="apps" />{" "}
            <span className="sm:inline hidden"> Ứng dụng</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="grid grid-cols-2 place-items-center gap-2">
            {menu.map((item) => (
              <Link
                href={
                  item.href === "/vocabulary"
                    ? `${item.href}/${user?.jlptlevel ?? "N3"}`
                    : item.href
                }
                key={item.href}
              >
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

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={"secondary"}
      disabled={pending}
      className="text-lg"
    >
      {pending ? "Đang đăng nhập..." : "Đăng nhập"}
    </Button>
  );
}
