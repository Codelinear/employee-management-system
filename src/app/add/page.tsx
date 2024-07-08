"use client";

import Header from "@/components/navbar";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AssetsForm, EmployeeDetailsForm } from "@/types";
import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import { Asset } from "@/types";
import { useAuthenticate } from "@/lib/hooks/useAuthenticate";
import CheckBoxChecked from "@/components/ui/checkbox-checked";
import CheckboxUnchecked from "@/components/ui/checkbox-unchecked";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import Cross from "@/components/ui/cross";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function AddEmployee() {
  useAuthenticate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [useTodayDate, setUseTodayDate] = useState(true);
  const [addEmployeeSuccess, setAddEmployeeSuccess] = useState(false);
  const [addEmployeeLoading, setAddEmployeeLoading] = useState(false);
  const [panError, setPanError] = useState(false);
  const [aadhaarError, setAadhaarError] = useState(false);
  const [resumeError, setResumeError] = useState(false);
  const [documents, setDocuments] = useState({
    aadhaarPhoto: null,
    panPhoto: null,
    resumePhoto: null,
  });

  const assetsForm = useForm<AssetsForm>({
    defaultValues: {
      assetId: "",
      assetName: "",
      assetType: "",
      dateAssigned: {
        from: new Date(),
        to: new Date(),
      },
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
      joiningDate: {
        from: new Date(),
        to: new Date(),
      },
      panNumber: "",
      aadhaarNumber: "",
    },
  });

  const { toast } = useToast();

  const router = useRouter();

  const panPhotoRef = useRef<HTMLInputElement | null>(null);
  const aadhaarPhotoRef = useRef<HTMLInputElement | null>(null);
  const resumePhotoRef = useRef<HTMLInputElement | null>(null);

  const onAddEmployeeSubmit = useCallback(
    async (values: EmployeeDetailsForm) => {
      if (!values.department || !values.currentRole) {
        toast({
          variant: "destructive",
          title: "Please fill all the fields",
          duration: 2000,
        });
        return;
      }

      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(values.panNumber)) {
        toast({
          variant: "destructive",
          title: "Incorrect format of PAN number",
          duration: 2000,
        });
        return;
      }

      if (!/[0-9]{12}/g.test(values.aadhaarNumber)) {
        toast({
          variant: "destructive",
          title: "Aadhaar number is not valid",
          duration: 2000,
        });
        return;
      }

      if (!documents.resumePhoto) {
        toast({
          variant: "destructive",
          title: "Resume is required",
          duration: 2000,
        });
        return;
      }

      setAddEmployeeLoading(true);

      const employeeId = `${values.name
        .slice(0, 2)
        .toUpperCase()}${values.currentRole
        .slice(0, 1)
        .toUpperCase()}${values.department
        .slice(0, 1)
        .toUpperCase()}${values.phone.toString().slice(8)}${format(
        values.joiningDate.from,
        "dd / MM / yyyy"
      ).slice(0, 2)}${values.panNumber.slice(0, 2)}${values.aadhaarNumber.slice(
        0,
        2
      )}`;

      const formData = new FormData();

      const employee = {
        ...values,
        joiningDate: values.joiningDate.from,
        employeeId,
      };

      const data = {
        employee,
        assets,
      };

      formData.append("data", JSON.stringify(data));
      formData.append("resumePhoto", documents.resumePhoto);
      formData.append("panPhoto", documents.panPhoto || "");
      formData.append("aadhaarPhoto", documents.aadhaarPhoto || "");

      try {
        await axios.post("/api/employee/add", formData);

        setAddEmployeeSuccess(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: error.response.data.message,
          duration: 2000,
        });
      } finally {
        setAddEmployeeLoading(false);
        if (panPhotoRef.current) {
          panPhotoRef.current.value = "";
        }
        if (aadhaarPhotoRef.current) {
          aadhaarPhotoRef.current.value = "";
        }
        if (resumePhotoRef.current) {
          resumePhotoRef.current.value = "";
        }
        setDocuments((prev) => ({
          ...prev,
          panPhoto: null,
          aadhaarPhoto: null,
          resumePhoto: null,
        }));
      }
    },
    [assets, toast, documents]
  );

  const onDeleteAsset = useCallback((assetId: string) => {
    setAssets((prev) => prev.filter((element) => element.assetId !== assetId));
  }, []);

  const fileInputHandler = useCallback(
    (type: "aadhaarPhoto" | "panPhoto" | "resumePhoto", file: File) => {
      setDocuments((prev) => ({ ...prev, [type]: file }));
    },
    []
  );

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
          duration: 2000,
        });
        return;
      }

      // Generating assetId
      const nameDigit = assetName.slice(0, 3).toUpperCase();
      const typeDigit = assetType.slice(0, 3).toUpperCase();

      const assetId = `${nameDigit}${typeDigit}${Date.now()
        .toString()
        .slice(7)}`;

      setAssets((prev) => [
        ...prev,
        { ...values, dateAssigned: values.dateAssigned.from, assetId },
      ]);

      setAlertOpen(false);
      assetsForm.reset();
    },
    [assets, toast, assetsForm]
  );

  return (
    <>
      {addEmployeeLoading && (
        <div className="h-screen w-full fixed backdrop-blur-3xl top-0 left-0 z-50 flex items-center justify-center">
          <h1 className="text-4xl text-center mx-5">
            Adding employee... Please wait.
          </h1>
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
            <main className="px-7 sm:px-14 pt-12">
              <div className="flex lg:flex-row flex-col max-lg:gap-y-16 items-center lg:items-start">
                <div className="">
                  {/* <ImagePrompt /> */}
                  <ImagePlaceholder />
                </div>

                <div className="grid grid-rows-8 sm:w-auto w-full px-5 sm:px-0 sm:grid-rows-4 md:mb-0 mb-10 md:grid-rows-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:ml-[3.5rem] xl:ml-[5rem] gap-y-[1rem] gap-x-[2.7rem] xl:gap-x-[4.3rem]">
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
                        <FormControl>
                          <CalendarDatePicker
                            date={field.value}
                            onDateSelect={({ from, to }) => {
                              userDetailsForm.setValue("joiningDate", {
                                from,
                                to,
                              });
                            }}
                            numberOfMonths={1}
                            className={cn(
                              "w-full bg-transparent hover:bg-transparent text-black mt-2 h-auto py-3 px-4 flex items-center justify-between"
                            )}
                          />
                        </FormControl>
                        {/* <Popover>
                          <PopoverTrigger asChild>
                            <FormControl> */}
                        {/* <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full mt-2 h-auto py-3 px-4 flex items-center justify-between",
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
                              </Button> */}
                        {/* </FormControl> */}
                        {/* </PopoverTrigger>
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
                        </Popover> */}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="sm:my-8 mt-8 mb-14">
                <h2
                  className={cn("text-2xl mb-8 font-semibold", inter.className)}
                >
                  Assets owned
                </h2>

                <div className="w-full overflow-x-scroll min-[1080px]:overflow-x-auto [scrollbar-width:thin]">
                  <div className="rounded-tl-lg min-[1080px]:w-full w-[60rem] rounded-tr-lg overflow-hidden">
                    <div className="text-[14px] text-[#000000B2] flex items-center">
                      <div className="w-[2.9rem] py-[0.67rem] text-center bg-[#FCFCFC]">
                        Slno.
                      </div>
                      <div className="w-[19rem] pl-[1rem] py-[0.67rem]">
                        Asset name
                      </div>
                      <div className="py-[0.67rem] w-[12rem]">Asset ID</div>
                      <div className="py-[0.67rem] w-[12rem]">
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
                  <AlertDialogContent className="lg:max-w-[60rem] w-[85vw] p-10">
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
                        <div className="flex flex-wrap items-center [scrollbar-width:thin] max-lg:h-[50vh] max-lg:overflow-y-scroll mb-16 gap-y-4 gap-x-16">
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
                              <FormItem className="flex relative flex-col">
                                <div className="mt-1 mb-8 absolute left-0 top-full translate-y-2 flex items-center">
                                  {useTodayDate ? (
                                    <div onClick={() => setUseTodayDate(false)}>
                                      <CheckBoxChecked />
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        assetsForm.setValue("dateAssigned", {
                                          from: new Date(),
                                          to: new Date(),
                                        });
                                        setUseTodayDate(true);
                                      }}
                                    >
                                      <CheckboxUnchecked />
                                    </div>
                                  )}
                                  <p
                                    onClick={() =>
                                      setUseTodayDate((prev) => !prev)
                                    }
                                    className="text-sm ml-1.5 cursor-pointer"
                                  >
                                    Use today&apos;s date
                                  </p>
                                </div>

                                <FormLabel className="opacity-70 text-sm block">
                                  Date Assigned
                                </FormLabel>
                                <FormControl>
                                  <CalendarDatePicker
                                    date={field.value}
                                    disabled={useTodayDate}
                                    onDateSelect={({ from, to }) => {
                                      assetsForm.setValue("dateAssigned", {
                                        from,
                                        to,
                                      });
                                    }}
                                    numberOfMonths={1}
                                    className={cn(
                                      "w-60 bg-transparent hover:bg-transparent text-black mt-2 h-auto py-3 px-4 flex items-center justify-between"
                                    )}
                                  />
                                </FormControl>
                                {/* <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        disabled={useTodayDate}
                                        className={cn(
                                          "w-60 mt-2 h-auto py-[0.9rem] px-4 flex items-center justify-between",
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
                                </Popover> */}
                              </FormItem>
                            )}
                          />
                        </div>

                        <AlertDialogFooter className="items-center justify-start sm:justify-start flex-row">
                          <Button
                            type="submit"
                            className="bg-[#182CE3] hover:bg-[#182CE3] text-[12px] px-6 py-3 h-auto rounded-lg"
                          >
                            Assign Asset
                          </Button>
                          <AlertDialogCancel
                            className="mt-0"
                            asChild
                            onClick={() => assetsForm.reset()}
                          >
                            <Button
                              type="submit"
                              className="text-[12px] px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent"
                            >
                              Cancel
                            </Button>
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

                <div className="flex lg:flex-row flex-col items-start gap-x-8 gap-y-5 lg:gap-y-0 lg:items-center">
                  <div className="flex gap-x-3 sm:flex-row flex-col items-start max-sm:gap-y-5 sm:items-center">
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
                    {/* <FormField
                      control={userDetailsForm.control}
                      name="panPhoto"
                      render={() => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">
                            Pan Card Photo. 2 MB
                          </FormLabel>
                          <FormControl>
                            <>
                              <Button
                                type="button"
                                className="rounded-md text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4"
                                onClick={() => panPhotoRef.current?.click()}
                              >
                                <span className="mr-4">Upload photo</span>
                                <Upload />
                              </Button>

                              <input
                                ref={panPhotoRef}
                                type="file"
                                onChange={(e) => {
                                  const files = e.target.files;

                                  if (!files) {
                                    return;
                                  }

                                  fileInputHandler("panPhoto", files[0]);
                                }}
                                accept="image/png, image/jpeg, image/jpg"
                                hidden
                              />
                            </>
                          </FormControl>
                        </FormItem>
                      )}
                    /> */}
                    <div className="space-y-1">
                      <label
                        htmlFor="pan-photo"
                        className={`text-sm ${
                          panError ? "text-[#C71414]" : ""
                        }`}
                      >
                        PAN Card Photo. 2 MB
                      </label>

                      {panPhotoRef.current?.value || documents.panPhoto ? (
                        <div className="flex gap-x-2">
                          <Button
                            type="button"
                            className="rounded-md text-black bg-[#C1F6D0] hover:bg-[#C1F6D0] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4 cursor-auto text-center"
                          >
                            <span className="mr-4">Uploaded!</span>
                          </Button>

                          <Button
                            type="button"
                            className="rounded-md text-black bg-[#F9D8D8] hover:bg-[#F9D8D8] flex items-center outline-none text-sm h-auto w-12"
                            onClick={() => {
                              if (panPhotoRef.current) {
                                panPhotoRef.current.value = "";
                                setDocuments((prev) => ({
                                  ...prev,
                                  panPhoto: null,
                                }));
                              }
                            }}
                          >
                            <Cross stroke="#C90000" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Button
                            type="button"
                            className="rounded-md text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4"
                            onClick={() => panPhotoRef.current?.click()}
                          >
                            <span className="mr-4">Upload photo</span>
                            <Upload />
                          </Button>
                        </div>
                      )}

                      <input
                        ref={panPhotoRef}
                        id="pan-photo"
                        type="file"
                        onChange={(e) => {
                          const files = e.target.files;

                          if (!files) {
                            return;
                          }

                          const fileSizeInBytes = files[0].size;
                          const fileSizeInKB = fileSizeInBytes / 1024;
                          const fileSizeInMB = fileSizeInKB / 1024;

                          if (fileSizeInMB > 2) {
                            setPanError(true);
                            e.target.value = "";
                            return;
                          }

                          fileInputHandler("panPhoto", files[0]);
                        }}
                        accept="image/png, image/jpeg, image/jpg"
                        hidden
                      />
                    </div>{" "}
                  </div>

                  <div className="flex sm:flex-row flex-col items-start max-sm:gap-y-5 sm:items-center gap-x-3">
                    <FormField
                      control={userDetailsForm.control}
                      name="aadhaarNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">
                            Aadhaar Card Number
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

                    <div className="space-y-1">
                      <label
                        htmlFor="aadhaar-photo"
                        className={`text-sm ${
                          aadhaarError ? "text-[#C71414]" : ""
                        }`}
                      >
                        Aadhaar Photo. 2 MB
                      </label>

                      {aadhaarPhotoRef.current?.value ||
                      documents.aadhaarPhoto ? (
                        <div className="flex gap-x-2">
                          <Button
                            type="button"
                            className="rounded-md text-black bg-[#C1F6D0] hover:bg-[#C1F6D0] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4 cursor-auto text-center"
                          >
                            <span className="mr-4">Uploaded!</span>
                          </Button>

                          <Button
                            type="button"
                            className="rounded-md text-black bg-[#F9D8D8] hover:bg-[#F9D8D8] flex items-center outline-none text-sm h-auto w-12"
                            onClick={() => {
                              if (aadhaarPhotoRef.current) {
                                aadhaarPhotoRef.current.value = "";
                                setDocuments((prev) => ({
                                  ...prev,
                                  aadhaarPhoto: null,
                                }));
                              }
                            }}
                          >
                            <Cross stroke="#C90000" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Button
                            type="button"
                            className="rounded-md text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4"
                            onClick={() => aadhaarPhotoRef.current?.click()}
                          >
                            <span className="mr-4">Upload photo</span>
                            <Upload />
                          </Button>
                        </div>
                      )}

                      <input
                        ref={aadhaarPhotoRef}
                        id="aadhaar-photo"
                        type="file"
                        onChange={(e) => {
                          const files = e.target.files;

                          if (!files) {
                            return;
                          }

                          const fileSizeInBytes = files[0].size;
                          const fileSizeInKB = fileSizeInBytes / 1024;
                          const fileSizeInMB = fileSizeInKB / 1024;

                          if (fileSizeInMB > 2) {
                            setAadhaarError(true);
                            e.target.value = "";
                            return;
                          }

                          fileInputHandler("aadhaarPhoto", files[0]);
                        }}
                        accept="image/png, image/jpeg, image/jpg"
                        hidden
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="resume-photo"
                      className={`text-sm ${
                        resumeError ? "text-[#C71414]" : ""
                      }`}
                    >
                      Resume. 2 MB
                    </label>

                    {resumePhotoRef.current?.value || documents.resumePhoto ? (
                      <div className="flex gap-x-2">
                        <Button
                          type="button"
                          className="rounded-md text-black bg-[#C1F6D0] hover:bg-[#C1F6D0] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4 cursor-auto text-center"
                        >
                          <span className="mr-4">Uploaded!</span>
                        </Button>

                        <Button
                          type="button"
                          className="rounded-md text-black bg-[#F9D8D8] hover:bg-[#F9D8D8] flex items-center outline-none text-sm h-auto w-12"
                          onClick={() => {
                            if (resumePhotoRef.current) {
                              resumePhotoRef.current.value = "";
                              setDocuments((prev) => ({
                                ...prev,
                                resumePhoto: null,
                              }));
                            }
                          }}
                        >
                          <Cross stroke="#C90000" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          type="button"
                          className="rounded-md text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4"
                          onClick={() => resumePhotoRef.current?.click()}
                        >
                          <span className="mr-4">Upload photo</span>
                          <Upload />
                        </Button>
                      </div>
                    )}

                    <input
                      ref={resumePhotoRef}
                      id="resume-photo"
                      type="file"
                      onChange={(e) => {
                        const files = e.target.files;

                        if (!files) {
                          return;
                        }

                        const fileSizeInBytes = files[0].size;
                        const fileSizeInKB = fileSizeInBytes / 1024;
                        const fileSizeInMB = fileSizeInKB / 1024;

                        if (fileSizeInMB > 2) {
                          setResumeError(true);
                          e.target.value = "";
                          return;
                        }

                        fileInputHandler("resumePhoto", files[0]);
                      }}
                      accept="image/png, image/jpeg, image/jpg"
                      hidden
                    />
                  </div>
                </div>
              </div>
            </main>
            <footer className="flex px-7 sm:px-14 items-center justify-start my-10">
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
