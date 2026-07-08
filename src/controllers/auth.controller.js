import {
  registerParentSchema,
  loginParentSchema,
} from "../validators/auth.validator.js";
import { registerParent, loginParent } from "../services/auth.service.js";

export async function registerParentController(req, res) {
  const validationResult = registerParentSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.issues });
  }

  try {
    const newParent = await registerParent(validationResult.data);
    res.status(201).json(newParent);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function loginParentController(req, res) {
  const validationResult = loginParentSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.issues });
  }

  try {
    // Zod returns data object if successful and returns error object if not.
    const parentAccess = await loginParent(validationResult.data);
    res.status(200).json(parentAccess);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
