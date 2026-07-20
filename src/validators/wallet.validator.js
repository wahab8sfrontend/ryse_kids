import * as zod from "zod";

export const fundWalletSchema = zod
  .object({
    amount: zod.number().positive(),
    currency: zod.enum(["NGN", "USD"]),
  })
  .refine(
    (data) => {
      if (data.currency === "NGN" && data.amount < 1000) return false;
      if (data.currency === "USD" && data.amount < 1) return false;
      return true;
    },
    {
      message: "Minimum deposit is ₦1000 for NGN or $1 for USD",
    },
  );

export const allocateToChildSchema = zod
  .object({
    childId: zod.number().int().positive("child ID must be a whole number"),
    amount: zod.number().positive(),
    currency: zod.enum(["NGN", "USD"]),
  })
  .refine(
    (data) => {
      if (data.currency === "NGN" && data.amount < 500) return false;
      if (data.currency === "USD" && data.amount < 1) return false;
      return true;
    },
    {
      message: "Minimum transfer amount is ₦1000 for NGN or $1 for USD",
    },
  );

// export const getBalanceSchema = zod.object({
//   currency: zod.enum(["NGN", "USD"]),
// });
