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

export async function createChild(data, parentId) {
  const existingChild = await prisma.child.findFirst({
    where: { username: data.username, parentId: parentId },
  });

  if (existingChild) {
    throw new AppError(
      409,
      "A child with this email or username already exists!",
    );
  }

  const hashedChildPassword = await bcrypt.hash(data.password, 10);

  const newChild = await prisma.child.create({
    data: {
      parentId: parentId,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      passwordHash: hashedChildPassword,
    },
  });

  return {
    child: {
      id: newChild.id,
      firstName: newChild.firstName,
      lastName: newChild.lastName,
      username: newChild.username,
      email: newChild.email,
    },
  };
}

export async function loginChild(data) {
  const existingChild = await prisma.child.findUnique({
    where: { username: data.username },
  });

  if (!existingChild) {
    throw new AppError(401, "Invalid email or password");
  }

  const compareUserPassword = await bcrypt.compare(
    data.password,
    existingChild.passwordHash,
  );

  if (!compareUserPassword) {
    throw new AppError(401, "Invalid email or password");
  }

  const loginJwtToken = jwt.sign(
    { id: existingChild.id, role: "child" },
    privateKey,
    {
      expiresIn: "7d",
      algorithm: "RS256",
    },
  );

  return {
    loginJwtToken,
    child: {
      id: existingChild.id,
      firstName: existingChild.firstName,
      lastName: existingChild.lastName,
      username: existingChild.username,
      email: existingChild.email,
    },
  };
}
