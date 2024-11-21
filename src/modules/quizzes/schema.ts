import { z } from "zod";

const quizItemSchema = z.object({
  question: z
    .string()
    .min(1, "Câu hỏi không được để trống")
    .max(255, "Câu hỏi không được quá 255 ký tự"),
  answers: z.array(
    z
      .string()
      .min(1, "Câu trả lời không được để trống")
      .max(100, "Câu trả lời không được quá 100 ký tự")
  ),
  correctAnswer: z.string(),
  explanation: z
    .string()
    .max(2000, "Giải thích không được quá 2000 ký tự")
    .nullable()
    .optional(),
  uid: z.string().optional(),
  id: z.any().optional(),
});

const quizTagSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const quizSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(100, "Tiêu đề không được quá 100 ký tự"),
  description: z
    .string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .nullable()
    .optional(),
  jlptLevel: z.string(),
  tags: z.array(quizTagSchema).nullable(),
  questions: z.array(quizItemSchema),
});

export type TQuizItem = z.infer<typeof quizItemSchema>;
export type TQuizTagItem = z.infer<typeof quizTagSchema>;
export type TQuizForm = z.infer<typeof quizSchema>;
