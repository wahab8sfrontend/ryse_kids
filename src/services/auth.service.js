// Allows me to use fileSync in peace by resolving to the file itself not wherever Node was launched from.
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import AppError from "../utils/apperror.js";
import prisma from "../lib/prisma.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __dirname = dirname(fileURLToPath(import.meta.url));
const privateKey = readFileSync(join(__dirname, "private.key"));

export async function registerParent(data) {
  const existingParent = await prisma.parent.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingParent) {
    throw new AppError(
      409,
      "A parent with this email or username already exists!",
    );
  }

  const hashedParentPassword = await bcrypt.hash(data.password, 10);

  const newParent = await prisma.parent.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      passwordHash: hashedParentPassword,
    },
  });

  const registrationJwtToken = jwt.sign(
    { id: newParent.id, role: "parent" },
    privateKey,
    {
      expiresIn: "7d",
      algorithm: "RS256",
    },
  );

  return {
    registrationJwtToken,
    parent: {
      id: newParent.id,
      firstName: newParent.firstName,
      lastName: newParent.lastName,
      username: newParent.username,
      email: newParent.email,
    },
  };
}

export async function loginParent(data) {
  const existingParent = await prisma.parent.findUnique({
    where: { email: data.email },
  });

  if (!existingParent) {
    throw new AppError(401, "Invalid email or password");
  }

  const compareUserPassword = await bcrypt.compare(
    data.password,
    existingParent.passwordHash,
  );

  if (!compareUserPassword) {
    throw new AppError(401, "Invalid email or password");
  }

  const loginJwtToken = jwt.sign(
    { id: existingParent.id, role: "parent" },
    privateKey,
    {
      expiresIn: "7d",
      algorithm: "RS256",
    },
  );

  return {
    loginJwtToken,
    parent: {
      id: existingParent.id,
      firstName: existingParent.firstName,
      lastName: existingParent.lastName,
      username: existingParent.username,
      email: existingParent.email,
    },
  };
}
