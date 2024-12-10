"use client";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebar-nav";
import { userService } from "@/services/user.service";
import { doctorService } from "@/services/doctor.service";
import { IDoctor } from "@/types/doctor/doctor";
import { useUserContext } from "@/context/user";
import { Progress } from "@/components/ui/progress";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [doctor, setDoctor] = useState<IDoctor | undefined>(undefined);
  const { user, setUser } = useUserContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getcurrentUser();
        setUser(userData);

        if (userData.doctor_id) {
          const doctorData = await doctorService.getDoctorDetail({
            id: userData.doctor_id,
          });
          setDoctor(doctorData);
        }

        const profileData = await doctorService.getProfileCount({
          id: userData.doctor_id,
        });
        setDoctor(profileData);
      } catch (error) {}
    };

    fetchUserData();
  }, []);

  const sidebarNavItems = [
    {
      title: "Personal & Contact Details",
      href: `/doctors/${user?.doctor_id}/edit/personal-contact-details`,
    },
    {
      title: "Education & Specialization",
      href: `/doctors/${user?.doctor_id}/edit/education-specialization`,
    },
    {
      title: "Registration & Documents",
      href: `/doctors/${user?.doctor_id}/edit/registration-documents`,
    },
    {
      title: "Establishments",
      href: `/doctors/${user?.doctor_id}/edit/establishment`,
    },
    {
      title: "Fees & Timings",
      href: `/doctors/${user?.doctor_id}/edit/establishments-fees-timings`,
    },
  ];

  return (
    <>
      <div className="main-section">
        <div className="mt-1">
          <div className="relative isolate lg:px-8">
            <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
          </div>
        </div>
        <div className="space-y-6 p-10 pb-16 md:block mt-10">
          <div className="flex justify-between">
            <div className="left-section w-4/5">
              <div className="space-y-0.5">
                <h2 className="  text-3xl tracking-tight">Profile Details</h2>
                <p className="  text-muted-foreground">
                  Manage your account settings and set e-mail preferences.
                </p>
              </div>
            </div>
            <div className="right-section w-1/5">
              <div className="space-y-0.5">
                <h2 className="  text-2xl tracking-tight mb-3 font-medium">
                  <span className="  text-teal-600 text-3xl font-semibold mr-2">
                    {doctor?.profile_completion_percentage}%
                  </span>{" "}
                  Profile Complete
                </h2>
              </div>
              <Progress
                value={doctor?.profile_completion_percentage}
                className="h-3"
              />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5 py-3">
              <SidebarNav items={sidebarNavItems} className="flex flex-col " />
            </aside>
            <div className="flex-auto">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
