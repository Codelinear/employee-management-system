"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/navbar";
import BackIcon from "@/components/ui/back-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { saveAs } from "file-saver";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { v4 as uuidv4 } from "uuid";
import { parse, differenceInYears } from "date-fns";
import { getAssets } from "@/lib/actions/get-assets";
import { Assets } from "@prisma/client";
import { format } from "date-fns";
import { stringify } from "csv-stringify/sync";
import ListLoading from "./list-loading";
import DownloadIcon from "@/components/ui/download-icon";
import { useToast } from "./ui/use-toast";

const inter = Inter({ subsets: ["latin"] });

const EmployeeDetails = ({
  setIsViewDetails,
  setIsUpdateEmployee,
}: {
  setIsViewDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdateEmployee: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [assetLoading, setAssetLoading] = useState(false);
  const [employeeAssets, setEmployeeAssets] = useState<Assets[]>([]);

  const { currentEmployee } = useStore();

  const { toast } = useToast();

  const router = useRouter();

  const employedYears = useRef(0);

  useEffect(() => {
    (async () => {
      if (!currentEmployee) {
        return;
      }

      setAssetLoading(true);

      const assets = await getAssets(currentEmployee.id);

      setEmployeeAssets(assets);

      setAssetLoading(false);
    })();
  }, [router, currentEmployee]);

  const downloadReport = useCallback(() => {
    if (!currentEmployee) {
      return;
    }

    const employeeData = {
      name: currentEmployee.name,
      personalEmail: currentEmployee.personalEmail,
      companyEmail: currentEmployee.companyEmail,
      department: currentEmployee.department,
      currentRole: currentEmployee.currentRole,
      phone: currentEmployee.phone,
      joiningDate: format(currentEmployee.joiningDate, "PPP"),
      panNumber: currentEmployee.panNumber,
      aadhaarNumber: currentEmployee.aadhaarNumber,
    };

    const columns = {
      name: "Name",
      personalEmail: "Personal Email",
      companyEmail: "Company Email",
      department: "Department",
      currentRole: "Current Role",
      phone: "Phone",
      joiningDate: "Joining Date",
      panNumber: "PAN Number",
      aadhaarNumber: "Aadhaar Number",
    };

    const csvData = stringify([employeeData], { header: true, columns });

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, `${currentEmployee.name}-details.csv`);
  }, [currentEmployee]);

  if (!currentEmployee) {
    router.push("/");
    return;
  }

  const formattedJoiningDate = format(
    currentEmployee.joiningDate,
    "dd / MM / yyyy"
  );

  const givenDate = parse(formattedJoiningDate, "dd / MM / yyyy", new Date());

  employedYears.current = differenceInYears(new Date(), givenDate);

  return (
    <>
      <Header />
      <hr />
      <main className="px-7 sm:px-14 pt-10">
        <div className="mb-5 flex items-center justify-start">
          <div
            className="cursor-pointer flex items-center gap-x-2 justify-start"
            onClick={() => setIsViewDetails(false)}
          >
            <BackIcon />
            <span className={`font-medium text-sm ${inter.className}`}>
              Go back
            </span>
          </div>
        </div>

        <div className="flex items-start sm:items-center lg:flex-row flex-col max-lg:gap-y-16">
          <div className="cursor-pointer">
            <ImagePlaceholder />
          </div>

          <div className="flex lg:flex-row flex-col">
            <div className="sm:ml-14 grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-4 grid-rows-8 sm:grid-rows-4 max-lg:mb-10">
              <div>
                <p className="opacity-70 text-black text-xs">Employee name</p>
                <p className="text-lg">{currentEmployee.name}</p>
              </div>
              <div>
                <p className="opacity-70 text-black text-xs">Employee ID</p>
                <p className="text-lg">{currentEmployee.employeeId}</p>
              </div>
              <div>
                <p className="opacity-70 text-black text-xs">
                  Company Email Address
                </p>
                <p className="text-lg">{currentEmployee.companyEmail}</p>
              </div>
              <div>
                <p className="opacity-70 text-black text-xs">
                  Personal Email Address
                </p>
                <p className="text-lg">{currentEmployee.personalEmail}</p>
              </div>
              <div>
                <p className="opacity-70 text-black text-xs">Department</p>
                <p className="text-lg">{currentEmployee.department}</p>
              </div>
              <div>
                <p className="opacity-70 text-black text-xs">Phone number</p>
                <p className="text-lg">{currentEmployee.phone}</p>
              </div>
              <div>
                <p className="opacity-70 text-black text-xs">Current role</p>
                <p className="text-lg">{currentEmployee.currentRole}</p>
              </div>
              <div>
                <p className="opacity-70 text-black text-xs">Employed years</p>
                <p className="text-lg">
                  {employedYears.current || "Less than a year"}
                </p>
              </div>
            </div>
            <Button
              className={
                "bg-[#182CE3] sm:w-4/5 lg:w-auto sm:mx-auto rounded-lg lg:ml-32 hover:bg-[#182CE3]"
              }
              onClick={() => {
                saveAs(currentEmployee.resumePhotoUrl, "image.jpg");
              }}
            >
              View Resume
            </Button>
          </div>
        </div>

        <div className="sm:my-8 mt-8 mb-14">
          <h2 className="text-2xl font-semibold mb-7">Assets owned</h2>

          <div className="w-full overflow-x-scroll min-[1080px]:overflow-x-auto [scrollbar-width:thin]">
            <div className="rounded-tl-lg min-[1080px]:w-full w-[60rem] rounded-tr-lg overflow-hidden">
              <div className="text-[14px] text-[#000000B2] flex items-center">
                <div className="w-[2.9rem] py-[0.67rem] text-center bg-[#FCFCFC]">
                  Slno.
                </div>
                <div className="w-[18rem] pl-[1rem] py-[0.67rem]">
                  Asset name
                </div>
                <div className="py-[0.67rem] w-[10rem]">Asset ID</div>
                <div className="py-[0.67rem]">Asset type</div>
              </div>
              <hr />

              {assetLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <ListLoading key={uuidv4()} index={index} />
                  ))
                : employeeAssets.map((asset, index) => (
                    <>
                      <div
                        key={uuidv4()}
                        className="text-[14px] flex items-center"
                      >
                        <div className="w-[2.9rem] text-[#000000B2] py-[0.67rem] text-center bg-[#FCFCFC]">
                          {index < 10 ? `0${index + 1}` : `${index + 1}`}
                        </div>
                        <div className="w-[18rem] text-black pl-[1rem] py-[0.67rem]">
                          {asset.assetName}
                        </div>
                        <div className="py-[0.67rem] text-black w-[10rem]">
                          {asset.assetId}
                        </div>
                        <div className="py-[0.67rem] text-black">
                          {asset.assetType}
                        </div>
                      </div>
                      <hr />
                    </>
                  ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-7">Employee Documents</h2>

          <div className="my-4 flex sm:flex-row flex-col max-sm:gap-y-5 items-start sm:items-center">
            <div>
              <p className="opacity-70 mb-1 text-sm">PAN Card</p>
              <Button
                className={cn(
                  "border border-[#00000033] text-black rounded-md bg-transparent hover:bg-transparent",
                  inter.className
                )}
                onClick={async () => {
                  const { panPhotoUrl, name, panNumber } = currentEmployee;

                  if (panPhotoUrl) {
                    saveAs(panPhotoUrl, `${name}-aadhaar-card.jpg`);
                  } else {
                    await navigator.clipboard.writeText(panNumber);
                    toast({
                      title: "Copied to clipboard",
                      duration: 2000,
                    });
                  }
                }}
              >
                <span>{currentEmployee?.panNumber}</span>
                {currentEmployee?.panPhotoUrl && (
                  <div className="cursor-pointer ml-3">
                    <DownloadIcon />
                  </div>
                )}
              </Button>
            </div>

            <div className="sm:mx-14">
              <p className="opacity-70 mb-1 text-sm">Aadhaar Card</p>
              <Button
                className={cn(
                  "border border-[#00000033] text-black rounded-md bg-transparent hover:bg-transparent",
                  inter.className
                )}
                onClick={async () => {
                  const { aadhaarPhotoUrl, name, aadhaarNumber } =
                    currentEmployee;

                  if (aadhaarPhotoUrl) {
                    saveAs(aadhaarPhotoUrl, `${name}-aadhaar-card.jpg`);
                  } else {
                    await navigator.clipboard.writeText(aadhaarNumber);
                    toast({
                      title: "Copied to clipboard",
                      duration: 2000,
                    });
                  }
                }}
              >
                <span>
                  {currentEmployee?.aadhaarNumber.slice(0, 4)}{" "}
                  {currentEmployee?.aadhaarNumber.slice(4, 8)}{" "}
                  {currentEmployee?.aadhaarNumber.slice(8)}
                </span>
                {currentEmployee?.aadhaarPhotoUrl && (
                  <div className="cursor-pointer ml-3">
                    <DownloadIcon />
                  </div>
                )}{" "}
              </Button>
            </div>

            <div>
              <p className="opacity-70 mb-1 text-sm">Resume</p>
              <Button
                className={cn(
                  "border border-[#00000033] text-black rounded-md bg-transparent hover:bg-transparent",
                  inter.className
                )}
                onClick={async () =>
                  saveAs(
                    currentEmployee.resumePhotoUrl!,
                    `${currentEmployee.name}-resume.jpg`
                  )
                }
              >
                <span>Resume</span>
                {currentEmployee?.resumePhotoUrl && (
                  <div className="cursor-pointer ml-3">
                    <DownloadIcon />
                  </div>
                )}{" "}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex max-md:gap-y-6 md:flex-row flex-col-reverse px-7 sm:px-14 md:items-center items-start justify-start my-10">
        <Button
          className="bg-[#182CE3] hover:bg-[#182CE3] px-6 py-3 h-auto rounded-lg text-[12px]"
          onClick={() => {
            setIsViewDetails(false);
            setIsUpdateEmployee(false);
          }}
        >
          Close
        </Button>

        <div className="flex flex-wrap items-center gap-3 md:gap-x-3">
          <Button
            type="button"
            onClick={downloadReport}
            disabled={assetLoading}
            className="flex items-center border text-black border-black bg-transparent hover:bg-transparent text-[12px] px-6 py-3 h-auto rounded-lg md:ml-10"
          >
            Download Report
          </Button>
          <Button
            type="button"
            disabled={assetLoading}
            onClick={() => setIsUpdateEmployee(true)}
            className="flex items-center border text-black border-black bg-transparent hover:bg-transparent text-[12px] px-6 py-3 h-auto rounded-lg"
          >
            Update Details
          </Button>
          {!currentEmployee.relieved && (
            <Button
              type="button"
              onClick={() => router.push("/relieve")}
              className="flex items-center text-[#C90000] bg-[#F8D1D1] hover:bg-[#F8D1D1] text-[12px] px-6 py-3 h-auto rounded-lg"
            >
              Relieve Employee
            </Button>
          )}
        </div>
      </footer>
    </>
  );
};

export default EmployeeDetails;
