
import { z } from "zod";

export const FormSchema = z.object({
  plushieTypes: z.array(z.string()).optional().default([]),
  plushieBrands: z.array(z.string()).optional().default([]),
  bio: z.string().max(160, {
    message: "Bio must be 160 characters or less",
  }).optional(),
  profilePicture: z.string().optional(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
