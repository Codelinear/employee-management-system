import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Asset } from "@/types";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { employee, assets } = await req.json();

    const newEmployee = await prisma.employee.create({
      data: employee,
    });

    if (assets.length > 0) {
      const assetWithOwnerId = assets.map((asset: Asset) => ({
        ...asset,
        ownerId: newEmployee.id,
      }));

      await prisma.assets.createMany({
        data: assetWithOwnerId,
      });
    }

    return NextResponse.json({ message: "Employee added successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "Employee aready exists" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  }
};
