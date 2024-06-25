import { NextRequest, NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import prisma from "@/lib/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const POST = async (req: NextRequest) => {
  try {
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

    // send an email using sendgrid

    // if (!process.env.SENDGRID_API_KEY) {
    //   return NextResponse.json({
    //     message: "SENDGRID_API_KEY is not set",
    //   });
    // }

    // sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

    // const msg = {
    //   to: "uzaifm127@gmail.com",
    //   from: "uzef@codelinear.com",
    //   subject: "Sending with SendGrid is Fun",
    //   text: "and easy to do anywhere, even with Node.js",
    //   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    // };

    // await sendgrid.send(msg);

    return NextResponse.json({ message: "Employee added successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "User aready exists" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
};
