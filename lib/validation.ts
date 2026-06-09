import {z} from 'zod'

export const createLinkSchema = z.object({
    url: z.url(),
    slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Only letters, numbers, - and _ are allowed"
    )
    .optional()
    .or(z.literal("")),
    expiresAt: z.string().optional().or(z.literal(""))
})