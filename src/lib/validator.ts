import { z } from "zod";

export const employeeDetailsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  assignedEmail: z.string().email().optional(),
  phone: z.number(),
  dob: z.date(),
  relieved: z.boolean().optional(),
  address: z.string(),
  salary: z.number(),
  // assets: z.array(z.string()),
  assets: z.string(),
  increment: z.number().optional(),
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
