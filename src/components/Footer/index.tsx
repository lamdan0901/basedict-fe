import { menu } from "@/components/const";
import { DownloadApp } from "@/components/Footer/DownloadApp";
import { cn } from "@/lib";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <div
      className={cn("bg-[#e7e7e7] border-t sm:mt-16 mt-10 border-[#b4b4b4]")}
    >
      <div className="grid max-w-[1440px] mx-auto px-4 gap-y-6 py-6 w-full grid-flow-row-dense gap-3 md:grid-cols-12">
        <div className="col-span-4 sm:max-w-[400px]">
          <div className="flex gap-5">
            <Image
              className="object-contain size-[60px]"
              src="/images/footer-logo.png"
              priority
              alt="basedict | học tiếng nhật"
              width={60}
              height={60}
            />
            <div className="space-y-2">
              <h2 className="font-semibold text-xl">Basedict</h2>
              <p className="leading-5">
                Hiểu tiếng nhật từ nơi khởi nguồn.
                <br /> Từ điển tiếng nhật, ngữ pháp, luyện đọc
              </p>
            </div>
          </div>
          <div className="space-y-1 mt-2">
            <p className="text-xs">Mail: basedict.work@gmail.com</p>
            {/* <p className="text-xs">SDT: +84xxx-yyy-zzz</p> */}
          </div>
        </div>

        <div className="col-span-3">
          <h2 className="font-semibold text-xl">Sản phẩm </h2>
          <div className="ml-4 mt-2 grid grid-cols-2 gap-y-2 gap-x-6 w-fit ">
            {menu.map((item) => (
              <Link
                key={item.href}
                className="hover:underline"
                href={item.href}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="col-span-3">
          <h2 className="font-semibold text-xl">Về chúng tôi</h2>
          <div className="ml-4 mt-2 flex flex-col gap-2 w-fit ">
            <Link className="hover:underline" href={"/about-us"}>
              Về chúng tôi
            </Link>
            <Link className="hover:underline" href={"/policy"}>
              Chính sách bảo mật
            </Link>
            <Link
              className="hover:underline"
              href={
                "https://docs.google.com/forms/d/1MtO5RCWdGR7SX3qTSjyeKVBX_tocLc2k6s3BVr0ZlUo"
              }
              target="_blank"
            >
              Hòm thư góp ý
            </Link>
          </div>
        </div>

        <DownloadApp />
      </div>

      <div className="bg-[#616161]">
        <p className="sm:ml-auto mx-auto py-2 px-2 text-white w-fit">
          Copyright © {new Date().getFullYear()} basedict.com. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
