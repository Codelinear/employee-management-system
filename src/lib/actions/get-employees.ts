"use server";

import prisma from "@/lib/prisma";

export const getEmployees = async () => {
  const employees = await prisma.employee.findMany({});

  return employees;
};
