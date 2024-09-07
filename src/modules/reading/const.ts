export enum ReadingType {
  All = "all",
  GrammarReading = "GrammarReading",
  SumaryReading = "SumaryReading",
  MediumReading = "MediumReading",
  LongReading = "LongReading",
  CompareReading = "CompareReading",
  NoticeReaing = "NoticeReaing",
}

export const readingTypeMap: Record<ReadingType, string> = {
  [ReadingType.All]: "Tất cả",
  [ReadingType.GrammarReading]: "Bài đọc ngữ pháp",
  [ReadingType.SumaryReading]: "Bài đọc ngắn",
  [ReadingType.MediumReading]: "Bài đọc trung bình",
  [ReadingType.LongReading]: "Bài đọc dài",
  [ReadingType.CompareReading]: "Bài đọc so sánh",
  [ReadingType.NoticeReaing]: "Bài đọc bảng biểu",
};

export const jlptDescriptions = [
  {
    title: "1. Grammar Reading (Bài đọc ngữ pháp)",
    length: "Thường là một đoạn văn trung bình, từ 200 đến 500 từ.",
    purpose:
      "Bài đọc tập trung vào cấu trúc ngữ pháp, giúp kiểm tra khả năng hiểu và áp dụng ngữ pháp trong văn bản.",
    level: "N3, N2, N1",
  },
  {
    title: "2. Summary Reading (Bài đọc ngắn)",
    length: "Thường là một đoạn văn ngắn, từ 150 đến 200 từ.",
    purpose:
      "Bài đọc yêu cầu thí sinh nắm bắt ý chính và nội dung bài viết, đánh giá khả năng tóm tắt thông tin.",
    level: "N3, N2, N1",
  },
  {
    title: "3. Medium Reading (Bài đọc trung bình)",
    length: "Khoảng 200 đến 500 từ.",
    purpose:
      "Đoạn văn có độ dài trung bình với nội dung phức tạp, kiểm tra khả năng hiểu ngữ pháp và từ vựng trong văn bản dài hơn.",
    level: "N3, N2, N1",
  },
  {
    title: "4. Long Reading (Bài đọc dài)",
    length: "Trên 500 từ.",
    purpose:
      "Đánh giá khả năng đọc hiểu toàn diện, bao gồm việc nắm bắt các ý chính, chi tiết, và suy luận từ ngữ cảnh.",
    level: "N3, N2, N1",
  },
  {
    title: "5. Compare Reading (Bài đọc so sánh)",
    length: "Thường tương đương bài đọc ngắn.",
    purpose:
      "Bài đọc so sánh nội dung giữa các văn bản, giúp đánh giá khả năng phân tích và đối chiếu thông tin.",
    level: "N2, N1",
  },
  {
    title: "6. Notice Reading (Bài đọc thông báo, bảng biểu)",
    length: "Trung bình hoặc dài.",
    purpose:
      "Đọc hiểu các thông báo hoặc bảng biểu ngắn, mang tính chất thông báo, kiểm tra khả năng tiếp nhận thông tin mà văn bản truyền đạt một cách nhanh chóng.",
    level: "N3, N2, N1",
  },
];

export enum TabVal {
  BaseDict = "BaseDict",
  JLPT = "JLPT",
}
