import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function ReadingDetail() {
  return (
    <div className="w-full mb-2">
      <h1 className="text-3xl ml-6 font-bold">Luyện đọc theo cấp độ</h1>

      <Card className="relative rounded-2xl mt-4">
        <CardContent className="py-4 space-y-4">
          <div className="flex w-full justify-between">
            <h2 className="text-lg font-semibold">日本の季節</h2>
            <div className="flex gap-2">
              <div className="bg-slate-50 rounded-full px-2 text-sm border">
                Bài đọc ngắn
              </div>
              <div className="bg-slate-50 rounded-full px-4 text-sm border">
                N1
              </div>
            </div>
          </div>

          <p>
            日本にはたくさんの生活習慣があります。たとえば、家に入る前に靴を脱ぐことや、温泉に入る前に体を洗うことなどです。日本では、家の中を清潔に保つために、外で履いた靴を家の中では履きません。また、温泉に入る前に体を洗うのは、温泉の水を汚さないためです。こうした習慣は、外国人にとっては少し不思議に感じるかもしれませんが、日本では大切にされています。
          </p>

          <div className="w-full h-px bg-muted-foreground"></div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Câu hỏi</h2>
            <div>
              <span> 1. 日本では、家に入る前に何をするべきですか？</span>
              <Button
                variant={"link"}
                className="block h-fit p-0 text-blue-500"
              >
                Hiển thị đáp án / click to show answer and hide this btn
              </Button>
            </div>
            <div>
              <span> 1. 日本では、家に入る前に何をするべきですか？</span>
              <Button
                variant={"link"}
                className="block h-fit p-0 text-blue-500"
              >
                Hiển thị đáp án / click to show answer and hide this btn
              </Button>
            </div>
            <div>
              <span> 1. 日本では、家に入る前に何をするべきですか？</span>
              <Button
                variant={"link"}
                className="block h-fit p-0 text-blue-500"
              >
                Hiển thị đáp án / click to show answer and hide this btn
              </Button>
            </div>
          </div>

          <Button
            variant={"link"}
            className="text-blue-500 absolute bottom-0 right-3 p-0"
          >
            Đã đọc xong
          </Button>
          {/* <div className="flex items-center text-sm text-muted-foreground">
            Đã đọc <Check className="w-4 h-4 ml-2" />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
