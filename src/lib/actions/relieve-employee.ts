"use server";

import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export const relieveEmployee = async (
  employeeId: string,
  html: string,
  email: string
) => {
  try {
    await prisma.employee.update({
      where: {
        employeeId,
      },

      data: {
        relieved: true,
      },
    });

    // Sending email to the employee
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL,
      to: email,
      subject: "Relieving letter",
      html,
    };

    await transporter.sendMail(mailOptions);

    return {
      message: "Employee relieved successfully",
    };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};
