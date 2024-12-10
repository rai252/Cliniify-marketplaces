"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type Props = {
  currentPage: number;
  totalNumberOfPages: number;
};

export default function PaginationComponent({
  currentPage,
  totalNumberOfPages,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Pagination>
        <PaginationContent className="mt-4 mb-10">
          <PaginationItem>
            <PaginationPrevious
              className={`cursor-pointer ${
                currentPage === 1 ? "cursor-auto" : ""
              }`}
              onClick={
                currentPage === 1
                  ? undefined
                  : () => handlePageChange(currentPage - 1)
              }
            />
          </PaginationItem>
          {Array.from({ length: totalNumberOfPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
                className={`cursor-pointer ${
                  index + 1 === currentPage
                    ? "hover:bg-teal-500 hover:text-white border-teal-500"
                    : ""
                }`}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              className={`cursor-pointer ${
                currentPage === totalNumberOfPages ? "cursor-auto" : ""
              }`}
              onClick={
                currentPage === totalNumberOfPages
                  ? undefined
                  : () => handlePageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
