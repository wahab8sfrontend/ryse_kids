import { fundWalletSchema } from "../validators/fund.validator.js";
import { fundWallet } from "../services/wallet.service.js";

export async function fundWalletController(req, res) {
  const validationResult = fundWalletSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.issues });
  }

  try {
    const increaseWallet = await fundWallet(validationResult.data, req.user.id);
    res.status(201).json(increaseWallet);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
