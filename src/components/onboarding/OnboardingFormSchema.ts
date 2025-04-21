
import * as z from "zod";

export const FormSchema = z.object({
  plushieTypes: z.array(z.string()).min(0, "Please select at least one plushie type"),
  plushieBrands: z.array(z.string()),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
  age: z.number().min(16, "You must be at least 16 years old to use SoftSpot"),
  termsAccepted: z.boolean().default(false).refine(value => value === true, {
    message: "You must accept the terms of service and privacy policy",
  }),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
