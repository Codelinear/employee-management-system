import { v4 as uuidv4 } from "uuid";

export const relieveReasons = [
  "Consistent Poor Performance",
  "Violation of Company Policies",
  "Negative Impact on Team Dynamics",
  "Lack of Adaptability",
  "Insubordination",
  "Chronic Absenteeism or Tardiness",
  "Other",
];

export const designations = [
  "Software Engineer",
  "Cloud Engineer",
  "Financial Analyst",
  "Accountant",
  "SEO Specialist",
  "Marketing Manager",
  "Sales Manager",
  "Recruitment Specialist",
  "Product Designer",
  "UI/UX Designer",
];

export const departments = [
  {
    id: uuidv4(),
    department: "Human Resources",
    departmentValue: "humanResources",
  },
  {
    id: uuidv4(),
    department: "Finance",
    departmentValue: "finance",
  },
  {
    id: uuidv4(),
    department: "Information Technology",
    departmentValue: "informationTechnology",
  },
  {
    id: uuidv4(),
    department: "Marketing",
    departmentValue: "marketing",
  },
  {
    id: uuidv4(),
    department: "Sales",
    departmentValue: "sales",
  },
  {
    id: uuidv4(),
    department: "Designing",
    departmentValue: "designing",
  },
];

export const experienceBandwidth = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "10+ years",
];

export const navLinkItems = [
  {
    url: "/",
    name: "Employees",
  },
  {
    url: "/add",
    name: "Add Employee",
  },
  {
    url: "/relieve",
    name: "Relieve Employee",
  },
];

export const addEmployeesInputs = [
  {
    name: "name",
    label: "Employee name",
    placeholder: "Employee name",
    type: "text",
  },
  {
    name: "employeeId",
    label: "Employee ID",
    placeholder: "Auto generated",
    type: "text",
  },
  {
    name: "companyEmail",
    label: "Company Email Address",
    placeholder: "Email Address",
    type: "email",
  },
  {
    name: "personalEmail",
    label: "Personal Email Address",
    placeholder: "Email Address",
    type: "email",
  },
  {
    name: "department",
    label: "Department",
    placeholder: "Department",
    type: "text",
  },
  {
    name: "phone",
    label: "Phone number",
    placeholder: "Phone number",
    type: "tel",
  },
  {
    name: "currentRole",
    label: "Current role",
    placeholder: "Current role",
    type: "text",
  },
  { name: "joiningDate", label: "Joining date", placeholder: "" },
];
