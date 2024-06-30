"use client";

import React from "react";
import AddEmployeeSuccessIcon from "./ui/add-employee-success-icon";
import { Button } from "./ui/button";
import { NextFont } from "next/dist/compiled/@next/font";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AddEmployeeSuccess = ({
  font,
  setAddEmployeeSuccess,
}: {
  font: NextFont;
  setAddEmployeeSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="mt-16 rounded-md border w-[26rem] py-8 flex flex-col items-center mx-auto border-[#00000033]">
      <AddEmployeeSuccessIcon />
      <h2 className="text-3xl font-medium my-8">Employee added!</h2>
      <div>
        <Button
          className={cn("bg-[#182CE3] hover:bg-[#182CE3]", font.className)}
          onClick={() => {
            setAddEmployeeSuccess(false);
          }}
        >
          Add Employee
        </Button>
        <Link href="/">
          <Button
            className={cn(
              "bg-transparent hover:bg-transparent ml-3 text-black border border-black",
              font.className
            )}
          >
            Go to Employee list
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AddEmployeeSuccess;
