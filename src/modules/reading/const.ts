export const jlptLevels: Record<string, TJlptLevel>[] = [
  {
    title: "N1",
    value: "N1",
  },
  {
    title: "N2",
    value: "N2",
  },
  {
    title: "N3",
    value: "N3",
  },
  {
    title: "N4",
    value: "N4",
  },
  {
    title: "N5",
    value: "N5",
  },
];

export const readingTypes = [
  {
    title: "Bài đọc ngắn",
    value: 1,
  },
  {
    title: "Bài đọc trung bình",
    value: 2,
  },
  {
    title: "Bài đọc dài",
    value: 3,
  },
  {
    title: "Bài đọc thực tế",
    value: 4,
  },
  {
    title: "Bài đọc suy luận",
    value: 5,
  },
  {
    title: "Bài đọc tóm tắt",
    value: 6,
  },
];

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

export const testPeriods = [
  { value: "1", title: "07/2010" },
  { value: "2", title: "12/2010" },
  { value: "3", title: "07/2011" },
  { value: "4", title: "12/2011" },
  { value: "5", title: "07/2012" },
  { value: "6", title: "12/2012" },
  { value: "7", title: "07/2013" },
  { value: "8", title: "12/2013" },
  { value: "9", title: "07/2014" },
  { value: "10", title: "12/2014" },
  { value: "11", title: "07/2015" },
  { value: "12", title: "12/2015" },
  { value: "13", title: "07/2016" },
  { value: "14", title: "12/2016" },
  { value: "15", title: "07/2017" },
  { value: "16", title: "12/2017" },
  { value: "17", title: "07/2018" },
  { value: "18", title: "12/2018" },
  { value: "19", title: "07/2019" },
  { value: "20", title: "12/2019" },
  { value: "21", title: "07/2020" },
  { value: "22", title: "12/2020" },
  { value: "23", title: "07/2021" },
  { value: "24", title: "12/2021" },
  { value: "25", title: "07/2022" },
  { value: "26", title: "12/2022" },
  { value: "27", title: "07/2023" },
  { value: "28", title: "12/2023" },
  { value: "29", title: "07/2024" },
];

export enum TabVal {
  BaseDict = "BaseDict",
  JLPT = "JLPT",
}
