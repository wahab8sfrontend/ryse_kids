/*
1. async function allocateToChild(data, parentId)

2. Inside prisma.$transaction():
   
   a. Verify child belongs to this parent
      - findFirst where childId = data.childId AND parentId = parentId
      - if not found → throw AppError(403, "...")
   
   b. Read parent's wallet
      - findFirst where parentId = parentId AND currency = data.currency
      - if not found → throw AppError(404, "You don't have a wallet in this currency")
   
   c. Check sufficient balance
      - if wallet.balance < data.amount → throw AppError(400, "Insufficient funds")
   
   d. Decrease parent wallet balance
      - update where parentId_currency composite, decrement by data.amount
   
   e. Upsert child wallet
      - where childId_currency composite
      - update: increment balance
      - create: new wallet with childId, currency, balance = data.amount
   
   f. Create parent transaction record (WITHDRAWAL)
   
   g. Create child transaction record (DEPOSIT)
   
   h. Return summary of what happened

3. return the transaction result
*/

import AppError from "../utils/apperror.js";
import prisma from "../lib/prisma.js";
import { TransactionType } from "@prisma/client";

export async function allocateToChild(data, parentId) {
  const transferFunds = await prisma.$transaction(async (tx) => {
    const getChild = await tx.child.findFirst({
      where: { id: data.childId, parentId: parentId },
    });

    if (!getChild) {
      throw new AppError(403, "You cannot send to this child!");
    }

    const parentWallet = await tx.wallet.findFirst({
      where: { parentId: parentId, currency: data.currency },
    });

    const childWallet = await tx.wallet.findFirst({
      where: { childId: data.childId, currency: data.currency },
    });

    if (!parentWallet) {
      throw new AppError(404, "You do not have a wallet in this currency");
    }

    if (parentWallet.balance < data.amount) {
      throw new AppError(400, "Insufficient funds");
    }

    const debitParentWallet = await tx.wallet.update({
      data: {
        balance: {
          decrement: data.amount,
        },
      },

      where: {
        parentId_currency: {
          parentId: parentId,
          currency: data.currency,
        },
      },
    });

    const getParent = await tx.parent.findFirst({
      where: { id: parentId },
    });

    const creditChildWallet = await tx.wallet.upsert({
      where: {
        childId_currency: {
          childId: data.childId,
          currency: data.currency,
        },
      },
      update: { balance: { increment: data.amount } },
      create: {
        balance: data.amount,
        currency: data.currency,
        childId: data.childId,
      },
    });
    const parentTx = await tx.transaction.create({
      data: {
        walletId: parentWallet.id,
        type: TransactionType.TRANSFER_OUT,
        amount: data.amount,
        description: `Transfer of ${data.amount} to ${getChild.firstName}`,
      },
    });
    const childTx = await tx.transaction.create({
      data: {
        walletId: creditChildWallet.id,
        type: TransactionType.TRANSFER_IN,
        amount: data.amount,
        description: `${data.amount} received from ${getParent.firstName}`,
      },
    });

    return {
      parentDebit: {
        id: debitParentWallet.id,
        balance: debitParentWallet.balance,
        currency: debitParentWallet.currency,
        parentId: debitParentWallet.parentId,
      },
      childCredit: {
        id: creditChildWallet.id,
        balance: creditChildWallet.balance,
        currency: creditChildWallet.currency,
        parentId: creditChildWallet.childId,
      },
      parentTx: {
        id: parentTx.id,
        transactionDate: parentTx.transactionDate,
        description: parentTx.description,
        amount: parentTx.amount,
        walletId: parentTx.walletId,
      },
      childTx: {
        id: childTx.id,
        transactionDate: childTx.transactionDate,
        description: childTx.description,
        amount: childTx.amount,
        walletId: childTx.walletId,
      },
    };
  });
  return transferFunds;
}
