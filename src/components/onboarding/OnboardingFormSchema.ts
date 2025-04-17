
import { z } from "zod";

export const FormSchema = z.object({
  plushieTypes: z.array(z.string()).min(1, {
    message: "Please select at least one type of plushie you like.",
  }),
  plushieBrands: z.array(z.string()),
  bio: z.string().optional(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
