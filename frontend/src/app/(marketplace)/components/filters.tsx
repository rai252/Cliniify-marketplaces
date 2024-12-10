"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  average_rating: number;
  experience_years: number;
  fee: number;
  gender: string;
  ordering: string;
};

export default function FiltersComponent({
  average_rating,
  experience_years,
  fee,
  gender,
  ordering,
}: Props) {
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setIsFilterSelected(
      Object.values(params).some((value) => value !== null && value !== "")
    );
  }, [searchParams]);

  const handlePageChange = (params: Partial<Props>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });

    router.replace(`${pathname}?${newSearchParams.toString()}`);
    setIsFilterSelected(true);
  };

  const handleExperienceChange = (value: string) => {
    handlePageChange({ experience_years: Number(value) });
  };

  const handleRatingChange = (value: string) => {
    handlePageChange({ average_rating: Number(value) });
  };

  const handleFeeProgressBarChange = (value: number) => {
    handlePageChange({ fee: value });
  };

  const handleClearAllFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    ["average_rating", "experience_years", "fee", "gender", "ordering"].forEach(
      (key) => newSearchParams.delete(key)
    );

    router.replace(`${pathname}?${newSearchParams.toString()}`);
    setIsFilterSelected(false);
  };

  const handleGenderChange = (value: string) => {
    handlePageChange({ gender: value });
  };

  return (
    <div className="space-y-3 text-md mx-auto max-w-xl">
      <div className="space-y-6">
        {/* Relevance Filter */}
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-md">Relevance</span>
          <select
            className="form-select w-full text-gray-800 text-sm py-2 rounded-md transition-allduration-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            onChange={(e) => handlePageChange({ ordering: e.target.value })}
            value={ordering || ""}
          >
            <option value="">Select Relevance</option>
            <option value="-Experience">Experience high to low</option>
            <option value="Experience">Experience low to high</option>
            <option value="-Consultation Fee">Fee high to low</option>
            <option value="Consultation Fee">Fee low to high</option>
          </select>
        </div>

        {/* Fee Filter */}
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-md">Fee</span>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span>₹0</span>
              <input
                type="range"
                className="w-full h-1 bg-gray-200 rounded-md accent-teal-400"
                min={0}
                max={1000}
                step={10}
                value={fee}
                onInput={(e) => {
                  const value = parseInt(
                    (e.target as HTMLInputElement).value,
                    10
                  );
                  handleFeeProgressBarChange(value);
                }}
              />
              <span>₹{fee}</span>
            </div>

            <span className="text-xs text-gray-500 text-center">
              Drag to set fee range
            </span>
          </div>
        </div>

        {/* Experience Filter */}
        <div className="flex flex-col space-y-2">
          <span className="font-medium text-md">Experience</span>
          <select
            className="form-select w-full text-gray-800 text-sm py-2 rounded-md transition-allduration-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            value={experience_years || ""}
            onChange={(e) => handleExperienceChange(e.target.value)}
          >
            <option value="">Select Experience</option>
            {["1", "5", "10", "15", "20"].map((value) => (
              <option key={value} value={value}>
                {value}+ Years of experience
              </option>
            ))}
          </select>
        </div>

        {/* Ratings Filter */}
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-md">Ratings</span>
          <div className="space-y-1">
            {["5", "4", "3", "2", "1"].map((value) => (
              <div
                key={value}
                onClick={() => handleRatingChange(value)}
                className={`cursor-pointer p-2 rounded-lg text-gray-800 text-sm flex items-center justify-center space-x-1 ${
                  searchParams.get("average_rating") === value
                    ? "bg-teal-500 text-white"
                    : "border-2 border-gray-300 bg-white hover:bg-teal-100"
                }`}
              >
                <span>
                  {"★".repeat(Number(value))} {value} & above
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Filter */}
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-md">Gender</span>
          <div className="flex space-x-3">
            {["M", "F", "O"].map((value) => {
              const label =
                value === "M" ? "Male" : value === "F" ? "Female" : "Other";
              return (
                <div
                  key={value}
                  onClick={() => handleGenderChange(value)}
                  className={`cursor-pointer border p-2 rounded-lg text-gray-800 text-sm flex items-center justify-center space-x-1 ${
                    searchParams.get("gender") === value
                      ? "bg-teal-500 text-white border-teal-500"
                      : "border-teal-500 bg-white"
                  } hover:bg-teal-100`}
                >
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear All Filters */}
        {isFilterSelected && (
          <div className="flex justify-start">
            <button
              onClick={handleClearAllFilters}
              className="text-teal-700 hover:text-teal-600 font-medium underline text-md"
            >
              Remove Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
