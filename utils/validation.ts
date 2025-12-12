import { z } from "zod";

export const contactFormSchema = z.object({
  customer_id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  address: z
    .string()
    .max(500, "Address must be less than 500 characters")
    .optional(),
  gstin: z.string().optional(),
  dl_no: z.string().optional(),
  state_code: z.string().optional(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number format"),
});

export type ContactFormValidation = z.infer<typeof contactFormSchema>;
