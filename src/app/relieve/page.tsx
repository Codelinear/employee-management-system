"use client";

import React, { useCallback, useState } from "react";
import { useStore } from "@/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { departments, designations, relieveReasons } from "@/constants/array";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { relieveEmployeeSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCompletion } from "ai/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Markdown from "react-markdown";
import axios from "axios";
import Header from "@/components/navbar";

const RelieveEmployee = () => {
  const [relieveLoading, setRelieveLoading] = useState(false);
  const [manualReason, setManualReason] = useState("");

  const { currentEmployee } = useStore();

  const router = useRouter();

  const { toast } = useToast();

  const { completion, complete } = useCompletion({
    api: "/api/ai/relieve/write",
  });

  const relieveDetailsForm = useForm<z.infer<typeof relieveEmployeeSchema>>({
    defaultValues: {
      name: currentEmployee?.name,
      designation: "",
      department: "",
      companyName: "",
      dateOfJoining: currentEmployee?.createdAt,
      contact: "hr@codelinear.com",
      dateOfIssuance: new Date(),
      reason: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof relieveEmployeeSchema>) => {
      if (!values.department || !values.designation || !values.reason) {
        toast({
          variant: "destructive",
          title: "Please consider all the fields.",
        });

        return;
      }

      if (values.reason === "other") {
        relieveDetailsForm.setValue("reason", manualReason);

        console.log(manualReason);
      }

      console.log(manualReason);
      console.log(values);

      complete("Write a relieving letter.", { body: values });
    },
    [complete, toast, manualReason, relieveDetailsForm]
  );

  const onRelieve = useCallback(async () => {
    try {
      setRelieveLoading(true);

      await axios.put(
        `/api/employee/relieve?employeeId=${currentEmployee?.id}`
      );

      toast({
        description: "Employee has been relieved successfully",
      });

      router.push("/relieve/search");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error occured",
        description: "There is some error while relieving the employee",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setRelieveLoading(false);
    }
  }, [currentEmployee?.id, toast, router]);

  // const [date, month, year] = currentEmployee?.joiningDate.split(" / ");

  return (
    <main>
      {relieveLoading && (
        <div className="h-screen w-screen absolute top-0 left-0 z-10 flex items-center justify-center bg-white">
          <h1 className="text-4xl text-center">Loading...</h1>
        </div>
      )}

      <Header />
      <hr />

      <div className="border border-[#00000033] my-14 py-10 mx-48 rounded-lg">
        <h1 className="text-2xl text-center font-bold text-gray-900">
          Relieve Employee
        </h1>
        <Form {...relieveDetailsForm}>
          <form
            onSubmit={relieveDetailsForm.handleSubmit(onSubmit)}
            className="mx-auto max-w-[35rem] mt-10"
          >
            <div className="flex mb-5">
              <div className="w-full grid gap-3">
                <FormField
                  control={relieveDetailsForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Employee name"
                          className="h-auto rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={relieveDetailsForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-auto rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]">
                            <SelectValue placeholder="Department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((element) => (
                            <SelectItem
                              key={uuidv4()}
                              value={element.toLowerCase()}
                              className="cursor-pointer"
                            >
                              {element}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={relieveDetailsForm.control}
                  name="dateOfJoining"
                  render={() => (
                    <FormItem>
                      <FormLabel>Date of Joining</FormLabel>
                      <FormControl>
                        <Button
                          disabled
                          variant={"outline"}
                          className="h-auto block w-full rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]"
                        >
                          {/* {format(
                            new Date(
                              parseInt(year),
                              parseInt(month) - 1,
                              parseInt(date)
                            ),
                            "PPP"
                          )} */}
                          PPP
                        </Button>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={relieveDetailsForm.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-auto rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]"
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full ml-14 grid gap-3">
                <FormField
                  control={relieveDetailsForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-auto rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]"
                          placeholder="Employee ID"
                          disabled={!!currentEmployee?.employeeId}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={relieveDetailsForm.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-auto rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]">
                            <SelectValue
                              color="#00000080"
                              placeholder="Designation"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {designations.map((element) => (
                            <SelectItem
                              key={uuidv4()}
                              value={element.toLowerCase()}
                              className="cursor-pointer"
                            >
                              {element}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={relieveDetailsForm.control}
                  name="dateOfIssuance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of issuance</FormLabel>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled
                          className="h-auto block w-full rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                        </Button>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={relieveDetailsForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Select reason for relieving</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-auto rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relieveReasons.map((element) => (
                            <SelectItem
                              key={uuidv4()}
                              value={element.toLowerCase()}
                              className="cursor-pointer"
                            >
                              {element}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {field.value === "other" && (
                        <Input
                          value={manualReason}
                          onChange={(e) => setManualReason(e.target.value)}
                          placeholder="Type a reason"
                          className="absolute top-full left-0 w-full"
                        />
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {!relieveDetailsForm.getValues("department") ||
            !relieveDetailsForm.getValues("designation") ||
            !relieveDetailsForm.getValues("reason") ? (
              <div className="flex justify-center mt-12">
                <Button
                  type="submit"
                  className="bg-[#D42B2B] w-36 hover:bg-[#D42B2B] text-[12px] px-6 py-3 h-auto rounded-lg"
                >
                  Relieve Employee
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/");
                  }}
                  className="text-[12px] w-36 px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent ml-3"
                >
                  Clear form
                </Button>
              </div>
            ) : (
              <Dialog>
                <div className="flex justify-center mt-5">
                  <DialogTrigger asChild>
                    <Button
                      type="submit"
                      className="bg-[#D42B2B] hover:bg-[#D42B2B] text-[12px] px-6 py-3 h-auto rounded-lg"
                    >
                      Relieve Employee
                    </Button>
                  </DialogTrigger>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/");
                    }}
                    className="text-[12px] px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent ml-3"
                  >
                    Clear form
                  </Button>
                </div>

                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-center">
                      Writing letter using AI
                    </DialogTitle>
                  </DialogHeader>

                  <main className="my-5 w-full p-4 rounded-lg overflow-y-scroll h-[60vh] mx-auto border">
                    <Markdown>{completion}</Markdown>
                  </main>

                  <DialogFooter className="flex sm:justify-between">
                    <Button type="button">Update</Button>

                    <DialogClose asChild>
                      <Button type="button" onClick={onRelieve}>
                        Relieve
                      </Button>
                    </DialogClose>

                    <Button type="button">Download</Button>

                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </form>
        </Form>
      </div>
    </main>
  );
};

export default RelieveEmployee;
