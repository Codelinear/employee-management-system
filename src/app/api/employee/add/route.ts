import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  const employeeDetails = await req.json();

  const {
    firstName,
    lastName,
    email,
    dob,
    phone,
    address,
    salary,
    assets,
    assignedEmail,
    password,
    increment,
  } = employeeDetails;

  const employee = {
    firstName,
    lastName,
    email,
    dob,
    phone,
    address,
    salary,
    assets: ["laptop", "bag", "stickerss"],
    assignedEmail,
    increment,
  };

  await prisma.employee.create({
    data: employee,
  });

  // send an email using resend

  return NextResponse.json({ message: "Employee added successfully" });
};
