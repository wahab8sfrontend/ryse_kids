import AppError from "../utils/apperror.js";
import prisma from "../lib/prisma.js";

import bcrypt from "bcrypt";

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

  return {
    id: newParent.id,
    firstName: newParent.firstName,
    lastName: newParent.lastName,
    username: newParent.username,
    email: newParent.email,
  };
}
