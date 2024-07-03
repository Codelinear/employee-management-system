import { EmployeeDetails } from "@/types";
import { differenceInYears, parse } from "date-fns";

const getEmployedYears = (joiningDate: string) => {
  const givenDate = parse(joiningDate, "dd / MM / yyyy", new Date());

  const employedYears = differenceInYears(new Date(), givenDate);

  return employedYears;
};

export const filterByExperience = (
  experienceFilters: string[],
  employees: EmployeeDetails[]
) => {
  let totalFilteredEmployees: Array<EmployeeDetails> = [];

  if (experienceFilters.includes("Less than 1 year")) {
    const filteredEmployees = employees.filter((element) => {
      const employedYears = getEmployedYears(element.joiningDate);

      return employedYears < 1;
    });

    totalFilteredEmployees = [...totalFilteredEmployees, ...filteredEmployees];
  }

  if (experienceFilters.includes("1-2 years")) {
    const filteredEmployees = employees.filter((element) => {
      const employedYears = getEmployedYears(element.joiningDate);

      return employedYears >= 1 && employedYears < 3;
    });

    totalFilteredEmployees = [...totalFilteredEmployees, ...filteredEmployees];
  }

  if (experienceFilters.includes("3-5 years")) {
    const filteredEmployees = employees.filter((element) => {
      const employedYears = getEmployedYears(element.joiningDate);

      return employedYears >= 3 && employedYears < 6;
    });

    totalFilteredEmployees = [...totalFilteredEmployees, ...filteredEmployees];
  }

  if (experienceFilters.includes("6-10 years")) {
    const filteredEmployees = employees.filter((element) => {
      const employedYears = getEmployedYears(element.joiningDate);

      return employedYears >= 6 && employedYears < 11;
    });

    totalFilteredEmployees = [...totalFilteredEmployees, ...filteredEmployees];
  }

  if (experienceFilters.includes("10+ years")) {
    const filteredEmployees = employees.filter((element) => {
      const employedYears = getEmployedYears(element.joiningDate);

      return employedYears > 10;
    });

    totalFilteredEmployees = [...totalFilteredEmployees, ...filteredEmployees];
  }

  return totalFilteredEmployees;
};
