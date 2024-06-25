import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    const employeeId = req.nextUrl.searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee ID is required" },
        { status: 400 }
      );
    }

    await prisma?.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        relieved: true,
      },
    });

    return NextResponse.json({ message: "Employee relieved successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error occurred" }, { status: 500 });
  }
};
