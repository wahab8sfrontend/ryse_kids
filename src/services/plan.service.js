import prisma from "../lib/prisma.js";
import AppError from "../utils/apperror.js";
import { TransactionType } from "@prisma/client";

export async function getPlans() {
  const plans = await prisma.plan.findMany();

  return plans.map((plan) => ({
    id: plan.id,
    planName: plan.planName,
    returnsPercent: plan.returnsPercent,
  }));
}

/*
1. Check if the plan exist using findFirst
*/

export async function createInvestment(data, childId) {
  const plan = await prisma.plan.findFirst({
    where: { id: data.planId },
  });

  if (!plan) {
    throw new AppError(404, "Plan not found");
  }

  const wallet = await prisma.wallet.findFirst({
    where: { childId: childId, currency: data.currency },
  });

  if (!wallet) {
    throw new AppError(404, "You do not have a wallet in this currency");
  }

  if (data.goalId) {
    const goal = await prisma.goal.findFirst({
      where: { childId: childId, id: data.goalId },
    });

    if (!goal) {
      throw new AppError(404, "Goal not found or does not belong to you");
    }
  }

  if (wallet.balance < data.amount) {
    throw new AppError(400, "Insufficient funds");
  }

  const child = await prisma.child.findUnique({
    where: { id: childId },
  });
  const parentId = child.parentId;

  const newInvestment = await prisma.$transaction(async (tx) => {
    const debitChildWallet = await tx.wallet.update({
      data: {
        balance: {
          decrement: data.amount,
        },
      },

      where: {
        childId_currency: {
          childId: childId,
          currency: data.currency,
        },
      },
    });

    const investment = await tx.investment.create({
      data: {
        amount: data.amount,
        childId: childId,
        parentId: parentId,
        planId: data.planId,
        goalId: data.goalId,
      },
      include: { plan: true },
    });

    const transaction = await tx.transaction.create({
      data: {
        amount: data.amount,
        planId: data.planId,
        childId: childId,
        walletId: wallet.id,
        type: TransactionType.INVESTMENT,
        description: `Investment of ${data.amount} to ${plan.planName}`,
      },
    });

    return {
      wallet: {
        id: debitChildWallet.id,
        balance: debitChildWallet.balance,
        currency: debitChildWallet.currency,
      },

      transaction: {
        walletId: transaction.walletId,
        childId: transaction.childId,
        planId: transaction.planId,
        amount: transaction.amount,
        description: transaction.description,
      },

      investment: {
        amount: investment.amount,
        childId: investment.childId,
        planId: investment.planId,
        goalId: investment.goalId,
        plan: {
          planName: investment.plan.planName,
          returnsPercent: investment.plan.returnsPercent,
        },
      },
    };
  });
  return newInvestment;
}
