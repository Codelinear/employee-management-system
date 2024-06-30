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
  "Senior Software Engineer",
  "Software Engineer",
  "Designer",
  "QA",
  "Software Tester",
  "DevOps",
  "Business Analyst",
  "Data Scientist",
  "Product Manager",
];

export const departments = [
  "Human Resources",
  "Finance",
  "Information Technology",
  "Marketing",
  "Sales",
  "Customer Service",
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
    name: "personalEmail",
    label: "Company Email Address",
    placeholder: "Email Address",
    type: "email",
  },
  {
    name: "companyEmail",
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
