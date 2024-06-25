"use client";

import { Button } from "@/components/ui/button";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Employee } from "@prisma/client";
import { useStore } from "@/store";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const Search = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[] | null>(null);

  const { setCurrentEmployee } = useStore();

  const router = useRouter();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setIsLoading(true);

        const res = await axios.get(
          `/api/employee/search?employeeName=${employeeName}`
        );

        setEmployees(res.data.employees);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, employeeName]
  );

  return (
    <section className="w-[80%] mx-auto py-10">
      <form onSubmit={onSubmit} className="w-full">
        <input
          className="w-full outline-none border-2 p-2 mb-5 text-xl rounded-lg"
          type="search"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Enter the employee name"
        />
      </form>
      {isLoading ? (
        <h2 className="text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Loading...
        </h2>
      ) : (
        <div className="w-full h-[88%]">
          {employees?.length === 0 ? (
            <div className="text-center h-full flex justify-center flex-col my-5">
              <p className="text-5xl font-semibold text-indigo-600">404</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                User not found
              </h1>
              <p className="mt-6 text-base leading-7 text-gray-600">
                Sorry, we couldn&apos;t find the user.
              </p>
            </div>
          ) : (
            employees?.map((element) => (
              <div
                key={uuidv4()}
                className="flex items-center my-3 p-3 rounded-lg transition duration-250"
              >
                <div className="ml-3">
                  <h3 className="text-xl">
                    {element.firstName} {element.lastName}
                  </h3>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="ml-auto">View details</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-center pt-5">
                        Here are the details of {element.firstName}{" "}
                        {element.lastName}
                      </DialogTitle>
                    </DialogHeader>

                    <main className="my-5 w-4/5 mx-auto">
                      <div className="flex justify-between items-center my-3">
                        <strong>Name</strong>
                        <p>
                          {element.firstName} {element.lastName}
                        </p>
                      </div>
                      <div className="flex justify-between items-center my-3">
                        <strong>Email</strong>
                        <p>{element.assignedEmail}</p>
                      </div>
                      <div className="flex justify-between items-center my-3">
                        <strong>Phone</strong>
                        <p>{element.phone}</p>
                      </div>
                      <div className="flex justify-between items-center my-3">
                        <strong>Date of birth</strong>
                        <p>{format(element.dob, "PPP")}</p>
                      </div>
                      <div className="flex justify-between items-center my-3">
                        <strong>Salary</strong>
                        <p>{element.salary}/Month</p>
                      </div>
                      <div className="flex justify-between items-center my-3">
                        <strong>Assets</strong>
                        <div className="flex">
                          {element.assets.map((asset) => (
                            <div
                              key={uuidv4()}
                              className="p-2 ml-2 bg-slate-300 rounded-md"
                            >
                              {asset}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center my-3">
                        <strong>Date of join</strong>
                        <p>{format(element.createdAt, "PPP")}</p>
                      </div>
                    </main>

                    <DialogFooter className="flex sm:justify-between">
                      <Button type="button">Download</Button>

                      <Button type="button">Update</Button>

                      <Button
                        type="button"
                        onClick={() => {
                          setCurrentEmployee(element);
                          router.push(`/relieve/${element.id}`);
                        }}
                      >
                        Relieve
                      </Button>

                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default Search;
