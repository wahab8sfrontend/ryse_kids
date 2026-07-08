import {
  registerChildSchema,
  loginChildSchema,
} from "../validators/auth.validator.js";
import { createChild, loginChild } from "../services/children.service.js";

export async function registerChildController(req, res) {
  const validationResult = registerChildSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.issues });
  }

  try {
    const newChild = await createChild(validationResult.data, req.user.id);
    res.status(201).json(newChild);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function loginChildController(req, res) {
  const validationResult = loginChildSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.issues });
  }

  try {
    const childAccess = await loginChild(validationResult.data);
    res.status(200).json(childAccess);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
