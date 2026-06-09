import { z } from "zod";

const requiredString = (max = 200) => z.string().trim().min(1).max(max);
const optionalString = (max = 400) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const loginSchema = z.object({
  username: z.string().trim().min(1, "required").max(120),
  password: z.string().min(1, "required").max(200),
});

// Admin only ever inputs Portuguese — slug and EN/FR are generated server-side.
export const catalogItemSchema = z.object({
  titlePt: requiredString(160),
  descriptionPt: requiredString(4000),
  materialsPt: optionalString(600),
  dimensions: optionalString(200),
  images: z.array(z.string()).default([]),
  categoryId: z.string().trim().min(1).optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});

export const projectSchema = z.object({
  titlePt: requiredString(160),
  descriptionPt: requiredString(4000),
  location: optionalString(200),
  year: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  images: z.array(z.string()).default([]),
  categoryId: z.string().trim().min(1).optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});

export const categorySchema = z.object({
  namePt: requiredString(120),
  scope: z.enum(["catalog", "project", "both"]).default("both"),
  order: z.coerce.number().int().min(0).default(0),
});

export const contactSchema = z.object({
  name: requiredString(120),
  email: z.string().trim().email().max(200),
  phone: optionalString(60),
  subject: optionalString(200),
  message: requiredString(4000),
  // honeypot — must be empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type CatalogItemInput = z.infer<typeof catalogItemSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
