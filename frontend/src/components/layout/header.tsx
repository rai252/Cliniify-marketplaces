"use client";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, User, LogOut, Bell } from "react-feather";
import { FaChevronDown } from "react-icons/fa";
import { userService } from "@/services/user.service";
import { patientService } from "@/services/patient.service";
import { doctorService } from "@/services/doctor.service";
import { IUser } from "@/types/user/user";
import { IPatient } from "@/types/patient/patient";
import { IDoctor } from "@/types/doctor/doctor";
import { useUserContext } from "@/context/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
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
      <div className="bg-white relative z-50 mt-2">
        <header className="fixed inset-x-0 top-0 z-50 bg-white w-full ">
          <div className="container">
            <nav
              className="flex items-center justify-between p-4"
              aria-label="Global"
            >
              <div className="flex lg:flex-1">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Cliniify Marketplace</span>
                  <Image
                    className="h-12 w-auto"
                    src="/images/logo/cliniify_logo_black.png"
                    alt=""
                    width={180}
                    height={150}
                  />
                </a>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  aria-expanded={isMobileMenuOpen}
                  onClick={toggleMobileMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>
              </div>

              <div className="hidden lg:flex lg:gap-x-11">
                <Link
                  href={`/`}
                  className="font-Inter text-sm font-medium leading-6 text-gray-600"
                  passHref
                >
                  <p
                    className={`font-Inter text-base text-gray-800 ${
                      pathname === `/` ? "active text-teal-700" : ""
                    }`}
                  >
                    Home
                  </p>
                </Link>
                {/* <Link
                  href={`/doctors`}
                  className="font-Inter text-sm font-medium leading-6 text-gray-600"
                  passHref
                >
                  <p
                    className={`font-Inter text-base text-gray-800 ${
                      pathname === `/doctors` ? "active text-teal-700" : ""
                    }`}
                  >
                    Find Doctors
                  </p>
                </Link> */}
                <Link
                  href={`/about-us`}
                  className="font-Inter text-sm font-medium leading-6 text-gray-600"
                  passHref
                >
                  <p
                    className={`font-Inter text-base text-gray-800 ${
                      pathname === `/about-us` ? "active text-teal-700" : ""
                    }`}
                  >
                    About Us
                  </p>
                </Link>
                <Link
                  href={`/doctor`}
                  className="font-Inter text-sm font-medium leading-6 text-gray-600"
                  passHref
                >
                  <p
                    className={`font-Inter text-base text-gray-800 ${
                      pathname === `/doctor` ? "active text-teal-700" : ""
                    }`}
                  >
                    Doctor
                  </p>
                </Link>
                <Link
                  href={`/patient`}
                  className="font-Inter text-sm font-medium leading-6 text-gray-600"
                  passHref
                >
                  <p
                    className={`font-Inter text-base text-gray-800 ${
                      pathname === `/patient` ? "active text-teal-700" : ""
                    }`}
                  >
                    Patient
                  </p>
                </Link>

                <Link
                  href={`/blogs`}
                  className="font-Inter text-sm font-medium leading-6 text-gray-600"
                  passHref
                >
                  <p
                    className={`font-Inter text-base text-gray-800 ${
                      pathname === `/blogs` ? "active text-teal-700" : ""
                    }`}
                  >
                    Blogs
                  </p>
                </Link>
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
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
                                <div className="flex items-center">
                                  <Image
                                    className="h-10 w-10 rounded-full object-cover object-top"
                                    src={
                                      (patient?.avatar as string) ||
                                      "/images/image.png"
                                    }
                                    alt=""
                                    height={32}
                                    width={32}
                                  />
                                  <span className="font-Inter mr-1 text-base ml-2 text-black-200 mt-1">
                                    {patient?.full_name}
                                  </span>
                                  {/* <FaChevronDown className="h-3 w-3 ml-1 text-gray-500" /> */}
                                </div>
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
                                  className="font-Inter block px-4 py-2 text-base text-gray-700"
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
                                  className="font-Inter block px-4 py-2 text-base text-gray-700"
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
                                  src={
                                    (doctor?.avatar as string) ||
                                    "/images/image.png"
                                  }
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
                                  href={`/doctors/${user.doctor_id}/requests/`}
                                  className="  block px-4 py-2 text-base text-gray-700"
                                  role="menuitem"
                                  tabIndex={-1}
                                  id="user-menu-item-3"
                                >
                                  <Bell
                                    className="inline-block mr-2"
                                    style={{
                                      width: "1em",
                                      height: "1em",
                                    }}
                                  />
                                  Requests
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
                      <div className="login-register-button flex gap-1">
                        {/* Login Button */}
                        <Link href="/login">
                          <Button className="font-Inter bg-white border border-gray-800 hover:bg-gray-200 hover:text-black py-2 px-4 text-sm text-gray-800 font-small flex items-center gap-2">
                            <FontAwesomeIcon icon={faLock} />
                            <span>Login</span>
                          </Button>
                        </Link>
                        &nbsp;
                        {/* Register Button */}
                        <Link href="/register">
                          <Button className="font-Inter bg-teal-600 hover:bg-teal-700 py-2 px-4 text-sm text-white font-small flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} />
                            <span>Register</span>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden" role="dialog" aria-modal="true">
              <div className="fixed inset-0 z-50"></div>
              <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center place-content-between	">
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Cliniify Marketplace</span>
                    <Image
                      className="h-8 w-auto"
                      src="/images/logo/cliniify_logo_black.png"
                      alt=""
                      width={180}
                      height={150}
                    />
                  </a>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      <a
                        href="/"
                        className="-mx-3   block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Home
                      </a>
                      {/* <a
                        href="/doctors"
                        className="-mx-3   block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Find Doctors
                      </a> */}
                      <a
                        href="/about-us"
                        className="-mx-3   block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        About Us
                      </a>
                      <a
                        href="/patient"
                        className="-mx-3   block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Patient
                      </a>
                      <a
                        href="/doctor"
                        className="-mx-3   block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Doctor
                      </a>
                      <a
                        href="/blogs"
                        className="-mx-3   block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Blogs
                      </a>
                      <br></br>
                      <a>
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
                                        <span className="sr-only">
                                          Open user menu
                                        </span>
                                        <Image
                                          className="h-8 w-8 rounded-full object-cover object-top"
                                          src={
                                            (patient?.avatar as string) ||
                                            "/images/image.png"
                                          }
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
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
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
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
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
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
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
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
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
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
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
                                      {/* Button triggers the dropdown */}
                                      <button
                                        type="button"
                                        className="relative flex items-center rounded-full bg-transparent text-sm"
                                        id="user-menu-button"
                                        aria-expanded={isUserMenuOpen}
                                        onClick={toggleUserMenu} // Toggles the dropdown visibility
                                      >
                                        {/* Profile image */}
                                        <Image
                                          className="h-8 w-8 rounded-full object-cover object-top"
                                          src={
                                            doctor?.avatar ||
                                            "/images/image.png"
                                          }
                                          alt="Profile"
                                          width={32}
                                          height={32}
                                        />
                                        {/* Doctor's name */}
                                        <span className="  ml-2 text-base text-black-300">
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
                                        {/* Menu items */}
                                        <a
                                          href={`/doctors/${user.doctor_id}/appointments/`}
                                          className="  block px-4 py-2 text-base text-gray-700"
                                          role="menuitem"
                                          tabIndex={-1}
                                        >
                                          <Clock
                                            className="inline-block mr-2"
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
                                          />
                                          Appointments
                                        </a>
                                        <a
                                          href={`/doctors/${user.doctor_id}/edit/personal-contact-details/`}
                                          className="  block px-4 py-2 text-base text-gray-700"
                                          role="menuitem"
                                          tabIndex={-1}
                                        >
                                          <User
                                            className="inline-block mr-2"
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
                                          />
                                          Profile
                                        </a>
                                        <a
                                          href={`/doctors/${user.doctor_id}/stories/`}
                                          className="  block px-4 py-2 text-base text-gray-700"
                                          role="menuitem"
                                          tabIndex={-1}
                                        >
                                          <MessageSquare
                                            className="inline-block mr-2"
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
                                          />
                                          Feedbacks
                                        </a>
                                        <a
                                          href={`/doctors/${user.doctor_id.own_establishment}/requests/`}
                                          className="  block px-4 py-2 text-base text-gray-700"
                                          role="menuitem"
                                          tabIndex={-1}
                                        >
                                          <MessageSquare
                                            className="inline-block mr-2"
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
                                          />
                                          Requests
                                        </a>
                                        <a
                                          href={`/doctors/${user.doctor_id}/settings/change-password/`}
                                          className="  block px-4 py-2 text-base text-gray-700"
                                          role="menuitem"
                                          tabIndex={-1}
                                        >
                                          <User
                                            className="inline-block mr-2"
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
                                          />
                                          Settings
                                        </a>
                                        <a
                                          href="#"
                                          className="  block px-4 py-2 text-base text-gray-700"
                                          role="menuitem"
                                          tabIndex={-1}
                                          onClick={Logout}
                                        >
                                          <LogOut
                                            className="inline-block mr-2"
                                            style={{
                                              width: "1em",
                                              height: "1em",
                                            }}
                                          />
                                          Logout
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="login-register-button mt-10">
                                <Link href="/login">
                                  <Button className="font-Inter text-base bg-teal-600 font-medium">
                                    <FontAwesomeIcon icon={faUser} />
                                    Login
                                  </Button>
                                </Link>
                                &nbsp;
                                <Link href="/register">
                                  <Button className="font-Inter text-base hover:bg-teal-600 font-medium">
                                    Register
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
