import { z } from "zod";

const flashCardItemSchema = z.object({
  frontSide: z.string().min(1, "Từ mặt trước không được để trống"),
  backSide: z.string().min(1, "Từ mặt sau không được để trống"),
  frontSideComment: z.string().optional(),
  backSideComment: z.string().optional(),
  uid: z.string().optional(),
  id: z.any().optional(),
});

export const flashCardSetSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  flashCards: z.array(flashCardItemSchema),
});

export type TFlashCardItem = z.infer<typeof flashCardItemSchema>;
export type TFlashCardSetForm = z.infer<typeof flashCardSetSchema>;
