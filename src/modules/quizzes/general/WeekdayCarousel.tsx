import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BadgeCheck, Check, Star, X } from "lucide-react";

export function WeekdayCarousel() {
  return (
    <>
      <p className="text-gray-800 my-3 text-sm">
        Mùa 1: 2024/7/14 ~ 2024/11/24
      </p>
      <div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full border-y-[1px] max-w-2xl"
        >
          <CarouselContent>
            <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
              <Card className="bg-lime-200">
                <CardContent className="flex flex-col  aspect-[3/4] items-center justify-center p-2">
                  <BadgeCheck className="size-10 text-lime-700  mb-2 bg-white rounded-full p-1" />
                  <div className=" text-sm font-semibold">Thứ 2</div>
                  <div className=" text-sm">26/8</div>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
              <Card className="">
                <CardContent className="flex flex-col  aspect-[3/4] items-center justify-center p-2">
                  <X className="size-10  mb-2 bg-muted rounded-full p-1" />
                  <div className=" text-sm font-semibold">Thứ 3</div>
                  <div className=" text-sm">27/8</div>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
              <Card className="bg-yellow-100">
                <CardContent className="flex flex-col  aspect-[3/4] items-center justify-center p-2">
                  <Check className="size-10  mb-2 bg-white rounded-full p-1" />
                  <div className=" text-sm font-semibold">Thứ 3</div>
                  <div className=" text-sm">27/8</div>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="sm:basis-1/4 my-3 basis-1/3 relative md:basis-1/5 lg:basis-[14.25%]">
              <Card>
                <CardContent className="flex flex-col aspect-[3/4] items-center justify-center p-2">
                  <Check className="size-10  mb-2 bg-muted rounded-full p-1" />
                  <div className=" text-sm font-semibold">Thứ 7</div>
                  <div className=" text-sm">27/8</div>
                  <div className="absolute text-sm -top-2 size-7 py-1 text-center -right-2 rounded-full text-white bg-destructive">
                    2X
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
              <Card className="">
                <CardContent className="flex flex-col  aspect-[3/4] items-center justify-center p-2">
                  <Star className="size-10  mb-2 bg-lime-700 text-white rounded-full p-1" />
                  <div className=" text-sm font-semibold">Chủ nhật</div>
                  <div className=" text-sm">27/8</div>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
              <Card className="bg-destructive">
                <CardContent className="flex flex-col  text-white aspect-[3/4] items-center justify-center p-2">
                  <Star className="size-10 bg-yellow-300 rounded-full p-1 mb-2" />
                  <div className=" text-sm font-semibold">Lên hạng</div>
                </CardContent>
              </Card>
            </CarouselItem>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]"
              >
                <Card>
                  <CardContent className="flex aspect-[3/4] items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <p className="text-gray-800 w-fit mx-auto my-3 text-sm">
        Bạn đã hoàn thành 12/13 bài thi daily
      </p>
    </>
  );
}
