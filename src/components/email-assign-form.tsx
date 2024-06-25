import React from "react";
import { Input } from "./ui/input";
import passwordGenerator from "generate-password";
import { Button } from "./ui/button";
import axios from "axios";
import { useStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const EmailAssignForm = () => {
  const { employeeDetails, changeScreen } = useStore();

  const { toast } = useToast();

  const [password, setPassword] = React.useState("password");
  const [loading, setLoading] = React.useState(false);
  const [assignedValue, setAssignedValue] = React.useState(
    employeeDetails?.firstName
  );

  const onPasswordGenerate = () => {
    const userPassword = passwordGenerator.generate({
      length: 20,
      lowercase: true,
      uppercase: true,
      symbols: true,
      excludeSimilarCharacters: true,
      numbers: true,
    });

    setPassword(userPassword);
  };

  const onAssignEmail = async () => {
    if (!employeeDetails) {
      return;
    }

    if (password === "password") {
      toast({
        variant: "destructive",
        title: "Generate a password",
        description: "You have to generate a password for corresponding email",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    try {
      const details = {
        ...employeeDetails,
        assignedEmail: `${assignedValue}@codelinear.com`,
        password,
      };

      setLoading(true);

      await axios.post("/api/employee/add", details);

      toast({
        description: "Employee added successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.response.data.message,
      });
    } finally {
      setLoading(false);
      changeScreen("details");
    }
  };

  return (
    <div>
      {loading && (
        <h2 className="absolute top-10 left-1/2 -translate-x-1/2 text-2xl animate-pulse">
          Loading...
        </h2>
      )}
      <h1 className="text-center text-4xl tracking-tighter mb-5">
        Assign an email
      </h1>
      <div className="flex border rounded-lg overflow-hidden">
        <Input
          type="text"
          disabled={loading}
          value={assignedValue}
          onChange={(e) => setAssignedValue(e.target.value)}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="raman"
        />
        <div className="border-l p-2 pointer-events-none">@codelinear.com</div>
      </div>
      <div className="flex items-center w-full border rounded-lg my-5">
        <div className="w-full text-center">{password}</div>
        <Button type="button" onClick={onPasswordGenerate} disabled={loading}>
          Generate
        </Button>
      </div>
      <Button type="button" onClick={onAssignEmail} disabled={loading}>
        Assign
      </Button>
    </div>
  );
};

export default EmailAssignForm;
