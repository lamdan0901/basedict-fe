import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQueryParams } from "@/hooks/useQueryParam";
import { JLPTReadingDescModal } from "@/modules/reading/ReadingList/JLPTReadingDescModal";
import { ReadingItem } from "@/modules/reading/ReadingList/ReadingItem";

export function ReadingList() {
  // const [level, setLevel] = useState("");
  // const [readingType, setReadingType] = useState("");
  // const [hasRead, setHasRead] = useState(false);
  const [perpage, setPerpage] = useQueryParams({ value: 10, page: 1 });
  const [readingParams, setReadingParams] = useQueryParams({
    level: 1,
    readingType: 1,
    hasRead: false,
  });

  return (
    <div className=" mb-2">
      <JLPTReadingDescModal />

      <Card className="sm:w-[280px] md:w-[320px] rounded-2xl">
        <CardContent className="py-4">
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-start">
              <p className="basis-[80px] shrink-0">Cấp</p>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">N1</SelectItem>
                  <SelectItem value="banana">N2</SelectItem>
                  <SelectItem value="blueberry">N3</SelectItem>
                  <SelectItem value="grapes">N4</SelectItem>
                  <SelectItem value="pineapple">N5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-start">
              <p className="basis-[80px] shrink-0">Dạng bài</p>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Bài đọc ngắn</SelectItem>
                  <SelectItem value="banana">Bài đọc trung bình</SelectItem>
                  <SelectItem value="blueberry">Bài đọc dài</SelectItem>
                  <SelectItem value="grapes">Bài đọc thực tế</SelectItem>
                  <SelectItem value="pineaXpple">Bài đọc suy luận</SelectItem>
                  <SelectItem value="pineapSple">Bài đọc tóm tắt</SelectItem>
                  <SelectItem value="piXneapple">
                    Bài đọc đồ họa, biểu đồ
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-start">
              <p className="basis-[80px] shrink-0">Đã đọc</p>{" "}
              <Switch className="" id="airplane-mode" />
            </div>
          </div>

          <div className="w-full h-px bg-muted-foreground"></div>

          {/* TODO: click on item to scroll top  */}
          <div className="mt-4 space-y-3">
            <ReadingItem />
            <ReadingItem />
            <ReadingItem />
            <ReadingItem />
            <ReadingItem />
            <ReadingItem />
          </div>
        </CardContent>
      </Card>

      <Button
        variant={"link"}
        className="font-semibold block text-blue-500 mx-auto text-base"
        // with a loading text is Đang tải thêm...
      >
        Xem thêm
      </Button>
    </div>
  );
}
