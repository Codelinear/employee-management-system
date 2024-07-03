"use server";

import bcrypt from "bcryptjs";

export const authenticate = async (username: string, password: string) => {
  if (
    username === process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD === password
  ) {
    const hashedUsername = await bcrypt.hash(username, 10);

    return {
      authenticated: true,
      username: hashedUsername,
    };
  } else {
    return {
      authenticated: false,
    };
  }
};
