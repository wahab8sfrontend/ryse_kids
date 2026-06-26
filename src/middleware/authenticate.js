import AppError from "../utils/apperror.js";
import jwt from "jsonwebtoken";

// Allows me to use fileSync in peace by resolving to the file itself not wherever Node was launched from.
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicKey = readFileSync(join(__dirname, "public.key"));

export function authenticate(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized user!" });
  }

  const userToken = req.headers.authorization.split(" ")[1];

  try {
    const decodedPayload = jwt.verify(userToken, publicKey, {
      algorithms: ["RS256"],
    });
    req.user = decodedPayload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
