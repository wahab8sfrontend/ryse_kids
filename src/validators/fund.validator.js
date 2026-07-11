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
