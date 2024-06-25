import { employeeDetailsSchema } from "@/lib/validator";
import { z } from "zod";

export type EmployeeDetailsForm = z.infer<typeof employeeDetailsSchema>;
