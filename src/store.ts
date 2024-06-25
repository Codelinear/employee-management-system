import { create } from "zustand";
import { EmployeeDetailsForm } from "./types";
import { Employee } from "@prisma/client";

interface AppState {
  screen: "details" | "emailAssign";
  currentEmployee: Employee | null;
  employeeDetails: EmployeeDetailsForm | null;
  changeScreen: (screen: "details" | "emailAssign") => void;
  setEmployeeDetails: (employeeDetails: EmployeeDetailsForm) => void;
  setCurrentEmployee: (employee: Employee) => void;
}

export const useStore = create<AppState>((set) => ({
  screen: "details",
  currentEmployee: null,
  employeeDetails: null,
  changeScreen: (screen) => set({ screen }),
  setEmployeeDetails: (employeeDetails) => set({ employeeDetails }),
  setCurrentEmployee: (currentEmployee) => set({ currentEmployee }),
}));
