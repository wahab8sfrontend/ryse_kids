import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.createMany({
    data: [
      { planName: "Fixed Savings", returnsPercent: 12.5 },
      { planName: "Dollar Plan", returnsPercent: 8.0 },
      { planName: "Real Estate Fund", returnsPercent: 15 },
    ],
    skipDuplicates: true,
  });

  console.log("Plans seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
