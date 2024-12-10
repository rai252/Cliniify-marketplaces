"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, ChangeEvent, useEffect, useRef, KeyboardEvent } from "react";
import { FiSearch } from "react-icons/fi";
import { searchService } from "@/services/search.service";
import { ISuggestion } from "@/types/search/search";
import { Toaster, toast } from "react-hot-toast";
import useDebounce from "@/hooks/useDebounce"; // import the debounce hook
import { Input } from "./ui/input";

interface Prediction {
  description: string;
  structured_formatting: { main_text: string; secondary_text: string };
  place_id: string;
  types: string[];
}

enum DropdownState {
  Closed,
  OpenForInput,
  OpenForSelection,
}

const SearchComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const q = searchParams.get("q");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Prediction[] | null>(null);
  const [suggestionData, setSuggestionData] = useState<
    { suggestion: string; category: string }[]
  >([]);
  const [suggestionSearchTerm, setSuggestionSearchTerm] = useState<string>("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [showSuggestionDropdown, setShowSuggestionDropdown] =
    useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownState, setDropdownState] = useState<DropdownState>(
    DropdownState.Closed
  );
  const [isSelecting, setIsSelecting] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // debounce delay of 300ms

  useEffect(() => {
    if (
      debouncedSearchTerm.trim() !== "" &&
      dropdownState === DropdownState.OpenForInput
    ) {
      const apiUrl = `/api/location?query=${debouncedSearchTerm}`;
      setIsLocationLoading(true);

      fetch(apiUrl)
        .then((response) =>
          response.ok
            ? response.json()
            : Promise.reject("Network response was not ok")
        )
        .then((data) => {
          const localityResults = data.predictions.filter(
            (prediction: Prediction) => prediction.types.includes("locality")
          );
          setResults(localityResults);
          setDropdownState(
            localityResults.length > 0
              ? DropdownState.OpenForSelection
              : DropdownState.Closed
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setDropdownState(DropdownState.Closed);
        })
        .finally(() => setIsLocationLoading(false));
    }
  }, [debouncedSearchTerm, dropdownState]);

  const fetchSuggestions = async () => {
    try {
      if (suggestionSearchTerm.trim() !== "") {
        setIsSuggestionLoading(true);
        const suggestionResults: ISuggestion[] =
          await searchService.getSuggestions({ q: suggestionSearchTerm });

        if (Array.isArray(suggestionResults)) {
          const newSuggestionData = suggestionResults.map((suggestion) => ({
            suggestion: suggestion.suggestion,
            category: suggestion.category,
          }));
          setSuggestionData(newSuggestionData);
        } else {
          console.error(
            "Invalid suggestionResults structure:",
            suggestionResults
          );
        }
      }
    } catch (error) {
      console.error("Error fetching suggestion results:", error);
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (value.trim() !== "" && !isSelecting) {
      setDropdownState(DropdownState.OpenForInput);
    } else if (value.trim() === "") {
      setDropdownState(DropdownState.Closed);
      setResults(null);
    }
  };

  const handleSuggestionClick = (prediction: Prediction) => {
    setIsSelecting(true);
    const location = prediction.description.replaceAll(", ", ",");
    setSearchTerm(location);
    setResults(null);
    setDropdownState(DropdownState.Closed);

    // Use setTimeout to reset isSelecting after a short delay
    setTimeout(() => {
      setIsSelecting(false);
    }, 100);
  };

  const handleSuggestionInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setSuggestionSearchTerm(value);

    if (value.trim() !== "") {
      await fetchSuggestions();
      setShowSuggestionDropdown(true);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (
        dropdownState === DropdownState.OpenForSelection &&
        results &&
        results.length > 0
      ) {
        handleSuggestionClick(results[0]);
      } else {
        handleSearchClick();
      }
    }
  };

  function handleQuerySuggestionClick(query: string) {
    if (!searchTerm.trim()) {
      toast.error("Please select a city first.");
    } else if (!query.trim()) {
      toast.error("Please enter a specialty or service.");
    } else {
      router.push(`/search?location=${searchTerm}&q=${query}`);
      setShowSuggestionDropdown(false);
    }
  }

  useEffect(() => {
    if (location) setSearchTerm(location as string);
    if (q) setSuggestionSearchTerm(q as string);
  }, [q, location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownState(DropdownState.Closed);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    if (!searchTerm.trim()) {
      toast.error("Please select a city first.");
    } else if (!suggestionSearchTerm.trim()) {
      toast.error("Please enter a specialty or service.");
    } else {
      router.push(`/search?location=${searchTerm}&q=${suggestionSearchTerm}`);
    }
  };

  return (
    <div className="flex flex-col my-4 mt-10 justify-start" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row mb-2 justify-start">
        <div className="relative flex">
          <div className="relative">
            <div className="relative flex mb-2 sm:mb-0">
              <div className="relative">
                <div className="max-w-md mx-auto">
                  <div className="relative flex w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border-2 border-slate-500">
                    <div className="grid place-items-center h-full w-12 text-gray-300">
                      <Image
                        src="/images/location.png"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </div>
                    <Input
                      className="  peer h-full w-60 sm:w-full outline-none border-none text-base font-medium text-gray-700 pr-2 placeholder-gray-500"
                      type="text"
                      value={searchTerm}
                      onChange={handleLocationChange}
                      placeholder="Search City..."
                      onKeyDown={handleKeyPress}
                    />
                    {isLocationLoading && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#D1D5DB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#38B2AC"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {results &&
                  results.length > 0 &&
                  dropdownState === DropdownState.OpenForSelection && (
                    <div className="autocomplete-dropdown-container absolute bg-white border border-gray-300 mt-2 rounded z-20 shadow-md w-full">
                      {results.map((prediction: Prediction) => (
                        <div
                          key={prediction.place_id}
                          onClick={() => handleSuggestionClick(prediction)}
                          className="  text-lg suggestion-item p-3 cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex text-start">
                            <div>
                              <strong className="text-base">
                                {prediction.structured_formatting.main_text}
                              </strong>
                              <br />
                              <small className="text-base text-gray-500">
                                {
                                  prediction.structured_formatting
                                    .secondary_text
                                }
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                <p className="font-Jost text-sm text-gray-500 mt-2">
                  Based on your Location
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="relative">
            <div className="relative flex items-center sm:ml-4">
              <div className="relative ">
                <div className="max-w-md mx-auto">
                  <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border-2 border-slate-500">
                    <div className="grid place-items-center h-full w-12 text-gray-300">
                      <Image
                        src="/images/search.png"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </div>
                    <Input
                      className="  peer h-full w-60 sm:w-80 outline-none border-none text-base font-medium text-gray-700 pr-2 placeholder-gray-500"
                      type="text"
                      value={suggestionSearchTerm}
                      onChange={handleSuggestionInputChange}
                      placeholder="Search doctors, hospitals, clinics, etc..."
                      onKeyDown={handleKeyPress}
                    />
                    {isSuggestionLoading && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#D1D5DB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#38B2AC"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {suggestionData.length > 0 && showSuggestionDropdown && (
                  <div className="autocomplete-dropdown-container absolute bg-white border border-gray-300 mt-2 rounded shadow-md w-full z-20">
                    {suggestionData.map((suggestionItem, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedSuggestion(suggestionItem.suggestion);
                          setSuggestionSearchTerm(suggestionItem.suggestion);
                          setShowSuggestionDropdown(false);
                          handleQuerySuggestionClick(suggestionItem.suggestion);
                        }}
                        className={`  text-base suggestion-item p-3 cursor-pointer relative hover:bg-gray-100 ${
                          suggestionItem.suggestion === selectedSuggestion
                            ? "bg-gray-100"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <FiSearch className="text-gray-500 mr-2 text-sm" />
                            <span className="text-base">
                              {suggestionItem.suggestion}
                            </span>
                          </div>
                          <div className="text-base flex">
                            <span className="text-gray-500 text-sm capitalize ml-2">
                              {suggestionItem.category}
                            </span>
                          </div>
                        </div>
                        <hr className="border-r border-gray-200 my-1" />
                      </div>
                    ))}
                  </div>
                )}
                <p className="font-Jost text-sm text-gray-500 mt-2">
                  Ex : Dental or Pulmonology Check up etc
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSearchClick}
            className="hidden sm:block ml-4 bg-teal-600 text-white rounded-lg px-8 py-2 mb-8 text-lg"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
