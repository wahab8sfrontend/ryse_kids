import { registerParentSchema } from "../validators/auth.validator.js";
import { registerParent } from "../services/auth.service.js";

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
