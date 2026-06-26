import * as zod from "zod";

const capitalizedString = (fieldName) =>
  zod
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .transform((val) => {
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    });

export const registerParentSchema = zod.object({
  firstName: capitalizedString("First name"),
  lastName: capitalizedString("Last name"),
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

export const registerChildSchema = zod.object({
  firstName: capitalizedString("First name"),
  lastName: capitalizedString("Last name"),
  username: zod
    .string()
    .trim()
    .min(1, "Username is required")
    .max(15, "Username cannot be more than 15 characters"),
  email: zod.email().trim().optional(),
  password: zod
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      "Password must include uppercase, lowercase, number, and special character",
    ),
});

export const loginParentSchema = zod.object({
  email: zod.email().trim(),
  password: zod.string().min(1, "Password is required"),
});

export const loginChildSchema = zod.object({
  username: zod
    .string()
    .trim()
    .min(1, "Username is required")
    .max(15, "Username cannot be more than 15 characters"),
  password: zod.string().min(1, "Password is required"),
});
