import SearchComponent from "@/components/search-box";
import React from "react";

const SearchSection = () => {
  return (
    <div className="relative isolate lg:px-30 z-20">
      <div className="mx-auto container flex justify-center flex-col-reverse sm:flex-row h-full lg:h-[450px]">
        <div className="sm:w-5/7 sm:mr-10 flex flex-col justify-center mt-16 lg:mt-24 sm:py-24">
          <div
            className="banner-header text-center wow animate__zoomIn"
            data-wow-duration="500ms"
            data-wow-delay="100ms"
          >
            <h1 className="text-3xl sm:text-3xl text-gray-700 font-bold">
              Search Doctor, Make an Appointment
            </h1>
            <p className="text-lg sm:text-lg text-gray-800 mt-3">
              Discover the best doctors, clinics & hospitals nearest to you.
            </p>
          </div>

          <div
            className="relative wow animate__fadeInUp"
            data-wow-duration="500ms"
            data-wow-delay="250ms"
            style={{ marginLeft: "80px" }}
          >
            <SearchComponent />
          </div>
        </div>
      </div>

      <div
        className="text-center mt-[-40px] wow animate__fadeIn"
        data-wow-delay="100ms"
      >
        <img
          src="/images/search-bg-clini.png"
          alt="Cityscape"
          className="w-100 h-auto mx-auto"
        />
      </div>
    </div>
  );
};

export default SearchSection;
