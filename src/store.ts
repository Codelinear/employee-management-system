import { create } from "zustand";
import { EmployeeDetails, EmployeeDetailsForm } from "./types";

interface AppState {
  screen: "details" | "emailAssign";
  isEmployeeFetching: boolean;
  currentEmployee: EmployeeDetails | null;
  employeeDetails: EmployeeDetailsForm | null;
  changeScreen: (screen: "details" | "emailAssign") => void;
  setEmployeeDetails: (employeeDetails: EmployeeDetailsForm) => void;
  setCurrentEmployee: (employee: EmployeeDetails) => void;
  setIsEmployeeFetching: (isEmployeeFetching: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  screen: "details",
  currentEmployee: null,
  isEmployeeFetching: false,
  employeeDetails: null,
  changeScreen: (screen) => set({ screen }),
  setEmployeeDetails: (employeeDetails) => set({ employeeDetails }),
  setCurrentEmployee: (currentEmployee) => set({ currentEmployee }),
  setIsEmployeeFetching: (isEmployeeFetching) => set({ isEmployeeFetching }),
}));
