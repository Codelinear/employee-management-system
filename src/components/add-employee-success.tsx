"use client";

import React from "react";
import AddEmployeeSuccessIcon from "./ui/add-employee-success-icon";
import { Button } from "./ui/button";
import { NextFont } from "next/dist/compiled/@next/font";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Asset,
  EmployeeDetailsForm,
  AssetsForm as AssetsDetailsForm,
} from "@/types";
import { UseFormReturn } from "react-hook-form";

type AssetsForm = UseFormReturn<AssetsDetailsForm, any, undefined>;

type UserDetailsForm = UseFormReturn<EmployeeDetailsForm, any, undefined>;

const AddEmployeeSuccess = ({
  font,
  setAddEmployeeSuccess,
  setAssets,
  userDetailsForm,
  assetsForm,
}: {
  font: NextFont;
  setAddEmployeeSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  userDetailsForm: UserDetailsForm;
  assetsForm: AssetsForm;
}) => {
  return (
    <div className="mt-16 rounded-md border mb-7 w-[90vw] min-[500px]:w-[26rem] py-8 flex flex-col items-center mx-5 min-[500px]:mx-auto border-[#00000033]">
      <AddEmployeeSuccessIcon />
      <h2 className="text-3xl font-medium my-8">Employee added!</h2>
      <div className="flex min-[500px]:flex-row flex-col min-[500px]:gap-x-3 gap-y-3 min-[500px]:justify-center">
        <Button
          className={cn("bg-[#182CE3] hover:bg-[#182CE3]", font.className)}
          onClick={() => {
            setAddEmployeeSuccess(false);
            userDetailsForm.reset();
            assetsForm.reset();
            setAssets([]);
          }}
        >
          Add Employee
        </Button>
        <Link href="/">
          <Button
            className={cn(
              "bg-transparent hover:bg-transparent text-black border border-black",
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
