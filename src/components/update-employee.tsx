import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/navbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import Plus from "@/components/ui/plus";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import CalendarIcon from "@/components/ui/calendar-icon";
import { v4 as uuidv4 } from "uuid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { departments, designations } from "@/constants/array";
import { AssetsForm, UpdateEmployeeForm } from "@/types";
import ImagePrompt from "@/components/ui/image-prompt";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Inter } from "next/font/google";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Asset } from "@/types";
import { useStore } from "@/store";
import { getAssets } from "@/lib/actions/get-assets";
import DeleteIcon from "./ui/delete-icon";
import Pencil from "./ui/pencil";
import { useToast } from "@/components/ui/use-toast";
import { updateEmployee } from "@/lib/actions/update-employee";
import ListLoading from "./list-loading";
import CheckBoxChecked from "./ui/checkbox-checked";
import CheckboxUnchecked from "./ui/checkbox-unchecked";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const UpdateEmployee = ({
  setIsUpdateEmployee,
  setIsViewDetails,
}: {
  setIsViewDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdateEmployee: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // This state is used to validate the assign asset thing
  const [alertOpen, setAlertOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetLoading, setAssetLoading] = useState(false);
  const [updateEmployeeLoading, setUpdateEmployeeLoading] = useState(false);
  const [useTodayDate, setUseTodayDate] = useState(true);
  const [edit, setEdit] = useState({
    name: false,
    personalEmail: false,
    companyEmail: false,
    phone: false,
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const personalEmailInputRef = useRef<HTMLInputElement>(null);
  const companyEmailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { currentEmployee } = useStore();

  const assetsForm = useForm<AssetsForm>({
    defaultValues: {
      assetId: "",
      assetName: "",
      assetType: "",
      dateAssigned: new Date(),
    },
  });

  const updateEmployeeForm = useForm<UpdateEmployeeForm>({
    defaultValues: {
      name: currentEmployee?.name || "",
      personalEmail: currentEmployee?.personalEmail || "",
      companyEmail: currentEmployee?.companyEmail || "",
      department: currentEmployee?.department || "",
      phone: parseInt(currentEmployee?.phone || ""),
      currentRole: currentEmployee?.currentRole || "",
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      if (!currentEmployee) {
        return;
      }

      setAssetLoading(true);

      const assets = await getAssets(currentEmployee.id);

      setAssets(assets);

      setAssetLoading(false);
    })();
  }, [currentEmployee]);

  const onUpdateEmployeeSubmit = useCallback(
    async (values: UpdateEmployeeForm) => {
      try {
        if (updateEmployeeLoading || !currentEmployee) {
          return;
        }

        // Re calculating employeeId
        const employeeId = `${values.name
          .slice(0, 2)
          .toUpperCase()}${values.currentRole
          .slice(0, 1)
          .toUpperCase()}${values.department
          .slice(0, 1)
          .toUpperCase()}${values.phone.toString().slice(8)}${format(
          currentEmployee.joiningDate,
          "dd / MM / yyyy"
        ).slice(0, 2)}${currentEmployee.panNumber.slice(
          0,
          2
        )}${currentEmployee.aadhaarNumber.slice(0, 2)}`;

        setUpdateEmployeeLoading(true);

        await updateEmployee(currentEmployee.id, employeeId, values, assets);
      } catch {
      } finally {
        setUpdateEmployeeLoading(false);
        setIsUpdateEmployee(false);
        setIsViewDetails(false);
      }
    },
    [
      setIsUpdateEmployee,
      updateEmployeeLoading,
      assets,
      currentEmployee,
      setIsViewDetails,
    ]
  );

  const onDeleteAsset = useCallback((assetId: string) => {
    setAssets((prev) => prev.filter((element) => element.assetId !== assetId));
  }, []);

  const onAssetSubmit = useCallback(
    (values: AssetsForm) => {
      const { assetName, assetType } = values;

      if (updateEmployeeLoading || !assetType || !assetName) {
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
    [updateEmployeeLoading, toast, assets]
  );

  const onEditClick = useCallback((name: string) => {
    setEdit((prev) => ({ ...prev, [name]: !prev.name }));
  }, []);

  return (
    <>
      <Header />
      <hr />

      <Form {...updateEmployeeForm}>
        <form
          onSubmit={updateEmployeeForm.handleSubmit(onUpdateEmployeeSubmit)}
        >
          {" "}
          <main className="px-14 pt-12">
            <div className="flex items-start">
              <div className="cursor-pointer">
                <ImagePrompt />
              </div>

              <div className="grid grid-rows-3 grid-cols-3 ml-[5rem] gap-y-[1.5rem] gap-x-[4.3rem]">
                <FormField
                  control={updateEmployeeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1 relative">
                      {!edit.name && (
                        <div
                          onClick={() => {
                            onEditClick("name");
                            nameInputRef.current?.focus();
                          }}
                          className="absolute top-[42px] cursor-pointer left-[195px]"
                        >
                          <Pencil />
                        </div>
                      )}
                      <FormLabel>Employee name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          ref={nameInputRef}
                          placeholder="Employee name"
                          onClick={() => onEditClick("name")}
                          onBlur={() =>
                            setEdit((prev) => ({
                              ...prev,
                              name: false,
                            }))
                          }
                          className={cn(
                            "placeholder:text-[#00000080] h-auto py-3 px-4",
                            !edit.name ? "cursor-pointer" : "cursor-auto",
                            inter.className
                          )}
                          disabled={updateEmployeeLoading}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateEmployeeForm.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem className="space-y-1 relative">
                      {!edit.companyEmail && (
                        <div
                          onClick={() => {
                            onEditClick("companyEmail");
                            companyEmailInputRef.current?.focus();
                          }}
                          className="absolute top-[42px] left-[195px] cursor-pointer"
                        >
                          <Pencil />
                        </div>
                      )}
                      <FormLabel>Company Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          ref={companyEmailInputRef}
                          type="email"
                          onClick={() => onEditClick("companyEmail")}
                          onBlur={() =>
                            setEdit((prev) => ({
                              ...prev,
                              companyEmail: false,
                            }))
                          }
                          placeholder="Email Address"
                          className={cn(
                            "placeholder:text-[#00000080] h-auto py-3 px-4",
                            !edit.companyEmail
                              ? "cursor-pointer"
                              : "cursor-auto",
                            inter.className
                          )}
                          disabled={updateEmployeeLoading}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateEmployeeForm.control}
                  name="personalEmail"
                  render={({ field }) => (
                    <FormItem className="space-y-1 relative">
                      {!edit.personalEmail && (
                        <div
                          onClick={() => {
                            onEditClick("personalEmail");
                            personalEmailInputRef.current?.focus();
                          }}
                          className="absolute top-[42px] left-[195px] cursor-pointer"
                        >
                          <Pencil />
                        </div>
                      )}
                      <FormLabel>Personal Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          ref={personalEmailInputRef}
                          type="email"
                          onClick={() => onEditClick("personalEmail")}
                          onBlur={() =>
                            setEdit((prev) => ({
                              ...prev,
                              personalEmail: false,
                            }))
                          }
                          placeholder="Email Address"
                          className={cn(
                            "placeholder:text-[#00000080] h-auto py-3 px-4",
                            !edit.personalEmail
                              ? "cursor-pointer"
                              : "cursor-auto",
                            inter.className
                          )}
                          disabled={updateEmployeeLoading}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateEmployeeForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={updateEmployeeLoading}
                            className="h-auto py-3 px-4 border border-[#00000033]"
                          >
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
                  control={updateEmployeeForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-1 relative">
                      {!edit.phone && (
                        <div
                          onClick={() => {
                            onEditClick("phone");
                            phoneInputRef.current?.focus();
                          }}
                          className="absolute top-[42px] left-[195px] cursor-pointer"
                        >
                          <Pencil />
                        </div>
                      )}
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          ref={phoneInputRef}
                          type="tel"
                          onClick={() => onEditClick("phone")}
                          onBlur={() =>
                            setEdit((prev) => ({
                              ...prev,
                              phone: false,
                            }))
                          }
                          maxLength={10}
                          placeholder="Phone number"
                          className={cn(
                            "placeholder:text-[#00000080] h-auto py-3 px-4",
                            !edit.phone ? "cursor-pointer" : "cursor-auto",
                            inter.className
                          )}
                          disabled={updateEmployeeLoading}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateEmployeeForm.control}
                  name="currentRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={updateEmployeeLoading}
                            className="h-auto py-3 px-4 border border-[#00000033]"
                          >
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
                  <div className="py-[0.67rem] w-[10rem]">Asset ID</div>
                  <div className="py-[0.67rem] w-[10.5rem]">Date assigned</div>
                  <div className="py-[0.67rem]">Asset type</div>
                </div>
                <hr />

                {assetLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <ListLoading key={uuidv4()} index={index} />
                    ))
                  : assets.map((element, index) => (
                      <>
                        <div className="text-[14px] text-black flex items-center">
                          <div className="w-[2.9rem] py-[0.67rem] text-[#000000B2] text-center bg-[#FCFCFC]">
                            {index < 10 ? `0${index + 1}` : `${index + 1}`}
                          </div>
                          <div className="w-[19rem] pl-[1rem] py-[0.67rem]">
                            {element.assetName}
                          </div>
                          <div className="py-[0.67rem] w-[10rem]">
                            {element.assetId}
                          </div>
                          <div className="py-[0.67rem] w-[10.5rem]">
                            {format(element.dateAssigned, "MM / dd / yyyy")}
                          </div>
                          <div className="py-[0.67rem] w-[13.5rem]">
                            {element.assetType}
                          </div>
                          <div
                            className={`cursor-pointer ${
                              updateEmployeeLoading ? "pointer-events-none" : ""
                            }`}
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
                    disabled={updateEmployeeLoading}
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
                                      physical
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
          </main>
          <footer className="flex px-14 items-center justify-start my-10">
            <Button
              type="submit"
              disabled={updateEmployeeLoading}
              className="bg-[#182CE3] hover:bg-[#182CE3] text-[12px] px-6 py-3 h-auto rounded-lg"
            >
              {updateEmployeeLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              disabled={updateEmployeeLoading}
              onClick={() => {
                setIsViewDetails(false);
                setIsUpdateEmployee(false);
              }}
              className="text-[12px] px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent ml-3"
            >
              Close
            </Button>
          </footer>
        </form>
      </Form>
    </>
  );
};

export default UpdateEmployee;
