import { registerParentSchema } from "../validators/auth.validator.js";

export function registerParent(req, res) {
  const result = registerParentSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  } else {
    res.json({ message: "validation successful", data: result.data });
  }
}
