// import { FaFilter } from "react-icons/fa";
import SearchComponent from "@/components/search-box";
import PaginationComponent from "../components/pagination";
import FiltersComponent from "../components/filters";
import DoctorSearch from "./components/doctorCard";
import EstablishmentSearch from "./components/establishmentCard";
import { searchService } from "@/services/search.service";

export default async function SearchPage({ searchParams, params }: any) {
  const {
    q = "",
    location = "",
    page = "1",
    average_rating,
    experience_years,
    fee,
    gender,
    ordering,
  } = searchParams;

  const currentPage = Number(page);
  const page_size = 10;

  const searchData = await searchService.getSearch({
    q,
    location,
    page: currentPage,
    page_size,
    average_rating,
    experience_years,
    fee,
    gender,
    ordering,
  });

  const totalPages = Math.ceil((searchData?.count || 0) / page_size);

  return (
    <div className="main-section bg-slate-50">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>

      <div className="search-section flex justify-center mt-3 bg-white py-18">
        <SearchComponent />
      </div>

      {/* Content Section */}
      <div className="container">
        <div className=" mx-auto mt-3 grid grid-cols-12 gap-8 py-5 rounded-t-10xl overflow-hidden">
          {/* Filters Section */}
          <aside className="col-span-12 lg:col-span-3 bg-white shadow-md rounded-md p-4 relative">
            {/* Filter Icon */}
            {/* <div className="absolute top-3 right-3 cursor-pointer text-teal-500 text-2xl">
              <FaFilter />
            </div> */}
            <FiltersComponent
              average_rating={average_rating ?? 0}
              experience_years={experience_years ?? 0}
              fee={fee ?? 0}
              gender={gender ?? ""}
              ordering={ordering || ""}
            />
          </aside>

          {/* Cards Section */}
          <section className="col-span-12 lg:col-span-5">
            <div className="space-y-4">
              {searchData?.results?.length ? (
                searchData.results.map((item, index) =>
                  item.type === "doctor" ? (
                    <DoctorSearch key={index} doctorData={item} />
                  ) : (
                    <EstablishmentSearch key={index} establishmentData={item} />
                  )
                )
              ) : (
                <p className="text-center text-gray-600">
                  No results found. Try adjusting your search criteria.
                </p>
              )}
            </div>

            {/* Pagination */}
            {searchData?.results.length > 0 && (
              <div className="text-center mt-8">
                <PaginationComponent
                  currentPage={currentPage}
                  totalNumberOfPages={totalPages}
                />
              </div>
            )}
          </section>

          {/* Map Section */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-0 bg-white shadow-md rounded-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59840.897271228816!2d72.87270253495097!3d20.38057752378019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ce2c01246603%3A0xca6d49eb7baace15!2sVapi%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1714549822269!5m2!1sen!2sin"
                width="100%"
                height="500"
                style={{
                  border: 0,
                  borderRadius: "8px",
                }}
                loading="lazy"
                title="Google Maps - Vapi, Gujarat"
              ></iframe>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
