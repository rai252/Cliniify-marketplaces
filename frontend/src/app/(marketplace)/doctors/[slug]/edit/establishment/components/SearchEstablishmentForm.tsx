import React, { useState, useEffect } from "react";
import { establishmentService } from "@/services/establishment.service";

const SearchEstablishmentForm = ({ onResults }: any) => {
  const [city, setCity] = useState<string>("");
  const [establishmentName, setEstablishmentName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form state when component mounts
    setCity("");
    setEstablishmentName("");
    setLoading(false);
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await establishmentService.searchEstablishment({
        city,
        name: establishmentName,
      });
      onResults(data);
    } catch (error) {
      setError("Error fetching establishments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="city"
          >
            City
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="establishmentName"
          >
            Name of Establishment
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="establishmentName"
            type="text"
            value={establishmentName}
            onChange={(e) => setEstablishmentName(e.target.value)}
            required
          />
        </div>
      </div>
      <button
        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
        disabled={loading}
      >
        {loading ? "Searching..." : "Submit"}
      </button>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    </form>
  );
};

export default SearchEstablishmentForm;
