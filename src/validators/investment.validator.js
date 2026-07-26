import * as zod from "zod";

export const investSchema = zod
  .object({
    planId: zod.number().int().positive(),
    amount: zod.number().positive(),
    currency: zod.enum(["NGN", "USD"]),
    goalId: zod.number().int().positive().optional(),
  })
  .refine(
    (data) => {
      if (data.currency === "NGN" && data.amount < 500) return false;
      if (data.currency === "USD" && data.amount < 1) return false;
      return true;
    },
    {
      message: "minimum investment amount is $1 or ₦500",
    },
  );
