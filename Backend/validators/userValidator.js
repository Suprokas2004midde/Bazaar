import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Please Enter the name"),
  email: z.string().email("Please enter a valid Email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 character long")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    )
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid Email"),
  password: z.string().min(8, "Please Enter the password"),
}); 

export const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid Email"),
  password: z.string().min(8, "Please Enter the password"),
}); 
    