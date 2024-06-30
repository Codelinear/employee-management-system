import { employeeDetailsSchema } from "@/lib/validator";
import { z } from "zod";

export type EmployeeDetailsForm = z.infer<typeof employeeDetailsSchema>;

export type AddEmployeeInputName =
  | "name"
  | "employeeId"
  | "personalEmail"
  | "companyEmail"
  | "department"
  | "phone"
  | "currentRole"
  | "joiningDate";

export interface Asset {
  assetId: string;
  assetName: string;
  assetType: string;
  dateAssigned: Date;
  ownerId?: string;
}
