"use client";

import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { employeeDetailsSchema } from "@/lib/validator";
import { EmployeeDetailsForm as EmployeeDetails } from "@/types";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { useStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], weight: "400" });

const EmployeeDetailsForm = () => {
  const { changeScreen, setEmployeeDetails } = useStore();

  const { toast } = useToast();

  const userDetailsForm = useForm<EmployeeDetails>({
    // resolver: zodResolver(employeeDetailsSchema),
    // mode: "onSubmit",
  });

  const onSubmit = useCallback(
    (values: EmployeeDetails) => {
      if (!values.dob) {
        toast({
          variant: "destructive",
          title: "Date of Birth is required",
        });
        return;
      }

      setEmployeeDetails(values);
      changeScreen("emailAssign");
    },
    [changeScreen, setEmployeeDetails, toast]
  );

  return (
    <Form {...userDetailsForm}>
      <form
        onSubmit={userDetailsForm.handleSubmit(onSubmit)}
        className="w-[48rem]"
      >
        <div className="flex mb-5">
          <div className="w-full grid gap-3">
            <FormField
              control={userDetailsForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter the first name"
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={userDetailsForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter the last name"
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={userDetailsForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter the email"
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={userDetailsForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter the phone"
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="w-full ml-5 grid gap-3">
            <FormField
              control={userDetailsForm.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 block text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className={inter.className}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={userDetailsForm.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter the salary"
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={userDetailsForm.control}
              name="assets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assets</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the assets" required />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={userDetailsForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="address" required />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
};

export default EmployeeDetailsForm;
