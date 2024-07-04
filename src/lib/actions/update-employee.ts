"use server";

import prisma from "@/lib/prisma";
import { Asset, UpdateEmployeeForm } from "@/types";
import { revalidatePath } from "next/cache";

export const updateEmployee = async (
  employeeId: string,
  updatedEmployeeId: string,
  employeeDetails: UpdateEmployeeForm,
  assets: Asset[]
) => {
  const { name, companyEmail, personalEmail, department, phone, currentRole } =
    employeeDetails;

  // Update the employee
  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      name,
      companyEmail,
      employeeId: updatedEmployeeId,
      personalEmail,
      department,
      phone: phone.toString(),
      currentRole,
    },
  });

  // Finding and deleting the employee's assets
  await prisma.assets.deleteMany({
    where: {
      ownerId: employeeId,
    },
  });

  if (assets.length > 0) {
    // Creating ownerId for new assets
    const assetsWithOwnerId = assets.map((asset: Asset) => ({
      ...asset,
      ownerId: employeeId,
    }));

    // Creating new assets
    await prisma.assets.createMany({
      data: assetsWithOwnerId,
    });
  }

  revalidatePath("/", "page");
};
