"use client";

import React, { useCallback, useState } from "react";
import { useStore } from "@/store";
import { Input } from "@/components/ui/input";
import { SyncLoader } from "react-spinners";
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
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { relieveEmployeeSchema } from "@/lib/validator";
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
import Header from "@/components/navbar";
import CalendarIcon from "@/components/ui/calendar-icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Inter } from "next/font/google";
import { useAuthenticate } from "@/lib/hooks/useAuthenticate";
import { relieveEmployee } from "@/lib/actions/relieve-employee";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const RelieveEmployee = () => {
  useAuthenticate();

  const [relieveLoading, setRelieveLoading] = useState(false);
  const [manualReason, setManualReason] = useState("");

  const { currentEmployee } = useStore();

  const router = useRouter();

  const { toast } = useToast();

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/ai/relieve/write",
  });

  let date;
  let month;
  let year;

  const joiningDateArray = currentEmployee?.joiningDate.split(" / ");

  if (joiningDateArray) {
    date = parseInt(joiningDateArray[0]);
    month = parseInt(joiningDateArray[1]);
    year = parseInt(joiningDateArray[2]);
  }

  const joiningDate =
    year && month && date ? new Date(year, month - 1, date) : new Date();

  const relieveDetailsForm = useForm<z.infer<typeof relieveEmployeeSchema>>({
    defaultValues: {
      name: currentEmployee?.name,
      designation: currentEmployee?.currentRole || "",
      department: currentEmployee?.department || "",
      employeeId: currentEmployee?.employeeId || "",
      dateOfJoining: joiningDate,
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
        complete("Write a relieving letter.", {
          body: { ...values, reason: manualReason },
        });
      } else {
        complete("Write a relieving letter.", {
          body: values,
        });
      }
    },
    [complete, toast, manualReason]
  );

  const onRelieve = useCallback(async () => {
    try {
      setRelieveLoading(true);

      const message = await relieveEmployee(
        currentEmployee?.employeeId ||
          relieveDetailsForm.getValues("employeeId")
      );

      toast({
        description: message,
      });

      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error occured",
        description: "There is some error while relieving the employee",
      });
    } finally {
      setRelieveLoading(false);
    }
  }, [currentEmployee, relieveDetailsForm, toast, router]);

  return (
    <main>
      {relieveLoading && (
        <div className="h-screen w-screen fixed top-0 left-0 z-10 flex items-center justify-center bg-white">
          <h1 className="text-4xl text-center">Loading...</h1>
        </div>
      )}

      <Header />
      <hr />

      <div className="border border-[#00000033] my-14 py-10 w-[85vw] md:w-[42rem] xl:w-auto mx-auto xl:mx-48 rounded-lg">
        <h1 className="text-2xl text-center font-bold text-gray-900">
          Relieve Employee
        </h1>
        <Form {...relieveDetailsForm}>
          <form
            onSubmit={relieveDetailsForm.handleSubmit(onSubmit)}
            className="mx-auto w-[90%] md:max-w-[35rem] mt-10"
          >
            <div className="flex md:flex-row flex-col max-md:gap-y-3 mb-5">
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
                          disabled={!!currentEmployee?.name}
                          required
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
                              key={element.id}
                              value={element.department}
                              className="cursor-pointer"
                            >
                              {element.department}
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Joining</FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={!!currentEmployee?.joiningDate}
                              variant={"outline"}
                              className="h-auto w-full rounded-lg py-3 px-4 border border-[#00000033] flex items-center justify-between placeholder:text-[#00000080]"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            className={cn(inter.className)}
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
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full md:ml-14 grid gap-3">
                <FormField
                  control={relieveDetailsForm.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-auto rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]"
                          placeholder="Employee ID"
                          disabled={!!currentEmployee?.employeeId}
                          required
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
                              value={element}
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
                          className="h-auto w-full rounded-lg py-3 px-4 border border-[#00000033] flex items-center justify-between placeholder:text-[#00000080]"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon />
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
                          className="absolute top-full left-0 w-full h-auto rounded-lg py-3 px-4 border border-[#00000033] placeholder:text-[#00000080]"
                          required
                        />
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {!relieveDetailsForm.getValues("department") ||
            !relieveDetailsForm.getValues("designation") ||
            !relieveDetailsForm.getValues("reason") ||
            (relieveDetailsForm.getValues("reason") === "other" &&
              !manualReason) ? (
              <div
                className={`flex transition-all max-[420px]:gap-y-3 min-[420px]:flex-row flex-col justify-center ${
                  relieveDetailsForm.getValues("reason") === "other"
                    ? "mt-20"
                    : "mt-12"
                }`}
              >
                <Button
                  type="submit"
                  className="bg-[#D42B2B] w-36 hover:bg-[#D42B2B] text-[12px] px-6 py-3 h-auto rounded-lg"
                >
                  Relieve Employee
                </Button>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/");
                  }}
                  className="text-[12px] w-36 px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent min-[420px]:ml-3"
                >
                  Clear form
                </Button>
              </div>
            ) : (
              <Dialog>
                <div
                  className={`flex transition-all justify-center ${
                    relieveDetailsForm.getValues("reason") === "other"
                      ? "mt-20"
                      : "mt-12"
                  }`}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="submit"
                      className="bg-[#D42B2B] w-36 hover:bg-[#D42B2B] text-[12px] px-6 py-3 h-auto rounded-lg"
                    >
                      Relieve Employee
                    </Button>
                  </DialogTrigger>
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

                <DialogContent className="max-sm:w-[90vw] lg:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-medium text-center">
                      Relieving letter
                    </DialogTitle>
                  </DialogHeader>

                  <main className="my-2 sm:my-5 w-full p-4 rounded-lg overflow-y-scroll scrollbar-hide h-[60vh] mx-auto">
                    {isLoading ? (
                      <SyncLoader
                        color="#636363"
                        size={15}
                        margin={4}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      <Markdown>{completion}</Markdown>
                    )}
                  </main>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        onClick={onRelieve}
                        disabled={isLoading || relieveLoading}
                        className="bg-[#D42B2B] hover:bg-[#D42B2B] text-[12px] px-6 py-3 h-auto rounded-lg"
                      >
                        Relieve
                      </Button>
                    </DialogClose>

                    <DialogClose asChild>
                      <Button
                        type="button"
                        disabled={relieveLoading}
                        className="text-[12px] px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent sm:ml-3"
                      >
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
