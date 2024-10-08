import { z } from "zod";

const flashCardItemSchema = z.object({
  frontSide: z
    .string()
    .min(1, "Từ mặt trước không được để trống")
    .max(100, "Từ mặt trước không được quá 100 ký tự"),
  backSide: z
    .string()
    .min(1, "Từ mặt sau không được để trống")
    .max(100, "Từ mặt sau không được quá 100 ký tự"),
  frontSideComment: z
    .string()
    .max(500, "Giải nghĩa không được quá 500 ký tự")
    .optional(),
  backSideComment: z
    .string()
    .max(500, "Giải nghĩa không được quá 500 ký tự")
    .optional(),
  uid: z.string().optional(),
  id: z.any().optional(),
});

const flashCardTagSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const flashCardSetSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(100, "Tiêu đề không được quá 100 ký tự"),
  description: z
    .string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  tags: z.array(flashCardTagSchema).min(1, "Cần có ít nhất 1 tag"),
  flashCards: z.array(flashCardItemSchema),
});

export type TFlashCardItem = z.infer<typeof flashCardItemSchema>;
export type TFlashCardTagItem = z.infer<typeof flashCardTagSchema>;
export type TFlashCardSetForm = z.infer<typeof flashCardSetSchema>;
