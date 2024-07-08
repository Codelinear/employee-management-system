import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Asset } from "@/types";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
import passwordGenerator from "generate-password";

export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req: NextRequest) => {
  try {
    const form = await req.formData();

    const data = JSON.parse(form.get("data") as string);
    const panPhoto = form.get("panPhoto") as File;
    const aadhaarPhoto = form.get("aadhaarPhoto") as File;
    const resumePhoto = form.get("resumePhoto") as File;

    const { employee, assets } = data;

    // File uploading to the cloudinary storage
    let panPhotoUrl = "";
    let aadhaarPhotoUrl = "";

    const resumePhotoBuffer = Buffer.from(await resumePhoto.arrayBuffer());
    const resumePhotoUpload = await cloudinary.uploader.upload(
      `data:${resumePhoto.type};base64,${resumePhotoBuffer.toString("base64")}`,
      {
        public_id: "resumePhoto",
        folder: "Resumes",
        tags: "employee",
        context: {
          employeeId: employee.employeeId,
        },
      }
    );

    const resumePhotoUrl = resumePhotoUpload.secure_url;

    if (panPhoto) {
      const panPhotoBuffer = Buffer.from(await panPhoto.arrayBuffer());
      const panPhotoUpload = await cloudinary.uploader.upload(
        `data:${panPhoto.type};base64,${panPhotoBuffer.toString("base64")}`,
        {
          folder: "Pan Cards",
          tags: "employee",
          context: {
            employeeId: employee.employeeId,
          },
        }
      );
      panPhotoUrl = panPhotoUpload.secure_url;
    }

    if (aadhaarPhoto) {
      const aadhaarPhotoBuffer = Buffer.from(await aadhaarPhoto.arrayBuffer());
      const aadhaarPhotoUpload = await cloudinary.uploader.upload(
        `data:${aadhaarPhoto.type};base64,${aadhaarPhotoBuffer.toString(
          "base64"
        )}`,
        {
          public_id: "aadhaarPhoto",
          folder: "Aadhaar Cards",
          tags: "employee",
          context: {
            employeeId: employee.employeeId,
          },
        }
      );
      aadhaarPhotoUrl = aadhaarPhotoUpload.secure_url;
    }

    // Database queries
    const newEmployee = await prisma.employee.create({
      data: {
        ...employee,
        panPhotoUrl,
        aadhaarPhotoUrl,
        resumePhotoUrl,
      },
    });

    // Checking if assets exist
    if (assets.length > 0) {
      const assetWithOwnerId = assets.map((asset: Asset) => ({
        ...asset,
        ownerId: newEmployee.id,
      }));

      await prisma.assets.createMany({
        data: assetWithOwnerId,
      });
    }

    // Sending email to the employee
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const password = passwordGenerator.generate({
      length: 18,
      numbers: true,
      lowercase: true,
      uppercase: true,
      symbols: true,
    });

    const mailOptions = {
      from: process.env.GMAIL,
      to: employee.personalEmail,
      subject: "Welcome Aboard!",
      html: `
              <div style={{font-size: "1.25rem"}}>
                <p>
                  Hi ${employee.name}, We are pleased to share the offer letter for the position of
                  &quot;${employee.currentRole}&quot;.
                </p>
                <p>
                  On behalf of the entire Codelinear team, I would like to take this
                  opportunity to welcome you as a new team member. We are thrilled to have
                  you with us. Welcome Aboard!
                </p>
                <p>
                  About work, you&apos;ll be directly reporting to Mr. Muheeb Syed Saif.
                  We have created your official email account for further internal
                  communication. Here are the credentials:
                </p>
                <p>email: ${employee.companyEmail}</p>
                <p >Password: ${password}</p>
                <p>We wish you all the best!</p>
                <p>Regards</p>
                <p>HR Team</p>
                <p>Codelinear Software Solutions Pvt Ltd</p>
                <p>Ph: +1 415 523 5957</p>
              </div>
            `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Employee added successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "Employee already exists" },
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
