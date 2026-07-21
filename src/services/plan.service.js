import prisma from "../lib/prisma.js";
import AppError from "../utils/apperror.js";

export async function getPlans() {
  const plans = await prisma.plan.findMany();

  return plans.map((plan) => ({
    id: plan.id,
    planName: plan.planName,
    returnsPercent: plan.returnsPercent,
  }));
}
