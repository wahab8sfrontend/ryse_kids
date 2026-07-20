import {
  fundWalletSchema,
  allocateToChildSchema,
} from "../validators/wallet.validator.js";
import { fundWallet, getWalletBalance } from "../services/wallet.service.js";
import { allocateToChild } from "../services/allocate.js";

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

export async function transferFundController(req, res) {
  const validationResult = allocateToChildSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.issues });
  }

  try {
    const transferToChild = await allocateToChild(
      validationResult.data,
      req.user.id,
    );
    res.status(200).json(transferToChild);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getWalletController(req, res) {
  if (!req.params.id) {
    return res.status(400).json({ error: "Bad request" });
  }

  try {
    const getBalance = await getWalletBalance(
      req.params.id,
      req.user.id,
      req.user.role,
    );
    res.status(200).json(getBalance);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
