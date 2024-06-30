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
  joiningDate: z.string(),
});

export const relieveEmployeeSchema = z.object({
  name: z.string(),
  designation: z.string(),
  department: z.string(),
  companyName: z.string(),
  dateOfJoining: z.date(),
  contact: z.string(),
  dateOfIssuance: z.date(),
  reason: z.string(),
});

export const loginSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});
