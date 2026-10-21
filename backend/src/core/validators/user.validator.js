import { z } from "zod";

export const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/;

export const userNameSchema = z
  .string({ required_error: "الاسم مطلوب" })
  .trim()
  .min(3, "يجب أن يتكون الاسم من 3 أحرف على الأقل")
  .max(70, "يجب ألا يتجاوز الاسم 70 حرفاً")
  .regex(NAME_REGEX, "يجب أن يحتوي الاسم على أحرف عربية أو إنجليزية ومسافات فقط بدون أرقام أو رموز");
