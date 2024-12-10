import React, { useEffect, useState } from 'react';
import { useGetDoctorByIdQuery } from '@/services/doctors/doctor.service';
import { IDoctor } from '@/interfaces/doctor.interface';
import DoctorCard from '@/pages/sales/customCard/DoctorCard';

interface StaffListProps {
  staffIds: string[];
}

const StaffList: React.FC<StaffListProps> = ({ staffIds }) => {
  const [staffs, setStaffs] = useState<IDoctor[]>([]);

  const staffQueries = staffIds.map((staffId: string) =>
    useGetDoctorByIdQuery({ id: staffId, expand: 'address' }, { skip: staffIds.length === 0 })
  );

  useEffect(() => {
    const fetchStaffData = async () => {
      if (staffIds.length > 0 && !staffQueries.some((query) => query.isLoading)) {
        const staffData = await Promise.all(
          staffQueries
            .map((query) => query.data)
            .filter((data) => data !== undefined)
        );
        setStaffs(staffData as IDoctor[]);
      }
    };

    fetchStaffData();
  }, [staffIds, staffQueries]);

  return (
    <div className="bg-white rounded-lg overflow-hidden mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
        {staffs.length > 0 ? (
          staffs.map((staff) => <DoctorCard key={staff.id} doctor={staff} />)
        ) : (
          <p>No staff data available.</p>
        )}
      </div>
    </div>
  );
};

export default StaffList;