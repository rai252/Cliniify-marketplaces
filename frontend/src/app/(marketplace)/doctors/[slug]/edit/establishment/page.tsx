"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import CreateEstablishment from "./components/establishmentForm";
import SearchEstablishmentForm from "./components/SearchEstablishmentForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { establishmentService } from "@/services/establishment.service";
import toast from "react-hot-toast";

const EstablishmentForm = () => {
  const params = useParams<{ id: string; slug: string }>();
  const [ownEstablishment, setOwnEstablishment] = useState(false);
  const [workAtEstablishment, setWorkAtEstablishment] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOwnEstablishmentChange = () => {
    setOwnEstablishment(!ownEstablishment);
    setWorkAtEstablishment(false);
    setDialogOpen(false);
  };

  const handleWorkAtEstablishmentChange = () => {
    setWorkAtEstablishment(!workAtEstablishment);
    setOwnEstablishment(false);
    setDialogOpen(workAtEstablishment ? false : true);
  };

  const handleSubmitOnboardRequest = async (establishmentId: string) => {
    try {
      await establishmentService.sendOnboardRequest({
        establishment_id: establishmentId,
      });
      toast.success("Onboard request sent successfully");
    } catch (error) {
      toast.error("Request already sent to this establishment owner");
    }
  };

  const handleResults = (data: any) => {
    setResults(data.suggestions || []);
    setDialogOpen(false);
  };

  return (
    <div>
      <h2 className="  text-2xl font-medium">Establishment Form</h2>
      <div className="mt-2">
        <input
          type="checkbox"
          id="own-establishment"
          checked={ownEstablishment}
          onChange={handleOwnEstablishmentChange}
        />
        <label htmlFor="own-establishment" className="  text-lg ml-1">
          I own an establishment
        </label>
      </div>
      <div>
        <input
          type="checkbox"
          id="work-at-establishment"
          checked={workAtEstablishment}
          onChange={handleWorkAtEstablishmentChange}
        />
        <label htmlFor="work-at-establishment" className="  text-lg ml-1">
          I work at an establishment
        </label>
      </div>
      {ownEstablishment && <CreateEstablishment params={params as any} />}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="hidden">Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <SearchEstablishmentForm onResults={handleResults} />
        </DialogContent>
      </Dialog>
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Results:</h2>
          <ul className="list-none mb-0">
            {results.map((result: any) => (
              <li key={result.id} className="mb-4">
                <div className="flex flex-col">
                  <span className="text-gray-700 text-xl font-semibold">
                    {result.name}
                  </span>
                  <span className="text-gray-500 text-lg">{result.owner}</span>
                  <span className="text-gray-500">{result.city}</span>
                </div>
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-2"
                  type="button"
                  onClick={() => handleSubmitOnboardRequest(result.id)}
                >
                  Submit Onboard Request
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EstablishmentForm;
