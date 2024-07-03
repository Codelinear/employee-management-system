import { create } from "zustand";
import { EmployeeDetails, EmployeeDetailsForm } from "./types";

interface AppState {
  screen: "details" | "emailAssign";
  currentEmployee: EmployeeDetails | null;
  employeeDetails: EmployeeDetailsForm | null;
  changeScreen: (screen: "details" | "emailAssign") => void;
  setEmployeeDetails: (employeeDetails: EmployeeDetailsForm) => void;
  setCurrentEmployee: (employee: EmployeeDetails) => void;
}

export const useStore = create<AppState>((set) => ({
  screen: "details",
  currentEmployee: null,
  employeeDetails: null,
  changeScreen: (screen) => set({ screen }),
  setEmployeeDetails: (employeeDetails) => set({ employeeDetails }),
  setCurrentEmployee: (currentEmployee) => set({ currentEmployee }),
}));
