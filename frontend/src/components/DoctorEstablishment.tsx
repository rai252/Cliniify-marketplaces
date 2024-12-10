"use client";

import { IEstablishment } from "@/types/establishment/establishment";
import { establishmentService } from "@/services/establishment.service";
import { useState, useEffect } from "react";

interface DoctorEstablishmentProps {
  owned_establishment: number;
}

const DoctorEstablishment: React.FC<DoctorEstablishmentProps> = ({
  owned_establishment,
}) => {
  const [establishment, setEstablishment] = useState<IEstablishment | null>(
    null
  );

  useEffect(() => {
    const fetchEstablishment = async () => {
      const establishmentData =
        await establishmentService.getEstablishmentDetail({
          id: owned_establishment,
          expand: "address",
        });
      setEstablishment(establishmentData);
    };
    fetchEstablishment();
  }, [owned_establishment]);

  return (
    <>
      {establishment && (
        <div className="mb-4 sm:mr-0 w-full">
          <p className="text-md text-teal-800">Establishment</p>
          <p className="text-sm sm:text-lg text-gray-700 ">
            <span className="text-sm text-black">Name:&nbsp;</span>
            <span className="text-sm text-gray-700">{establishment.name}</span>
          </p>
          <p className="text-sm sm:text-lg text-gray-700 ">
            <span className="text-sm text-black">Address:&nbsp;</span>
            <span className="text-sm text-gray-700">
              {establishment.address?.address_line_1 &&
                establishment.address.address_line_1 + ", "}
              {establishment.address?.address_line_2 &&
                establishment.address.address_line_2 + ", "}
              {establishment.address?.city && establishment.address.city + ", "}
              {establishment.address?.state}
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default DoctorEstablishment;
