import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const employeeName = req.nextUrl.searchParams.get("employeeName");

    if (!employeeName) {
      return NextResponse.json(
        { error: "Employee name is required" },
        { status: 400 }
      );
    }

    const employees = await prisma.employee.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: employeeName,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: employeeName,
              mode: "insensitive",
            },
          },
        ],
        relieved: true,
      },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
