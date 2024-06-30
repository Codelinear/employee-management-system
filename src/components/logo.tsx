"use client";

import React from "react";
import Redirect from "@/components/ui/redirect";
import Link from "next/link";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Logo = () => {
  return (
    <div id="logo" className="flex flex-col items-end justify-center">
      <Link href="/">
        <h2
          className={cn(
            "text-3xl text-[#182CE3] font-bold tracking-tighter",
            inter.className
          )}
        >
          EMT
        </h2>
      </Link>
      <div
        className="flex items-center justify-center cursor-pointer hover:underline transition"
        onClick={() => window.open("https://codelinear.com/", "_blank")}
      >
        <h4 className="text-[#202020] mr-[0.2rem] text-[10px]">
          by Codelinear
        </h4>
        <Redirect />
      </div>
    </div>
  );
};

export default Logo;
