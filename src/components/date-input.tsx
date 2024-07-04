import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const DateInput = ({
  setJoiningDays,
  setJoiningMonths,
  setJoiningYears,
  joiningDays,
  joiningMonths,
  joiningYears,
}: {
  setJoiningDays: Dispatch<SetStateAction<string>>;
  setJoiningMonths: Dispatch<SetStateAction<string>>;
  setJoiningYears: Dispatch<SetStateAction<string>>;
  joiningDays: string;
  joiningMonths: string;
  joiningYears: string;
}) => {
  return (
    <Button
      variant={"outline"}
      type="button"
      className={cn(
        "w-60 mt-2 border border-[#00000033] h-auto py-3 px-4 hover:bg-transparent cursor-auto flex items-center justify-start",
        inter.className
      )}
    >
      <input
        className="text-center mr-1 w-5 outline-none"
        onChange={(e) => {
          if (/[^0-9]/.test(e.target.value)) {
            return;
          }

          const value = parseInt(e.target.value);

          if (value > 31) {
            return;
          }

          setJoiningDays(e.target.value);
        }}
        value={joiningDays}
        maxLength={2}
        type="text"
        placeholder="D"
      />{" "}
      /{" "}
      <input
        className="text-center mx-1 w-5 outline-none"
        onChange={(e) => {
          if (/[^0-9]/.test(e.target.value)) {
            return;
          }

          const value = parseInt(e.target.value);

          if (value > 12) {
            return;
          }

          setJoiningMonths(e.target.value);
        }}
        value={joiningMonths}
        maxLength={2}
        type="text"
        placeholder="M"
      />{" "}
      /
      <input
        className="text-center ml-1 w-10 outline-none"
        onChange={(e) => {
          if (/[^0-9]/.test(e.target.value)) {
            return;
          }

          setJoiningYears(e.target.value);
        }}
        value={joiningYears}
        type="text"
        maxLength={4}
        placeholder="YYYY"
      />
    </Button>
  );
};

export default DateInput;
