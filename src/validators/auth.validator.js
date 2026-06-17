import * as zod from "zod";

export const registerParentSchema = zod.object({
  firstName: zod
    .string()
    .trim()
    .min(1, "First name is required")
    .transform((val) => {
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    }),
  lastName: zod
    .string()
    .trim()
    .min(1, "Last name is required")
    .transform((val) => {
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    }),
  username: zod
    .string()
    .trim()
    .min(1, "Username is required")
    .max(15, "Username cannot be more than 15 characters"),
  email: zod.email().trim(),
  password: zod
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      "Password must include uppercase, lowercase, number, and special character",
    ),
});
