"use client";

import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
// import { employees } from "@/constants/array";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Employee } from "@prisma/client";
import { useStore } from "@/store";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import SearchIcon from "@/components/ui/search";
import Funnel from "@/components/ui/funnel";
import ArrowUp from "@/components/ui/arrow-up";
import Header from "@/components/navbar";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { getEmployees } from "@/lib/actions/get-employees";
import EmployeeDetails from "@/components/employee-details";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const Home = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isViewDetails, setIsViewDetails] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const { setCurrentEmployee } = useStore();

  const router = useRouter();

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);

      const employees = await getEmployees();

      setIsLoading(false);

      setEmployees(employees);
    };

    initialLoad();
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setIsLoading(true);

        const res = await axios.get(
          `/api/employee/search?employeeName=${employeeName}`
        );

        // setEmployees(res.data.employees);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, employeeName]
  );

  const viewDetails = useCallback(
    (employeeDetails: Employee) => {
      setCurrentEmployee(employeeDetails);
      setIsViewDetails(true);
    },
    [setCurrentEmployee, setIsViewDetails]
  );

  return isViewDetails ? (
    <EmployeeDetails setIsViewDetails={setIsViewDetails} />
  ) : (
    <div>
      {isFilter && (
        <div
          className="h-screen w-full absolute bg-transparent z-10"
          onClick={() => setIsFilter(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#F7F7F7] h-80 shadow-lg mx-14 mt-52 p-5 rounded-lg"
          >
            <div>
              <p className="text-[12px]">Filter by Department</p>
              <div className="flex w-1/3 border"></div>
            </div>
            {/* <Separator /> */}
            <div></div>
            {/* <Separator /> */}
            <div></div>
          </div>
        </div>
      )}

      <Header />
      <hr />
      <main className="px-14">
        <div className="w-full flex items-center bg-[#F7F7F7] rounded-lg px-7 py-[0.95rem] my-[1.57rem]">
          {" "}
          <form
            onSubmit={onSubmit}
            className="w-[26rem] flex rounded-md border border-[#00000033] bg-white items-center py-[0.78rem] px-5"
          >
            <SearchIcon />
            <input
              className={cn(
                "w-full text-[14px] outline-none placeholder:text-[#00000080] border-none ml-4 bg-transparent",
                inter.className
              )}
              type="search"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Search Employee name, ID"
            />
          </form>
          <Button
            type="button"
            onClick={() => setIsFilter(true)}
            className={cn(
              "flex items-center border text-black border-black bg-transparent hover:bg-transparent rounded-lg text-[11px] px-3 ml-12",
              inter.className
            )}
          >
            <Funnel />
            <span className="ml-2">Filter by</span>
          </Button>
          <span className="ml-5 mr-3 text-[#00000099] text-[12px]">
            Sort by:
          </span>
          <Button
            type="button"
            className="flex items-center border text-black border-black bg-transparent hover:bg-transparent rounded-lg text-[12px] px-2"
          >
            <ArrowUp />
            <span className="ml-2">Alphabetical</span>
          </Button>
          <Button
            type="button"
            className="flex items-center border text-black border-black bg-transparent hover:bg-transparent rounded-lg text-[12px] px-2 ml-3"
          >
            <ArrowUp />
            <span className="ml-2">Date added</span>
          </Button>
        </div>

        {employees.length ? (
          <section className="rounded-lg overflow-y-scroll h-[63.5vh] [scrollbar-width:thin]">
            <div className="text-[13px] text-[#000000B2] flex items-center">
              <div className="w-[2.9rem] text-[12px] py-[0.67rem] text-center bg-[#FCFCFC]">
                Slno.
              </div>
              <div className="w-[18.7rem] pl-[1rem] py-[0.67rem]">
                Employee name
              </div>
              <div className="py-[0.67rem] w-[10.5rem]">Employee ID</div>
              <div className="w-[17.5rem] py-[0.67rem]">Email Address</div>
              <div className="py-[0.67rem]">Department</div>
            </div>
            <hr />

            {employees.map((element, index) => (
              <>
                <div
                  key={uuidv4()}
                  className="text-base text-black flex items-center"
                >
                  <div className="w-[2.9rem] text-[#000000B2] py-[1.17rem] text-center bg-[#FCFCFC] text-[12px]">
                    {index < 10 ? `0${index + 1}` : `${index + 1}`}
                  </div>
                  <div className="w-[18.7rem] pl-[1rem] py-[0.67rem]">
                    {element.name}
                  </div>
                  <div className="py-[0.67rem] w-[10.5rem]">
                    {element.employeeId}
                  </div>
                  <div className="py-[0.67rem] w-[17.5rem]">
                    {element.personalEmail}
                  </div>
                  <div className="py-[0.67rem] w-[20rem]">
                    {element.department}
                  </div>
                  <Button
                    className="bg-transparent px-2 h-auto py-2 rounded-sm hover:bg-transparent border text-black border-black"
                    type="button"
                    onClick={() => viewDetails(element)}
                  >
                    View Details
                  </Button>
                </div>
                <hr />
              </>
            ))}
          </section>
        ) : (
          <section className="flex items-center justify-center h-[63.5vh]">
            {" "}
            <h1
              className={cn(
                "text-5xl text-[#000000B2] text-center font-medium",
                inter.className
              )}
            >
              Add an employee
            </h1>
          </section>
        )}
      </main>
    </div>
  );

  // <section className="w-[80%] mx-auto py-10">
  // <form onSubmit={onSubmit} className="w-full">
  //   <input
  //     className="w-full outline-none border-2 p-2 mb-5 text-xl rounded-lg"
  //     type="search"
  //     value={employeeName}
  //     onChange={(e) => setEmployeeName(e.target.value)}
  //     placeholder="Enter the employee name"
  //   />
  // </form>
  //   {isLoading ? (
  //     <h2 className="text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  //       Loading...
  //     </h2>
  //   ) : (
  //     <div className="w-full h-[88%]">
  //       {employees?.length === 0 ? (
  //         <div className="text-center h-full flex justify-center flex-col my-5">
  //           <p className="text-5xl font-semibold text-indigo-600">404</p>
  //           <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
  //             User not found
  //           </h1>
  //           <p className="mt-6 text-base leading-7 text-gray-600">
  //             Sorry, we couldn&apos;t find the user.
  //           </p>
  //         </div>
  //       ) : (
  //         employees?.map((element) => (
  //           <div
  //             key={uuidv4()}
  //             className="flex items-center my-3 p-3 rounded-lg transition duration-250"
  //           >
  //             <div className="ml-3">
  //               <h3 className="text-xl">
  //                 {element.firstName} {element.lastName}
  //               </h3>
  //             </div>
  //             <Dialog>
  //               <DialogTrigger asChild>
  //                 <Button className="ml-auto">View details</Button>
  //               </DialogTrigger>
  //               <DialogContent className="max-w-3xl">
  //                 <DialogHeader>
  //                   <DialogTitle className="text-2xl text-center pt-5">
  //                     Here are the details of {element.firstName}{" "}
  //                     {element.lastName}
  //                   </DialogTitle>
  //                 </DialogHeader>

  //                 <main className="my-5 w-4/5 mx-auto">
  //                   <div className="flex justify-between items-center my-3">
  //                     <strong>Name</strong>
  //                     <p>
  //                       {element.firstName} {element.lastName}
  //                     </p>
  //                   </div>
  //                   <div className="flex justify-between items-center my-3">
  //                     <strong>Assigned email</strong>
  //                     <p>{element.assignedEmail}</p>
  //                   </div>
  //                   <div className="flex justify-between items-center my-3">
  //                     <strong>Phone</strong>
  //                     <p>{element.phone}</p>
  //                   </div>
  //                   <div className="flex justify-between items-center my-3">
  //                     <strong>Date of birth</strong>
  //                     <p>{format(element.dob, "PPP")}</p>
  //                   </div>
  //                   <div className="flex justify-between items-center my-3">
  //                     <strong>Salary</strong>
  //                     <p>{element.salary}/Month</p>
  //                   </div>
  //                   <div className="flex justify-between items-center my-3">
  //                     <strong>Assets</strong>
  //                     <div className="flex">
  //                       {element.assets.map((asset) => (
  //                         <div
  //                           key={uuidv4()}
  //                           className="p-2 ml-2 bg-slate-300 rounded-md"
  //                         >
  //                           {asset}
  //                         </div>
  //                       ))}
  //                     </div>
  //                   </div>
  //                   <div className="flex justify-between items-center my-3">
  //                     <strong>Date of join</strong>
  //                     <p>{format(element.createdAt, "PPP")}</p>
  //                   </div>
  //                 </main>

  //                 <DialogFooter className="flex sm:justify-between">
  //                   <Button type="button">Download</Button>

  //                   <Button type="button">Update</Button>

  //                   <Link href={`/relieve/${element.id}`}>
  //                     <Button
  //                       type="button"
  //                       onClick={() => setCurrentEmployee(element)}
  //                     >
  //                       Relieve
  //                     </Button>
  //                   </Link>

  //                   <DialogClose asChild>
  //                     <Button type="button" variant="secondary">
  //                       Close
  //                     </Button>
  //                   </DialogClose>
  //                 </DialogFooter>
  //               </DialogContent>
  //             </Dialog>
  //           </div>
  //         ))
  //       )}
  //     </div>
  //   )}
  // </section>
};

export default Home;
