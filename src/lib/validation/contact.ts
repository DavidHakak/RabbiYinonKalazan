import { z } from "zod";

import { contactCategories } from "@/db/schema";
import { containsProfanity } from "@/lib/moderation/profanity";

/**
 * Shared contact/feedback schema — used by both the client form and the server
 * action. Error strings are i18n keys resolved under `contact.form.errors.*`.
 *
 * This is a low-friction feedback channel: only a name and a message are
 * required. Email and phone are optional, but validated when provided so a
 * reply is actually reachable. A bilingual profanity guard rejects abuse.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameRequired").max(120, "tooLong"),
  category: z.enum(contactCategories),
  email: z
    .string()
    .trim()
    .max(160, "tooLong")
    .email("invalidEmail")
    .or(z.literal(""))
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-\s]{6,40}$/, "invalidPhone")
    .or(z.literal(""))
    .optional(),
  message: z.string().trim().min(5, "messageRequired").max(4000, "tooLong"),
}).superRefine((data, ctx) => {
  if (containsProfanity(data.name)) {
    ctx.addIssue({ code: "custom", message: "profanity", path: ["name"] });
  }
  if (containsProfanity(data.message)) {
    ctx.addIssue({ code: "custom", message: "profanity", path: ["message"] });
  }
});

export type ContactInput = z.infer<typeof contactSchema>;
