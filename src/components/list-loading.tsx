import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ListLoading = ({ index }: { index: number }) => {
  return (
    <>
      <div className="flex items-center">
        <div className="w-[2.9rem] text-[#000000B2] py-[1.17rem] text-center bg-[#FCFCFC]">
          {index + 1}
        </div>
        <div className="w-[18.7rem] pl-[1rem] py-[0.67rem]">
          <Skeleton className="w-[100px] h-[20px] rounded-sm" />
        </div>
        <div className="py-[0.67rem] w-[10.5rem]">
          <Skeleton className="w-[100px] h-[20px] rounded-sm" />
        </div>
        <div className="py-[0.67rem] w-[17.5rem]">
          <Skeleton className="w-[100px] h-[20px] rounded-sm" />
        </div>
        <div className="py-[0.67rem] w-[18rem]">
          <Skeleton className="w-[100px] h-[20px] rounded-sm" />
        </div>
        <Skeleton className="w-[100px] h-[20px] rounded-sm" />
      </div>
      <hr />
    </>
  );
};

export default ListLoading;
