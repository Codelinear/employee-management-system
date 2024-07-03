import {
  assetsSchema,
  employeeDetailsSchema,
  updateEmployeeSchema,
} from "@/lib/validator";
import { z } from "zod";
import { Employee } from "@prisma/client";

export type EmployeeDetailsForm = z.infer<typeof employeeDetailsSchema>;

export type AssetsForm = z.infer<typeof assetsSchema>;

export type UpdateEmployeeForm = z.infer<typeof updateEmployeeSchema>;

export interface Asset {
  assetId: string;
  assetName: string;
  assetType: string;
  dateAssigned: Date;
  ownerId?: string;
}

export interface Filters {
  departmentFilters: string[];
  experienceFilters: string[];
  roleFilters: string[];
}

export interface Department {
  humanResources: boolean;
  finance: boolean;
  informationTechnology: boolean;
  marketing: boolean;
  sales: boolean;
  customerService: boolean;
}

export interface Role {
  "Software Engineer": boolean;
  "Cloud Engineer": boolean;
  "Financial Analyst": boolean;
  Accountant: boolean;
  "SEO Specialist": boolean;
  "Marketing Manager": boolean;
  "Sales Manager": boolean;
  "Recruitment Specialist": boolean;
  "Product Designer": boolean;
  "UI/UX Designer": boolean;
}

export interface Experience {
  "Less than 1 year": boolean;
  "1-2 years": boolean;
  "3-5 years": boolean;
  "6-10 years": boolean;
  "10+ years": boolean;
}

export interface EmployeeDetails extends Employee {
  originalIndex?: number;
}
