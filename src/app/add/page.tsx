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
import { AddEmployeeInputName, EmployeeDetailsForm } from "@/types";
import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { addEmployeesInputs } from "@/constants/array";
import Plus from "@/components/ui/plus";
import { Button } from "@/components/ui/button";
import Upload from "@/components/ui/upload";
import { format } from "date-fns";
import AddEmployeeSuccess from "@/components/add-employee-success";
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

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function AddEmployee() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [assetDetail, setAssetDetail] = useState<Asset>({
    assetId: "",
    assetName: "",
    assetType: "",
    dateAssigned: new Date(),
  });
  const [useTodayDate, setUseTodayDate] = useState(true);
  const [addEmployeeSuccess, setAddEmployeeSuccess] = useState(false);
  const [documentsText, setDocumentsText] = useState({
    panNumber: "",
    aadhaarNumber: "",
  });
  const [documentsFile, setDocumentsFile] = useState({
    panPhoto: null,
    aadhaarPhoto: null,
    resume: null,
  });
  const [addEmployeeLoading, setAddEmployeeLoading] = useState(false);

  const userDetailsForm = useForm<EmployeeDetailsForm>({
    defaultValues: {
      joiningDate: `${new Date().getDate()} / ${
        new Date().getMonth() + 1
      } / ${new Date().getFullYear()}`,
    },
  });

  const router = useRouter();

  const onAddEmployeeSubmit = useCallback(async () => {
    setAddEmployeeLoading(true);

    const values = userDetailsForm.getValues();

    const employeeId = `${values.name
      .slice(0, 2)
      .toUpperCase()}${values.currentRole.slice(0, 1)}${values.department.slice(
      0,
      1
    )}${values.phone.toString().slice(8)}${values.joiningDate.slice(
      0,
      2
    )}${documentsText.panNumber.slice(0, 2)}${documentsText.aadhaarNumber.slice(
      0,
      2
    )}`;

    try {
      await axios.post("/api/employee/add", {
        assets,
        employee: {
          ...values,
          employeeId,
          panNumber: documentsText.panNumber,
          aadhaarNumber: documentsText.aadhaarNumber,
        },
      });

      router.push("/");
    } catch (error) {
    } finally {
      setAddEmployeeLoading(false);
    }
  }, [assets, documentsText, userDetailsForm, router]);

  const onSubmit = useCallback(async (values: EmployeeDetailsForm) => {
    //     setAddEmployeeLoading(true);
    //     try {
    //       await axios.post("/api/employee/add", {
    //         ...values,
    //         assets,
    //         panNumber: documentsText.panNumber,
    //         aadhaarNumber: documentsText.aadhaarNumber,
    //       });
    //     } catch (error) {
    //     } finally {
    //       setAddEmployeeLoading(false);
    //     }
  }, []);

  // const documentsFileInputHandler = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (!e.target.files) return;

  //     const file = e.target.files[0];

  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = (data) => {
  //       if (!reader.result) {
  //         return;
  //       }

  //       setDocumentsFile((prevState) => ({
  //         ...prevState,
  //         [e.target.name]: new File([reader.result], file.name, {
  //           type: file.type,
  //         }),
  //       }));
  //     };
  //   },
  //   []
  // );

  const documentsTextInputHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDocumentsText((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const onAssetDetailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAssetDetail((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    },
    []
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
          setAddEmployeeSuccess={setAddEmployeeSuccess}
        />
      ) : (
        <>
          <main className="px-14 pt-12">
            <div className="flex items-start">
              <div className="cursor-pointer">
                <ImagePrompt />
              </div>

              <Form {...userDetailsForm}>
                <form
                  onSubmit={userDetailsForm.handleSubmit(onSubmit)}
                  className="grid grid-rows-3 grid-cols-3 ml-[5rem] gap-y-[1.5rem] gap-x-[4.3rem]"
                >
                  {addEmployeesInputs.map((element) => (
                    <FormField
                      key={uuidv4()}
                      control={userDetailsForm.control}
                      name={element.name as AddEmployeeInputName}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>{element.label}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type={element.type}
                              placeholder={element.placeholder}
                              className={cn(
                                "placeholder:text-[#00000080] h-auto py-3 px-4",
                                inter.className
                              )}
                              disabled={
                                element.name === "joiningDate" ||
                                element.name === "employeeId"
                              }
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </form>
              </Form>
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
                  <div className="py-[0.67rem] w-[11.5rem]">Date assigned</div>
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
                      <div className="py-[0.67rem]">{element.assetType}</div>
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
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      setAssets((prev) => [...prev, assetDetail]);
                      if (!assetDetail.dateAssigned) {
                        setAlertOpen(true);
                      } else {
                        setAlertOpen(false);
                      }
                    }}
                  >
                    <div className="flex flex-wrap items-center mt-6 gap-y-4 gap-x-16">
                      <div>
                        <p className="opacity-70 mb-2 text-sm">Asset name</p>
                        <Select
                          value={assetDetail.assetName}
                          onValueChange={(value) =>
                            setAssetDetail((prevState) => ({
                              ...prevState,
                              assetName: value,
                            }))
                          }
                          name="assetName"
                          required
                        >
                          <SelectTrigger className="w-60 h-12 border border-[#00000033]">
                            <SelectValue placeholder="Asset name" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="laptop">Laptop</SelectItem>
                              <SelectItem value="mobile">Mobile</SelectItem>
                              <SelectItem value="stickers">Stickers</SelectItem>
                              <SelectItem value="bag">Bag</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label
                          htmlFor="asset-id"
                          className="opacity-70 text-sm"
                        >
                          Asset ID
                        </label>
                        <Input
                          id="asset-id"
                          name="assetId"
                          onChange={onAssetDetailChange}
                          value={assetDetail.assetId}
                          className="placeholder:text-[#00000080] w-60 h-12 border border-[#00000033] mt-1"
                          placeholder="ISDH98377212"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="asset-type"
                          className="opacity-70 text-sm"
                        >
                          Asset type
                        </label>
                        <Input
                          id="asset-type"
                          name="assetType"
                          value={assetDetail.assetType}
                          onChange={onAssetDetailChange}
                          className="placeholder:text-[#00000080] w-60 h-12 border border-[#00000033] mt-1"
                          placeholder="Asset type"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="asset-date-assigned"
                          className="opacity-70 text-sm block"
                        >
                          Date Assigned
                        </label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              disabled={useTodayDate}
                              className={cn(
                                "w-60 mt-2 pl-5 flex items-center justify-between",
                                !assetDetail.dateAssigned &&
                                  "text-muted-foreground",
                                inter.className
                              )}
                            >
                              {assetDetail.dateAssigned ? (
                                format(
                                  assetDetail.dateAssigned,
                                  "dd / MM / yyyy"
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={assetDetail.dateAssigned}
                              className={inter.className}
                              onSelect={(date) => {
                                if (date) {
                                  setAssetDetail((prevState) => ({
                                    ...prevState,
                                    dateAssigned: date,
                                  }));
                                }
                              }}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="mt-1 mb-8 flex items-center">
                      <Checkbox
                        id="use-today-date-checkbox"
                        checked={useTodayDate}
                        onCheckedChange={(value) =>
                          setUseTodayDate(value as boolean)
                        }
                        className="data-[state=checked]:bg-[#182CE3]"
                      />
                      <label
                        htmlFor="use-today-date-checkbox"
                        className="text-sm ml-1.5 cursor-pointer"
                      >
                        Use today&apos;s date
                      </label>
                    </div>

                    <AlertDialogFooter className="sm:justify-start">
                      <Button
                        type="submit"
                        className="bg-[#182CE3] hover:bg-[#182CE3] text-[12px] px-6 py-3 h-auto rounded-lg"
                      >
                        Assign Asset
                      </Button>
                      <AlertDialogCancel
                        onClick={() =>
                          setAssetDetail({
                            assetId: "",
                            assetName: "",
                            assetType: "",
                            dateAssigned: new Date(),
                          })
                        }
                        className="text-[12px] px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent"
                      >
                        Cancel
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="mb-12">
              <h2 className={cn("text-2xl font-medium mb-5", inter.className)}>
                Employee Documents
              </h2>

              <div className="flex items-center">
                <div className="flex items-center">
                  <div>
                    <label htmlFor="pan-number" className="text-sm block mb-1">
                      PAN Card Number
                    </label>
                    <input
                      className="placeholder:text-[#00000080] border border-[#00000033] rounded-md outline-none 3 py-3 px-4 text-base"
                      value={documentsText.panNumber}
                      onChange={documentsTextInputHandler}
                      type="text"
                      name="panNumber"
                      id="pan-number"
                      placeholder="Enter PAN no."
                      required
                    />
                  </div>
                  <div className="ml-3">
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
                  </div>{" "}
                </div>

                <div className="flex items-center mx-8">
                  <div>
                    <label
                      htmlFor="aadhaar-number"
                      className="text-sm block mb-1"
                    >
                      Aadhaar Card
                    </label>
                    <input
                      className="placeholder:text-[#00000080] border border-[#00000033] rounded-md outline-none p-3"
                      value={documentsText.aadhaarNumber}
                      onChange={documentsTextInputHandler}
                      type="text"
                      name="aadhaarNumber"
                      id="aadhaar-number"
                      placeholder="Enter Aadhaar no."
                      required
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="pan-photo" className="text-sm mb-1">
                      Aadhaar Card Photo. 2 MB
                    </label>

                    <Button className="rounded-md text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4">
                      <span className="mr-4">Upload photo</span>
                      <Upload />
                    </Button>
                  </div>{" "}
                </div>
                <div>
                  <label htmlFor="pan-photo" className="text-sm mb-1">
                    Resume. 2 MB
                  </label>

                  <Button className="rounded-md text-black bg-[#EAEAEA] hover:bg-[#EAEAEA] flex items-center outline-none text-sm h-auto py-[0.95rem] px-4">
                    <span className="mr-4">Upload photo</span>
                    <Upload />
                  </Button>
                </div>
              </div>
            </div>
          </main>

          <footer className="flex px-14 items-center justify-start my-10">
            <Button
              onClick={onAddEmployeeSubmit}
              className="bg-[#182CE3] hover:bg-[#182CE3] text-[12px] px-6 py-3 h-auto rounded-lg"
            >
              Add Employee
            </Button>
            <Button
              type="button"
              className="text-[12px] px-6 py-3 h-auto rounded-lg border text-black border-black bg-transparent hover:bg-transparent ml-3"
            >
              Close
            </Button>
          </footer>
        </>
      )}
    </>
  );
}
