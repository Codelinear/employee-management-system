"use server";

import prisma from "@/lib/prisma";

export const getAssets = async (employeeId: string) => {
  const employees = await prisma.assets.findMany({
    where: {
      ownerId: employeeId,
    },
  });

  return employees;
};
