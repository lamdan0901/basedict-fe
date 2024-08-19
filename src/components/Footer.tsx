import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <div className="bg-[#e7e7e7] border-t mt-10 sm:mt-40 border-[#b4b4b4]">
      <div className="grid max-w-[1440px] mx-auto px-4 py-6 w-full grid-flow-row-dense gap-3 lg:grid-cols-10 md:grid-cols-9">
        <div className="lg:col-span-4 md:col-span-5 sm:max-w-[400px]">
          <div className="flex gap-5">
            <Image
              className="object-contain size-[60px]"
              src="/images/app-logo.png"
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
            <p className="text-xs">SDT: +84xxx-yyy-zzz</p>
          </div>
        </div>

        <div className="lg:col-span-3 md:col-span-2">
          <h2 className="font-semibold text-xl">Sản phẩm </h2>
          <div className="ml-4 mt-2 flex flex-col gap-2 w-fit ">
            <Link className="hover:underline" href={"/"}>
              Từ điển tiếng nhật
            </Link>
            <Link className="hover:underline" href={"/reading"}>
              Luyện đọc
            </Link>
            <Link className="hover:underline" href={"/#"}>
              Ngữ pháp
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 md:col-span-2">
          <h2 className="font-semibold text-xl">Về chúng tôi</h2>
          <div className="ml-4 mt-2 flex flex-col gap-2 w-fit ">
            <Link className="hover:underline" href={"/#"}>
              Về chúng tôi
            </Link>
            <Link className="hover:underline" href={"/#"}>
              Cộng đồng
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#616161]">
        <p className="sm:ml-auto mx-auto py-2 px-2 text-white w-fit">
          Copyright © 2024 basedict.com. All rights reserved.
        </p>
      </div>
    </div>
  );
}
