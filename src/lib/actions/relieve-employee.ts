"use server";

import prisma from "@/lib/prisma";

export const relieveEmployee = async (employeeId: string) => {
  await prisma.employee.update({
    where: {
      employeeId,
    },

    data: {
      relieved: true,
    },
  });

  return "Employee relieved successfully";
};
