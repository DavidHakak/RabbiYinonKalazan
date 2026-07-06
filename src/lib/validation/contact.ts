import { z } from "zod";

/** Shared contact-form schema — used by both the client form and the server action. */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;
