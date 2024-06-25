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

const RelieveEmployee = () => {
  const [relieveLoading, setRelieveLoading] = useState(false);

  const { currentEmployee } = useStore();

  const router = useRouter();

  const { toast } = useToast();

  const { completion, complete } = useCompletion({
    api: "/api/ai/relieve/write",
  });

  const relieveDetailsForm = useForm<z.infer<typeof relieveEmployeeSchema>>({
    // resolver: zodResolver(relieveEmployeeSchema),
    // mode: "onSubmit",
    defaultValues: {
      name: currentEmployee?.firstName + " " + currentEmployee?.lastName,
      designation: "",
      department: "",
      companyName: "Codelinear",
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
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        });

        return;
      }

      complete("Write a relieving letter.", { body: values });
    },
    [complete, toast]
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

  if (!currentEmployee) {
    router.push("/");
    return;
  }

  return (
    <main>
      {relieveLoading && (
        <div className="h-screen w-screen absolute top-0 left-0 z-10 flex items-center justify-center bg-white">
          <h1 className="text-4xl text-center">Loading...</h1>
        </div>
      )}
      <h1 className="text-3xl text-center mt-5 font-bold tracking-tight text-gray-900 sm:text-4xl">
        Relieving {currentEmployee?.firstName} {currentEmployee?.lastName}
      </h1>
      <Form {...relieveDetailsForm}>
        <form
          onSubmit={relieveDetailsForm.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl mt-10"
        >
          <div className="flex mb-5">
            <div className="w-full grid gap-3">
              <FormField
                control={relieveDetailsForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select a designation" />
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a designation" />
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
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full ml-5 grid gap-3">
              <FormField
                control={relieveDetailsForm.control}
                name="dateOfJoining"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Joining</FormLabel>
                    <FormControl>
                      <Button
                        disabled
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
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={relieveDetailsForm.control}
                name="dateOfIssuance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Issuance</FormLabel>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled
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
                  </FormItem>
                )}
              />

              <FormField
                control={relieveDetailsForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a reason</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
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
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="submit">Write</Button>
            </DialogTrigger>
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
        </form>
      </Form>
    </main>
  );
};

export default RelieveEmployee;
