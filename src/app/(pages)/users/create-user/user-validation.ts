import { z } from "zod";

export const userSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  birthdate: z.string().min(1, "Birthdate is required"),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    postal_code: z.string().min(4),
  }),
});

export type CreateUserInput = z.infer<typeof userSchema>;
