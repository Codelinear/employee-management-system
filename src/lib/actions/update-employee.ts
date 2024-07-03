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

  // Update the employee's assets

  const currentAssets = await prisma.assets.findMany({
    where: {
      ownerId: employeeId,
    },
  });

  const createOperation = assets.length > currentAssets.length;

  if (createOperation) {
    // Create new assets
    const assetsToCreate = assets.filter(
      (asset) =>
        !currentAssets.some(
          (currentAsset) => currentAsset.assetId === asset.assetId
        )
    );

    const assetsToCreateWithOwnerId = assetsToCreate.map((asset: Asset) => ({
      ...asset,
      ownerId: employeeId,
    }));

    await prisma.assets.createMany({
      data: assetsToCreateWithOwnerId,
    });
  } else {
    // Delete existing assets

    const assetsToDelete = currentAssets.filter((currentAsset) =>
      assets.some((asset) => asset.assetId !== currentAsset.assetId)
    );

    const assetIdsToDelete = assetsToDelete.map((asset) => asset.assetId);

    await prisma.assets.deleteMany({
      where: {
        assetId: {
          in: assetIdsToDelete,
        },
      },
    });
  }

  revalidatePath("/", "page");
};
