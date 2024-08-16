import { Check } from "lucide-react";
import React from "react";

export function ReadingItem() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">日本の季節</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          Đã đọc <Check className="w-4 h-4 ml-2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="bg-slate-50 rounded-full px-2 text-sm border">
          Bài đọc ngắn
        </div>
        <div className="bg-slate-50 rounded-full px-4 text-sm border">N1</div>
      </div>
      <div className="w-full h-px bg-muted-foreground"></div>
    </div>
  );
}
