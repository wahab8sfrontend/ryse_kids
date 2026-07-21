/*
1. async function fundWallet(data, parentId)

2. Inside prisma.$transaction():
   a. Upsert the wallet:
      - where: parentId AND currency match
      - update: increment balance by data.amount
      - create: new wallet with parentId, currency, balance = data.amount
   
   b. Create a Transaction record:
      - walletId: the wallet's id (from the upsert result)
      - type: DEPOSIT
      - amount: data.amount
      - description: generated string e.g. "NGN wallet funded with ₦5000"

3. Return the updated wallet and the transaction record
*/

import prisma from "../lib/prisma.js";
import { TransactionType } from "@prisma/client";
import AppError from "../utils/apperror.js";

export async function fundWallet(data, parentId) {
  const newDeposit = await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.upsert({
      where: {
        parentId_currency: {
          parentId: parentId,
          currency: data.currency,
        },
      },
      update: { balance: { increment: data.amount } },
      create: {
        balance: data.amount,
        currency: data.currency,
        parentId: parentId,
      },
    });
    const newTransaction = await tx.transaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.DEPOSIT,
        amount: data.amount,
        description: `${data.currency} funded with ${data.amount}`,
      },
    });
    return {
      parentDeposit: {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
        parentId: wallet.parentId,
      },
      parentTransaction: {
        id: newTransaction.id,
        transactionDate: newTransaction.transactionDate,
        description: newTransaction.description,
        amount: newTransaction.amount,
        walletId: newTransaction.walletId,
      },
    };
  });
  return newDeposit;
}

export async function getWalletBalance(walletId, userId, userRole) {
  const id = parseInt(walletId);

  let wallet;

  if (userRole === "parent") {
    wallet = await prisma.wallet.findFirst({
      where: {
        id,
        OR: [{ parentId: userId }, { child: { parentId: userId } }],
      },
    });
  } else if (userRole === "child") {
    wallet = await prisma.wallet.findFirst({
      where: { id, childId: userId },
    });
  }

  if (!wallet) {
    throw new AppError(404, "Wallet not found, access denied!");
  }

  return {
    id: wallet.id,
    balance: wallet.balance,
    currency: wallet.currency,
  };
}

export async function getWalletTransactions(walletId, userId, userRole, query) {
  const id = parseInt(walletId);

  let wallet;

  if (userRole === "parent") {
    wallet = await prisma.wallet.findFirst({
      where: {
        id,
        OR: [{ parentId: userId }, { child: { parentId: userId } }],
      },
    });
  } else if (userRole === "child") {
    wallet = await prisma.wallet.findFirst({
      where: { id, childId: userId },
    });
  }

  if (!wallet) {
    throw new AppError(404, "Wallet not found, access denied!");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      walletId: id,
      ...(query.type && { type: query.type }),
    },
    orderBy: { transactionDate: "desc" },
  });

  return transactions.map((transaction) => ({
    id: transaction.id,
    date: transaction.transactionDate,
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
  }));
}
