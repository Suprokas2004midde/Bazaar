import { z } from 'zod';

export const addSchema = z.object({
  name: z.string().min(1, "Pls Enter A valid name"),
  description: z
    .string()
    .min(10, "Description must be 10 or more Characters")
    .max(1000, "Word limit exceeded"),
  price: z.coerce
    .number({ required_error: "Price is required" })
    .min(1, { message: "price should be more than 0 Rs." }),
  quantity: z.coerce
    .number({ required_error: "Quantity is required" })
    .min(1, { message: "Minimum 1 item is required !" }),
  // images: z.array(z.string()).min(1, "At least one image required"), //Because of these we must attach the urls, with req.body.images
  category: z.string({ required_error: "category is required" }),
  subcategory: z.string().optional(),
});
