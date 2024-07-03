import { join } from "path";
import { z } from "zod";

export const employeeDetailsSchema = z.object({
  name: z.string(),
  employeeId: z.string(),
  personalEmail: z.string().email(),
  companyEmail: z.string().email(),
  department: z.string(),
  phone: z.number(),
  currentRole: z.string(),
  joiningDate: z.date(),
  panNumber: z.string(),
  aadhaarNumber: z.string(),
});

export const updateEmployeeSchema = z.object({
  name: z.string(),
  personalEmail: z.string().email(),
  companyEmail: z.string().email(),
  currentRole: z.string(),
  department: z.string(),
  phone: z.number(),
});

export const relieveEmployeeSchema = z.object({
  name: z.string(),
  designation: z.string(),
  department: z.string(),
  employeeId: z.string(),
  dateOfJoining: z.date(),
  contact: z.string(),
  dateOfIssuance: z.date(),
  reason: z.string(),
});

export const assetsSchema = z.object({
  assetId: z.string(),
  assetName: z.string(),
  assetType: z.string(),
  dateAssigned: z.date(),
});

export const loginSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});
