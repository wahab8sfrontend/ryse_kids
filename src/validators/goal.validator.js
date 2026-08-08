import * as zod from "zod";

export const setGoalSchema = zod
  .object({
    goalName: zod
      .string()
      .trim()
      .min(3, "Goal name must be more than 3 characters")
      .max(15, "Goal name must not be more than 15 characters"),
    currency: zod.enum(["NGN", "USD"]),
    targetAmount: zod.number().positive(),
    endDate: zod.coerce.date(),
  })
  .refine((data) => !(data.currency === "NGN" && data.targetAmount < 3000), {
    message: "Minimum NGN goal is ₦3000",
  })
  .refine((data) => !(data.currency === "USD" && data.targetAmount < 3), {
    message: "Minimum USD goal is $3",
  })
  .refine((data) => data.endDate > new Date(), {
    message: "End date must be in the future",
  });
