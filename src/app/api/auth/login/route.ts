import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  const { username, password } = await req.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD === password
  ) {
    const hashedUsername = await bcrypt.hash(username, 10);

    return NextResponse.json({
      authenticated: true,
      username: hashedUsername,
    });
  } else {
    return NextResponse.json({
      authenticated: false,
    });
  }
};
