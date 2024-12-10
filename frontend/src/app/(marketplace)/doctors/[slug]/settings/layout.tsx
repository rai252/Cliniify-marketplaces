"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./components/doctorSideBar";
import { userService } from "@/services/user.service";
import { doctorService } from "@/services/doctor.service";
import { IDoctor } from "@/types/doctor/doctor";
import { useUserContext } from "@/context/user";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/user/user";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

type UserState = IUser | null;

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const router = useRouter();
  const [doctor, setDoctor] = useState<IDoctor | undefined>(undefined);
  const [user, setUser] = useState<UserState>(null);
  const [logout, setLogout] = useState(false);

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
      } catch (error) {}
    };

    fetchUserData();
  }, []);

  const Logout = async () => {
    if (!logout) {
      try {
        const accessToken = Cookies.get("accessToken");
        Cookies.remove("accessToken");
        setUser(null);
        setLogout(true);
        await router.push(`/login`);
        toast.success("Logout successfully!");
        setTimeout(() => {
          window.location.href = "/"; // This will navigate to '/' and reload the page
        }, 100);
      } catch (error) {
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  const sidebarNavItems = [
    {
      title: "Change Password",
      href: `/doctors/${user?.doctor_id}/settings/change-password`,
    },
    {
      title: "Delete Account",
      href: `/doctors/${user?.doctor_id}/settings/delete-account`,
    },
    {
      title: "Logout",
      onClick: Logout,
    },
  ];

  return (
    <>
      <div className="main-section px-1 sm:px-12">
        <div className="mt-1">
          <div className="relative isolate lg:px-8">
            <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5 bg-slate-200"></div>
          </div>
        </div>
        <div className="space-y-6 p-10 pb-16 md:block mt-16 mb-8 bg-slate-50 shadow-md">
          <div className="space-y-0.5">
            <h2 className="  text-3xl tracking-tight">Settings</h2>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5 py-3">
              <Sidebar items={sidebarNavItems} />
            </aside>
            <div className="flex-auto">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
