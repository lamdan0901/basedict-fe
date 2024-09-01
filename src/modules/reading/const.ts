export enum ReadingType {
  GrammarReading = "GrammarReading",
  SumaryReading = "SumaryReading",
  MediumReading = "MediumReading",
  LongReading = "LongReading",
  CompareReading = "CompareReading",
  NoticeReading = "NoticeReading",
}

export const readingTypeMap: Record<ReadingType, string> = {
  [ReadingType.GrammarReading]: "Bài đọc ngữ pháp",
  [ReadingType.SumaryReading]: "Bài đọc ngắn",
  [ReadingType.MediumReading]: "Bài đọc trung bình",
  [ReadingType.LongReading]: "Bài đọc dài",
  [ReadingType.CompareReading]: "Bài đọc so sánh",
  [ReadingType.NoticeReading]: "Bài đọc bảng biểu",
};

export const jlptDescriptions = [
  {
    title: "1. Bài đọc ngắn (短文読解 ）",
    length: "Thường là một đoạn văn ngắn, từ 50 đến 200 từ.",
    purpose: "Kiểm tra khả năng nắm bắt ý chính và các chi tiết cụ thể.",
    level: "N5 đến N3.",
  },
  {
    title: "2. Bài đọc trung bình (中文読解)",
    length: "Khoảng 200 đến 500 từ.",
    purpose:
      "Kiểm tra khả năng hiểu và phân tích các thông tin trong đoạn văn.",
    level: "N4, N3 và N2.",
  },
  {
    title: "3. Bài đọc dài (長文読解)",
    length: "Trên 500 từ.",
    purpose:
      "Đánh giá khả năng đọc hiểu toàn diện, bao gồm việc nắm bắt các ý chính, chi tiết, và suy luận từ ngữ cảnh.",
    level: "N2 và N1.",
  },
  {
    title: "4. Bài đọc thực tế (実用的読解)",
    length: "Thường ngắn hoặc trung bình.",
    purpose:
      "Kiểm tra khả năng hiểu văn bản trong các tình huống thực tế, thường gặp trong cuộc sống hàng ngày hoặc công việc ( thông báo, email, bảng chỉ dẫn, hoặc tin nhắn)",
    level: "N5 đến N1.",
  },
  {
    title: "5. Bài đọc suy luận (推論問題)",
    length: "Trung bình hoặc dài.",
    purpose:
      "Kiểm tra khả năng phân tích, suy luận và đưa ra kết luận từ thông tin gián tiếp.",
    level: "N2 và N1.",
  },
  {
    title: "6. Bài đọc tóm tắt (要約問題）",
    length: "Thường là đoạn văn trung bình hoặc dài.",
    purpose:
      "Đánh giá khả năng tóm tắt thông tin và hiểu được ý chính của đoạn văn.",
    level: "N3, N2, và N1.",
  },
];

export enum TabVal {
  BaseDict = "BaseDict",
  JLPT = "JLPT",
}
