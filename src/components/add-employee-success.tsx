"use client";

import React from "react";
import AddEmployeeSuccessIcon from "./ui/add-employee-success-icon";
import { Button } from "./ui/button";
import { NextFont } from "next/dist/compiled/@next/font";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Asset } from "@/types";
import { UseFormReturn } from "react-hook-form";

type AssetsForm = UseFormReturn<{
  assetId: string;
  assetName: string;
  assetType: string;
  dateAssigned: Date;
}, any, undefined>

type UserDetailsForm = UseFormReturn<
  {
    name: string;
    employeeId: string;
    personalEmail: string;
    companyEmail: string;
    department: string;
    phone: number;
    currentRole: string;
    joiningDate: Date;
    panNumber: string;
    aadhaarNumber: string;
  },
  any,
  undefined
>;

const AddEmployeeSuccess = ({
  font,
  setAddEmployeeSuccess,
  setAssets,
  userDetailsForm,
  assetsForm
}: {
  font: NextFont;
  setAddEmployeeSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  userDetailsForm: UserDetailsForm;
  assetsForm: AssetsForm;
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
