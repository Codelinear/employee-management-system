"use client";

import Header from "@/components/navbar";
import ImagePrompt from "@/components/ui/image-prompt";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AssetsForm, EmployeeDetailsForm } from "@/types";
import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { departments, designations } from "@/constants/array";
import Plus from "@/components/ui/plus";
import DeleteIcon from "@/components/ui/delete-icon";
import { Button } from "@/components/ui/button";
import Upload from "@/components/ui/upload";
import { format } from "date-fns";
import AddEmployeeSuccess from "@/components/add-employee-success";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import CalendarIcon from "@/components/ui/calendar-icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Asset } from "@/types";
import { useAuthenticate } from "@/lib/hooks/useAuthenticate";
import CheckBoxChecked from "@/components/ui/checkbox-checked";
import CheckboxUnchecked from "@/components/ui/checkbox-unchecked";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function AddEmployee() {
  useAuthenticate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [useTodayDate, setUseTodayDate] = useState(true);
  const [addEmployeeSuccess, setAddEmployeeSuccess] = useState(false);
  const [documentsFile, setDocumentsFile] = useState({
    panPhoto: null,
    aadhaarPhoto: null,
    resume: null,
  });
  const [addEmployeeLoading, setAddEmployeeLoading] = useState(false);

  const assetsForm = useForm<AssetsForm>({
    defaultValues: {
      assetId: "",
      assetName: "",
      assetType: "",
      dateAssigned: new Date(),
    },
  });

  const userDetailsForm = useForm<EmployeeDetailsForm>({
    defaultValues: {
      name: "",
      employeeId: "",
      personalEmail: "",
      companyEmail: "",
      department: "",
      phone: undefined,
      currentRole: "",
      joiningDate: new Date(),
      panNumber: "",
      aadhaarNumber: "",
    },
  });

  const { toast } = useToast();

  const router = useRouter();

  const onAddEmployeeSubmit = useCallback(
    async (values: EmployeeDetailsForm) => {
      setAddEmployeeLoading(true);

      const employeeId = `${values.name
        .slice(0, 2)
        .toUpperCase()}${values.currentRole
        .slice(0, 1)
        .toUpperCase()}${values.department
        .slice(0, 1)
        .toUpperCase()}${values.phone.toString().slice(8)}${format(
        values.joiningDate,
        "dd / MM / yyyy"
      ).slice(0, 2)}${values.panNumber.slice(0, 2)}${values.aadhaarNumber.slice(
        0,
        2
      )}`;

      try {
        await axios.post("/api/employee/add", {
          assets,
          employee: {
            ...values,
            employeeId,
            panNumber: values.panNumber,
            aadhaarNumber: values.aadhaarNumber,
          },
        });

        setAddEmployeeSuccess(true);
      } catch (error) {
      } finally {
        setAddEmployeeLoading(false);
      }
    },
    [assets]
  );

  const onDeleteAsset = useCallback((assetId: string) => {
    setAssets((prev) => prev.filter((element) => element.assetId !== assetId));
  }, []);

  const onAssetSubmit = useCallback(
    (values: AssetsForm) => {
      const { assetName, assetType } = values;

      if (!assetType || !assetName) {
        return;
      }

      const assetIncluded = assets.some(
        (element) =>
          element.assetName === assetName && element.assetType === assetType
      );

      if (assetIncluded) {
        toast({
          variant: "destructive",
          title: "Asset already added",
        });
        return;
      }

      // Generating assetId
      const nameDigit = assetName.slice(0, 3).toUpperCase();
      const typeDigit = assetType.slice(0, 3).toUpperCase();

      const assetId = `${nameDigit}${typeDigit}${Date.now()
        .toString()
        .slice(7)}`;

      setAssets((prev) => [...prev, { ...values, assetId }]);

      setAlertOpen(false);
    },
    [assets, toast]
  );

  return (
    <>
      {addEmployeeLoading && (
        <div className="h-screen w-full fixed backdrop-blur-3xl top-0 left-0 z-50 flex items-center justify-center">
          <h1 className="text-4xl">Adding employee... Please wait.</h1>
        </div>
      )}
      <Header />
      <hr />
      {addEmployeeSuccess ? (
        <AddEmployeeSuccess
          font={inter}
          userDetailsForm={userDetailsForm}
          assetsForm={assetsForm}
          setAssets={setAssets}
          setAddEmployeeSuccess={setAddEmployeeSuccess}
        />
      ) : (
        <Form {...userDetailsForm}>
          <form onSubmit={userDetailsForm.handleSubmit(onAddEmployeeSubmit)}>
            {" "}
            <main className="px-14 pt-12">
              <div className="flex items-start">
                <div className="cursor-pointer">
                  <ImagePrompt />
                </div>

                <div className="grid grid-rows-3 grid-cols-3 ml-[5rem] gap-y-[1rem] gap-x-[4.3rem]">
                  <FormField
                    control={userDetailsForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Employee name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Employee name"
                            className={cn(
                              "placeholder:text-[#00000080] h-auto py-3 px-4",
                              inter.className
                            )}
                            required
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userDetailsForm.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Auto generated"
                            className={cn(
                              "placeholder:text-[#00000080] h-auto py-3 px-4",
                              inter.className
                            )}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userDetailsForm.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Company Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Email Address"
                            className={cn(
                              "placeholder:text-[#00000080] h-auto py-3 px-4",
                              inter.className
                            )}
                            required
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userDetailsForm.control}
                    name="personalEmail"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Personal Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Email Address"
                            className={cn(
                              "placeholder:text-[#00000080] h-auto py-3 px-4",
                              inter.className
                            )}
                            required
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userDetailsForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-auto py-3 px-4 border border-[#00000033]">
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
                    control={userDetailsForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            maxLength={10}
                            placeholder="Phone number"
                            className={cn(
                              "placeholder:text-[#00000080] h-auto py-3 px-4",
                              inter.className
                            )}
                            required
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userDetailsForm.control}
                    name="currentRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-auto py-3 px-4 border border-[#00000033]">
                              <SelectValue placeholder="Current role" />
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
                    control={userDetailsForm.control}
                    name="joiningDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joining date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-60 mt-2 h-auto py-3 px-4 flex items-center justify-between",
                                  inter.className
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd / MM / yyyy")
                                ) : (
                                  <span className="opacity-70">
                                    Pick a date
                                  </span>
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
                              className={inter.className}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="my-8">
                <h2
                  className={cn("text-2xl mb-8 font-semibold", inter.className)}
                >
                  Assets owned
                </h2>

                <div className="rounded-tl-lg rounded-tr-lg overflow-hidden">
                  <div className="text-[14px] text-[#000000B2] flex items-center">
                    <div className="w-[2.9rem] py-[0.67rem] text-center bg-[#FCFCFC]">
                      Slno.
                    </div>
                    <div className="w-[19rem] pl-[1rem] py-[0.67rem]">
                      Asset name
                    </div>
                    <div className="py-[0.67rem] w-[12rem]">Asset ID</div>
                    <div className="py-[0.67rem] w-[11.5rem]">
                      Date assigned
                    </div>
                    <div className="py-[0.67rem]">Asset type</div>
                  </div>
                  <hr />

                  {assets.map((element, index) => (
                    <>
                      <div className="text-[14px] text-black flex items-center">
                        <div className="w-[2.9rem] py-[0.67rem] text-[#000000B2] text-center bg-[#FCFCFC]">
                          {index < 10 ? `0${index + 1}` : `${index + 1}`}
                        </div>
                        <div className="w-[19rem] pl-[1rem] py-[0.67rem]">
                          {element.assetName}
                        </div>
                        <div className="py-[0.67rem] w-[12rem]">
                          {element.assetId}
                        </div>
                        <div className="py-[0.67rem] w-[12rem]">
                          {format(element.dateAssigned, "MM / dd / yyyy")}
                        </div>
                        <div className="py-[0.67rem] w-[13.5rem]">
                          {element.assetType}
                        </div>
                        <div
                          className={`cursor-pointer`}
                          onClick={() => onDeleteAsset(element.assetId)}
                        >
                          <DeleteIcon />
                        </div>
                      </div>
                      <hr />
                    </>
                  ))}
                </div>

                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      className="flex items-center border text-black border-black bg-transparent hover:bg-transparent text-[12px] px-4 py-3 mt-4 h-auto rounded-lg"
                    >
                      <Plus />
                      <span className="ml-2">Assign Asset</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[60rem] p-10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl">
                        Assign Asset
                      </AlertDialogTitle>
                    </AlertDialogHeader>

                    <Form {...assetsForm}>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          assetsForm.handleSubmit(onAssetSubmit)();
                        }}
                      >
                        <div className="flex flex-wrap items-center mt-6 gap-y-4 gap-x-16">
                          <FormField
                            control={assetsForm.control}
                            name="assetName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="opacity-70 mb-2 text-sm">
                                  Asset name
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-60 h-12 border border-[#00000033]">
                                      <SelectValue placeholder="Asset name" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="Laptop">
                                        Laptop
                                      </SelectItem>
                                      <SelectItem value="Mobile">
                                        Mobile
                                      </SelectItem>
                                      <SelectItem value="Stickers">
                                        Stickers
                                      </SelectItem>
                                      <SelectItem value="Bag">Bag</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={assetsForm.control}
                            name="assetId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="opacity-70 text-sm">
                                  Asset ID
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-[#00000080] w-60 h-12 border border-[#00000033] mt-1"
                                    placeholder="Auto generated"
                                    disabled
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={assetsForm.control}
                            name="assetType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="opacity-70 mb-2 text-sm">
                                  Asset type
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-60 h-12 border border-[#00000033]">
                                      <SelectValue placeholder="Asset type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="Technical">
                                        Technical
                                      </SelectItem>
                                      <SelectItem value="Physical">
                                        Physical
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={assetsForm.control}
                            name="dateAssigned"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="opacity-70 text-sm block">
                                  Date Assigned
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        disabled={useTodayDate}
                                        className={cn(
                                          "w-60 mt-2 pl-5 flex items-center justify-between",
                                          inter.className
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "dd / MM / yyyy")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      className={inter.className}
                                      disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date("1900-01-01")
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="mt-1 mb-8 flex items-center">
                          {useTodayDate ? (
                            <div onClick={() => setUseTodayDate(false)}>
                              <CheckBoxChecked />
                            </div>
                          ) : (
                            <div onClick={() => setUseTodayDate(true)}>
                              <CheckboxUnchecked />
                            </div>
                          )}
                          <p
                            onClick={() => setUseTodayDate((prev) => !prev)}
                            className="text-sm ml-1.5 cursor-pointer"
                          >
                            Use today&apos;s date
                          </p>
                        </div>

                        <AlertDialogFooter className="sm:justify-start">
                          <Button
                            type="submit"
                            className="bg-[#182CE3] hover:bg-[#182CE3] text-[12px] px-6 py-3 h-auto rounded-lg"
                          >
                            Assign Asset
                          </Button>
                          <AlertDialogCancel
                            onClick={() => assetsForm.reset()}
                            className="text-[12px] px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent"
                          >
                            Cancel
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </form>
                    </Form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="mb-12">
                <h2
                  className={cn("text-2xl font-semibold mb-5", inter.className)}
                >
                  Employee Documents
                </h2>

                <div className="flex items-center">
                  <div className="flex items-center">
                    <FormField
                      control={userDetailsForm.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">
                            PAN Card Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter PAN no."
                              minLength={10}
                              maxLength={10}
                              className="placeholder:text-[#00000080] border border-[#00000033] rounded-md outline-none py-3 px-4 text-base h-auto"
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* <div className="ml-3">
                      <label htmlFor="pan-photo" className="text-sm mb-1">
                        PAN Card Photo. 2 MB
                      </label>

                      <Button
                        type="button"
                        className="rounded-md text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4"
                      >
                        <span className="mr-4">Upload photo</span>
                        <Upload />
                      </Button>
                    </div>{" "} */}
                  </div>

                  <div className="flex items-center mx-8">
                    <FormField
                      control={userDetailsForm.control}
                      name="aadhaarNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">
                            Aadhaar Card
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter Aadhaar no."
                              minLength={12}
                              maxLength={12}
                              className="placeholder:text-[#00000080] border border-[#00000033] rounded-md outline-none py-3 px-4 text-base h-auto"
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* <div className="ml-3">
                      <label htmlFor="pan-photo" className="text-sm mb-1">
                        Aadhaar Card Photo. 2 MB
                      </label>

                      <Button className="rounded-md text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4">
                        <span className="mr-4">Upload photo</span>
                        <Upload />
                      </Button>
                    </div>{" "} */}
                  </div>
                  {/* <div>
                    <label htmlFor="pan-photo" className="text-sm mb-1">
                      Resume. 2 MB
                    </label>

                    <Button className="rounded-md text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4">
                      <span className="mr-4">Upload photo</span>
                      <Upload />
                    </Button>
                  </div> */}
                </div>
              </div>
            </main>
            <footer className="flex px-14 items-center justify-start my-10">
              <Button
                type="submit"
                className="bg-[#182CE3] hover:bg-[#182CE3] text-[12px] px-6 py-3 h-auto rounded-lg"
              >
                Add Employee
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/")}
                className="text-[12px] px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent ml-3"
              >
                Close
              </Button>
            </footer>
          </form>
        </Form>
      )}
    </>
  );
}
