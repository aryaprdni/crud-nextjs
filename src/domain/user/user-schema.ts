import { z } from "zod";

export const CreateUserSchema = z.object({
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().min(1, "Lastname is required"),
  birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid birthdate format",
  }),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    postal_code: z.string().min(4),
  }),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().min(1, "Lastname is required"),
  birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid birthdate format",
  }),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    postal_code: z.string().min(4),
  }),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
