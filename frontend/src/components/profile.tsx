"use client";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, User, LogOut } from "react-feather";
import { userService } from "@/services/user.service";
import { patientService } from "@/services/patient.service";
import { doctorService } from "@/services/doctor.service";
import { IUser } from "@/types/user/user";
import { IPatient } from "@/types/patient/patient";
import { IDoctor } from "@/types/doctor/doctor";
import { useUserContext } from "@/context/user";

export default function Navbar() {
  const router = useRouter();
  const { user, setUser } = useUserContext();
  const [patient, setPatient] = useState<IPatient | undefined>(undefined);
  const [doctor, setDoctor] = useState<IDoctor | undefined>(undefined);
  const [logout, setLogout] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingCurrentUser(true);
      try {
        const userData = await userService.getcurrentUser();
        setUser(userData);
        setLoadingCurrentUser(false);

        if (userData.patient_id) {
          const patientData = await patientService.getPatient({
            patientid: userData.patient_id,
          });
          setPatient(patientData);
        }

        if (userData.doctor_id) {
          const doctorData = await doctorService.getDoctorDetail({
            id: userData.doctor_id,
          });
          setDoctor(doctorData);
        }
      } catch (error) {
      } finally {
        setLoadingCurrentUser(false);
      }
    };

    fetchUserData();
  }, []);

  const Logout = () => {
    if (!logout) {
      try {
        const accessToken = Cookies.get("accessToken");
        Cookies.remove("accessToken");
        setUser({} as IUser);
        setLogout(true);
        toast.success("Logout successfully!");
        router.push(`/login`);
      } catch (error) {
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const userMenuButton = document.getElementById("user-menu-button");
        if (userMenuButton && !userMenuButton.contains(event.target as Node)) {
          setIsUserMenuOpen(false);
        }
      }

      if (isMobileMenuOpen) {
        const mobileMenuButton = document.getElementById("mobile-menu-button");
        if (
          mobileMenuButton &&
          !mobileMenuButton.contains(event.target as Node)
        ) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isUserMenuOpen, isMobileMenuOpen]);

  return (
    <>
      {loadingCurrentUser ? (
        <>loading...</>
      ) : (
        <>
          {" "}
          {user ? (
            <>
              {user.patient_id && (
                <div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="relative flex rounded-full bg-transparent text-sm"
                      id="user-menu-button"
                      aria-expanded={isUserMenuOpen}
                      onClick={toggleUserMenu}
                    >
                      <span className="absolute -inset-1.5"></span>
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full object-cover object-top"
                        src={(patient?.avatar as string) || "/images/image.png"}
                        alt=""
                        height={32}
                        width={32}
                      />
                      <span className="  mr-1 text-base ml-2 text-black-200 mt-1">
                        {patient?.full_name}
                      </span>
                    </button>
                  </div>

                  {isUserMenuOpen && (
                    <div
                      className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <a
                        href={`/patients/${user.patient_id}/appointments/`}
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-0"
                      >
                        <Clock
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        My Appointments
                      </a>
                      <a
                        href={`/patients/${user.patient_id}/feedbacks/`}
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-1"
                      >
                        <MessageSquare
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        My Feedback
                      </a>
                      <a
                        href={`/patients/${user.patient_id}/edit-profile/`}
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-2"
                      >
                        <User
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        Update Profile
                      </a>
                      <a
                        href={`/patients/${user.patient_id}/settings/change-password/`}
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-2"
                      >
                        <User
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        Settings
                      </a>
                      <a
                        href="#"
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-1"
                        onClick={Logout}
                      >
                        <LogOut
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        Logout
                      </a>
                    </div>
                  )}
                </div>
              )}

              {user.doctor_id && (
                <div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="relative flex rounded-full bg-transparent text-sm"
                      id="user-menu-button"
                      aria-expanded={isUserMenuOpen}
                      onClick={toggleUserMenu}
                    >
                      <span className="absolute -inset-1.5"></span>
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full object-cover object-top"
                        src={(doctor?.avatar as string) || "/images/image.png"}
                        alt=""
                        width={32}
                        height={32}
                      />
                      <span className="  mr-1 text-base ml-2 text-black-300 mt-1">
                        {doctor?.full_name}
                      </span>
                    </button>
                  </div>

                  {isUserMenuOpen && (
                    <div
                      className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <a
                        href={`/doctors/${user.doctor_id}/appointments/`}
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-0"
                      >
                        <Clock
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        Appointments
                      </a>
                      <a
                        href={`/doctors/${user.doctor_id}/edit/personal-contact-details/`}
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-0"
                      >
                        <User
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        Profile
                      </a>
                      <a
                        href={`/doctors/${user.doctor_id}/stories/`}
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-0"
                      >
                        <MessageSquare
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        feedbacks
                      </a>
                      <a
                        href={`/doctors/${user.doctor_id}/settings/change-password/`}
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-2"
                      >
                        <User
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        Settings
                      </a>
                      <a
                        href="#"
                        className="  block px-4 py-2 text-base text-gray-700"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-1"
                        onClick={Logout}
                      >
                        <LogOut
                          className="inline-block mr-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                        Logout
                      </a>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="login-register-button">
              <Link href="/login">
                <Button className="  text-base bg-teal-600 font-medium">
                  Login
                </Button>
              </Link>
              &nbsp;
              <Link href="/register">
                <Button className="  text-base hover:bg-teal-600 font-medium">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
}
