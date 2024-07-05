"use client";

import React from "react";
import AddEmployeeSuccessIcon from "./ui/add-employee-success-icon";
import { Button } from "./ui/button";
import { NextFont } from "next/dist/compiled/@next/font";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { departmentsObject, roleObject, experienceObject } from "@/constants";
import SearchNotFoundIcon from "@/components/ui/search-not-found-icon";
import type { Department, EmployeeDetails, Experience, Role } from "@/types";

const SearchNotFound = ({
  font,
  setDepartment,
  setRole,
  setIsFilter,
  setExperience,
  setDepartmentFilters,
  setExperienceFilters,
  setRoleFilters,
  setSearchNotFound,
  setFilteredEmployees,
  setIsRelievedChecked,
}: {
  font: NextFont;
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchNotFound: React.Dispatch<React.SetStateAction<boolean>>;
  setDepartment: React.Dispatch<React.SetStateAction<Department>>;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
  setExperience: React.Dispatch<React.SetStateAction<Experience>>;
  setDepartmentFilters: React.Dispatch<React.SetStateAction<string[]>>;
  setExperienceFilters: React.Dispatch<React.SetStateAction<string[]>>;
  setRoleFilters: React.Dispatch<React.SetStateAction<string[]>>;
  setFilteredEmployees: React.Dispatch<React.SetStateAction<EmployeeDetails[]>>;
  setIsRelievedChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="mt-16 mb-7 sm:mb-24 sm:w-[32rem] rounded-md border py-12 px-7 sm:px-20 flex flex-col items-center mx-auto border-[#00000033]">
      <SearchNotFoundIcon />
      <h2 className="text-[1.4rem] mt-4 mb-2 font-semibold text-center">
        Employee not found
      </h2>
      <p className={cn("mb-8 text-sm text-center", font.className)}>
        Looks like this employee details are not present. Would you like to add
        this employee?
      </p>
      <div className="flex sm:flex-row flex-col sm:gap-x-3 gap-y-3 sm:justify-center">
        <Link href="/add">
          <Button className="bg-[#182CE3] w-32 hover:bg-[#182CE3] text-[12px] px-6 py-3 h-auto rounded-lg">
            Add Employee
          </Button>
        </Link>

        <Button
          onClick={() => {
            // Clearing the filters
            setDepartmentFilters([]);
            setExperienceFilters([]);
            setRoleFilters([]);
            setIsRelievedChecked(false);
            setFilteredEmployees([]);

            // Clearing the filter objects boolean
            setDepartment(departmentsObject);
            setExperience(experienceObject);
            setRole(roleObject);

            // Closing the filter overlay
            setIsFilter(false);
            setSearchNotFound(false);
          }}
          className="text-[12px] w-32 px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent"
        >
          Go back
        </Button>
      </div>
    </div>
  );
};

export default SearchNotFound;
