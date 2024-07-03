import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "./ui/separator";
import Cross from "./ui/cross";
import { Employee } from "@prisma/client";
import { departmentsObject, roleObject, experienceObject } from "@/constants";
import { Department, Experience, Filters, Role } from "@/types";
import {
  departments,
  designations,
  experienceBandwidth,
} from "@/constants/array";
import CheckBoxChecked from "./ui/checkbox-checked";
import CheckboxUnchecked from "./ui/checkbox-unchecked";
import { cn } from "@/lib/utils";

const FilterOverlay = ({
  setIsFilter,
  onApplyFilters,
  setFilteredEmployees,
  isRelievedChecked,
  setIsRelievedChecked,
}: {
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteredEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  setIsRelievedChecked: React.Dispatch<React.SetStateAction<boolean>>;
  isRelievedChecked: boolean;
  onApplyFilters: (filters: Filters) => void;
}) => {
  const [department, setDepartment] = useState<Department>(departmentsObject);
  const [role, setRole] = useState<Role>(roleObject);
  const [experience, setExperience] = useState<Experience>(experienceObject);

  // Filter state
  const [departmentFilters, setDepartmentFilters] = useState<string[]>([]);
  const [experienceFilters, setExperienceFilters] = useState<string[]>([]);
  const [roleFilters, setRoleFilters] = useState<string[]>([]);

  const onDepartmentFilterClick = useCallback(
    (departmentValue: string, departmentName: string, add: boolean) => {
      // Removing the other filters
      setExperience(experienceObject);
      setRole(roleObject);

      // Adding the filter
      if (add) {
        setDepartmentFilters((prev) => [...prev, departmentName]);
      } else {
        setDepartmentFilters((prev) =>
          prev.filter((item) => item !== departmentName)
        );
      }

      // changing the chip button
      setDepartment((prev) => ({
        ...prev,
        [departmentValue]: !prev[departmentValue as keyof Department],
      }));
    },
    [setDepartment]
  );

  const onExperienceFilterClick = useCallback(
    (experience: string, add: boolean) => {
      // Removing the other filters
      setDepartment(departmentsObject);
      setRole(roleObject);

      // Adding the filter
      if (add) {
        setExperienceFilters((prev) => [...prev, experience]);
      } else {
        setExperienceFilters((prev) =>
          prev.filter((item) => item !== experience)
        );
      }

      // changing the chip button
      setExperience((prev) => ({
        ...prev,
        [experience]: !prev[experience as keyof Experience],
      }));
    },
    []
  );

  const onRoleFilterClick = useCallback(
    (role: string, add: boolean) => {
      // Removing the other filters
      setDepartment(departmentsObject);
      setExperience(experienceObject);

      // Adding the filter
      if (add) {
        setRoleFilters((prev) => [...prev, role]);
      } else {
        setRoleFilters((prev) => prev.filter((item) => item !== role));
      }

      // changing the chip button
      setRole((prev) => ({
        ...prev,
        [role]: !prev[role as keyof Role],
      }));
    },
    [setRole]
  );

  const clearFilters = useCallback(() => {
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
  }, [setIsFilter, setFilteredEmployees, setIsRelievedChecked]);

  return (
    <div
      className="h-screen w-full absolute bg-transparent z-10"
      onClick={() => setIsFilter(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F7F7F7] min-h-[20rem] shadow-lg mx-14 mt-52 p-5 rounded-lg"
      >
        <div className="flex">
          <div className="w-1/3">
            <p className="text-[12px]">Filter by Department</p>
            <div className="gap-2 mt-4 flex items-center flex-wrap">
              {departments.map((element) =>
                department[element.departmentValue as keyof Department] ? (
                  <Button
                    key={element.id}
                    className="rounded-md h-auto text-white bg-[#182CE3] hover:bg-[#182CE3] flex items-center outline-none text-xs py-3 px-4"
                    onClick={() =>
                      onDepartmentFilterClick(
                        element.departmentValue,
                        element.department,
                        false
                      )
                    }
                  >
                    <Cross stroke="#fff" />
                    <span className="ml-2">{element.department}</span>
                  </Button>
                ) : (
                  <Button
                    key={element.id}
                    onClick={() =>
                      onDepartmentFilterClick(
                        element.departmentValue,
                        element.department,
                        true
                      )
                    }
                    className="rounded-md h-7 text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-xs px-3"
                  >
                    <span>{element.department}</span>
                  </Button>
                )
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="mx-6 h-3/4" />

          <div className="w-1/3">
            <p className="text-[12px]">Filter by Experience band</p>
            <div className="gap-2 mt-4 flex items-center flex-wrap">
              {experienceBandwidth.map((element) =>
                experience[element as keyof Experience] ? (
                  <Button
                    key={uuidv4()}
                    className="rounded-md h-auto text-white bg-[#182CE3] hover:bg-[#182CE3] flex items-center outline-none text-xs py-3 px-4"
                    onClick={() => onExperienceFilterClick(element, false)}
                  >
                    <Cross stroke="#fff" />
                    <span className="ml-2">{element}</span>
                  </Button>
                ) : (
                  <Button
                    key={uuidv4()}
                    onClick={() => onExperienceFilterClick(element, true)}
                    className="rounded-md h-7 text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-xs px-3"
                  >
                    <span>{element}</span>
                  </Button>
                )
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="mx-6 h-3/4" />

          <div className="w-1/3">
            <p className="text-[12px]">Filter by Role</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {designations.map((element) =>
                role[element as keyof Role] ? (
                  <Button
                    key={uuidv4()}
                    className="rounded-md h-auto text-white bg-[#182CE3] hover:bg-[#182CE3] flex items-center outline-none text-xs py-3 px-4"
                    onClick={() => onRoleFilterClick(element, false)}
                  >
                    <Cross stroke="#fff" />
                    <span className="ml-2">{element}</span>
                  </Button>
                ) : (
                  <Button
                    key={uuidv4()}
                    onClick={() => onRoleFilterClick(element, true)}
                    className="rounded-md h-7 text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-xs px-3"
                  >
                    <span>{element}</span>
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10">
          <div className="flex items-center cursor-pointer">
            {isRelievedChecked ? (
              <div onClick={() => setIsRelievedChecked(false)}>
                <CheckBoxChecked />
              </div>
            ) : (
              <div onClick={() => setIsRelievedChecked(true)}>
                <CheckboxUnchecked />
              </div>
            )}
            <p
              onClick={() => setIsRelievedChecked((prev) => !prev)}
              className="text-base ml-2 pt-px"
            >
              Show relieved employees
            </p>
          </div>
          <div>
            <Button
              type="button"
              onClick={clearFilters}
              className="text-[12px] p-3 h-9 rounded-md border text-black border-black bg-transparent hover:bg-transparent mr-5"
            >
              Clear filters
            </Button>

            <Button
              type="button"
              onClick={() =>
                onApplyFilters({
                  departmentFilters,
                  experienceFilters,
                  roleFilters,
                })
              }
              className={cn(
                "text-[12px] p-3 h-9 rounded-md",
                !departmentFilters.length
                  ? "bg-[#182CE380] hover:bg-[#182CE380]"
                  : "bg-[#182CE3] hover:bg-[#182CE3]",
                !experienceFilters.length
                  ? "bg-[#182CE380] hover:bg-[#182CE380]"
                  : "bg-[#182CE3] hover:bg-[#182CE3]",
                !roleFilters.length
                  ? "bg-[#182CE380] hover:bg-[#182CE380]"
                  : "bg-[#182CE3] hover:bg-[#182CE3]",
                !isRelievedChecked
                  ? "bg-[#182CE380] hover:bg-[#182CE380]"
                  : "bg-[#182CE3] hover:bg-[#182CE3]"
              )}
            >
              Apply filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterOverlay;
