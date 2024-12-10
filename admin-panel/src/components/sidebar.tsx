import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import { useAppDispatch } from '@/store';
// import { logout } from '@/store/auth/logout';
import { FiMenu } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { GiHospital } from "react-icons/gi";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <aside
      className={`flex flex-col justify-between bg-gray-800 text-white space-y-4 transition-all duration-300 ease-in-out  ${
        isSidebarOpen ? "w-56" : "w-20"
      }`}
    >
      {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          />
      )}
      <div
        className={`flex flex-col text-gray-300 bg-gray-800 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-56" : "w-20"
        }`}
      >
        <button
          className={`${isSidebarOpen ? "p-5" : "px-5 py-5 ml-2"} flex items-center bg-gray-800 hover:text-gray-100 hover:bg-opacity-50 focus:outline-none focus:text-gray-100 focus:bg-opacity-50 overflow-hidden`}
          onClick={toggleSidebar}
        >
          <FiMenu className="h-5 w-5 flex-shrink-0" />
          <span
            className={`ml-2 text-md font-medium duration-300 ease-in-out `}
          >
            {isSidebarOpen ? <span className="ml-2">CM Admin Panel</span> : <></>}
          </span>
        </button>
        <div className="bg-gray-600 h-[1px]"></div>
        <nav className="flex flex-col p-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-white hover:bg-gray-700 hover:text-teal-200"
              } px-3 py-2 rounded-md text-sm font-medium`
            }
          >
            {isSidebarOpen ? (
              <>
                <div className="flex justify-start">
                  <MdDashboard className="h-4 w-4 text-sm flex-shrink-0 mt-1" />
                  &nbsp;
                  <span className="mt-1">Dashboard</span>
                </div>
              </>
            ) : (
              <>
                <MdDashboard className="h-4 w-4 text-sm flex-shrink-0 ml-1" />
              </>
            )}
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-white hover:bg-gray-700 hover:text-teal-200"
              } px-3 py-2 rounded-md text-sm font-medium`
            }
          >
            {isSidebarOpen ? (
              <>
                <div className="flex justify-start">
                  <FaUserDoctor className="h-4 w-4 text-sm flex-shrink-0 mt-1" />
                  &nbsp;
                  <span className="mt-1">Doctors</span>
                </div>
              </>
            ) : (
              <>
                <FaUserDoctor className="h-4 w-4 text-sm flex-shrink-0 ml-1" />
              </>
            )}
          </NavLink>
          <NavLink
            to="/establishments"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-white hover:bg-gray-700 hover:text-teal-200"
              } px-3 py-2 rounded-md text-sm font-medium`
            }
          >
            {isSidebarOpen ? (
              <>
                <div className="flex justify-start">
                  <GiHospital className="h-4 w-4 text-sm flex-shrink-0 mt-1" />
                  &nbsp;
                  <span className="mt-1">Establishments</span>
                </div>
              </>
            ) : (
              <>
                <GiHospital className="h-4 w-4 text-sm flex-shrink-0 ml-1" />
              </>
            )}
          </NavLink>
          <NavLink
            to="/patients"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-white hover:bg-gray-700 hover:text-teal-200"
              } px-3 py-2 rounded-md text-sm font-medium`
            }
          >
            {isSidebarOpen ? (
              <>
                <div className="flex justify-start">
                  <span className="text-sm flex-shrink-0 py-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M14 20H6q-.825 0-1.412-.587T4 18v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q.5 0 1 .038t1 .112zm-2-8q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m6 7h-1q-.425 0-.712-.288T16 18v-4q0-.425.288-.712T17 13h3.775q.425 0 .65.35t.025.725L20 17h.7q.425 0 .637.375t.013.75l-2.875 5.05q-.1.175-.288.125T18 23.05z"
                      />
                    </svg>
                  </span>
                  &nbsp;
                  <span className="mt-1">Patients</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm flex-shrink-0 py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M14 20H6q-.825 0-1.412-.587T4 18v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q.5 0 1 .038t1 .112zm-2-8q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m6 7h-1q-.425 0-.712-.288T16 18v-4q0-.425.288-.712T17 13h3.775q.425 0 .65.35t.025.725L20 17h.7q.425 0 .637.375t.013.75l-2.875 5.05q-.1.175-.288.125T18 23.05z"
                    />
                  </svg>
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-white hover:bg-gray-700 hover:text-teal-200"
              } px-3 py-2 rounded-md text-sm font-medium`
            }
          >
            {isSidebarOpen ? (
              <>
                <div className="flex justify-start">
                  <span className="text-sm flex-shrink-0 py-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M20.954 10.667c-.072-.322-.272-.621-.502-.745c-.07-.039-.522-.088-1.004-.109c-.809-.036-.898-.052-1.152-.201c-.405-.237-.516-.493-.518-1.187c-.002-1.327-.554-2.559-1.646-3.67c-.776-.793-1.645-1.329-2.634-1.629c-.236-.072-.768-.097-2.545-.118c-2.787-.033-3.405.024-4.356.402c-1.748.697-3.008 2.166-3.465 4.05c-.087.353-.103.92-.124 4.177c-.025 4.08.004 4.68.258 5.488c.212.668.425 1.077.861 1.657c.835 1.108 2.083 1.907 3.334 2.133c.595.107 7.931.135 8.683.032c1.306-.178 2.331-.702 3.293-1.684c.694-.71 1.129-1.479 1.414-2.499c.117-.424.127-.63.149-3.117c.017-1.878.002-2.758-.046-2.98M8.007 8.108c.313-.316.399-.329 2.364-.329c1.764 0 1.822.004 2.081.134c.375.189.538.456.538.88c0 .384-.153.653-.493.869c-.184.115-.293.123-2.021.133c-1.067.007-1.916-.013-2.043-.048c-.669-.184-.918-1.143-.426-1.639m7.706 8.037l-.597.098l-3.114.035c-2.736.033-3.511-.018-3.652-.08c-.288-.124-.554-.472-.602-.78c-.042-.292.104-.696.33-.9c.285-.257.409-.266 3.911-.27c3.602-.002 3.583-.003 3.925.315c.482.45.381 1.251-.201 1.582"
                      />
                    </svg>
                  </span>
                  &nbsp;
                  <span className="mt-1">Blogs</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm flex-shrink-0 py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M20.954 10.667c-.072-.322-.272-.621-.502-.745c-.07-.039-.522-.088-1.004-.109c-.809-.036-.898-.052-1.152-.201c-.405-.237-.516-.493-.518-1.187c-.002-1.327-.554-2.559-1.646-3.67c-.776-.793-1.645-1.329-2.634-1.629c-.236-.072-.768-.097-2.545-.118c-2.787-.033-3.405.024-4.356.402c-1.748.697-3.008 2.166-3.465 4.05c-.087.353-.103.92-.124 4.177c-.025 4.08.004 4.68.258 5.488c.212.668.425 1.077.861 1.657c.835 1.108 2.083 1.907 3.334 2.133c.595.107 7.931.135 8.683.032c1.306-.178 2.331-.702 3.293-1.684c.694-.71 1.129-1.479 1.414-2.499c.117-.424.127-.63.149-3.117c.017-1.878.002-2.758-.046-2.98M8.007 8.108c.313-.316.399-.329 2.364-.329c1.764 0 1.822.004 2.081.134c.375.189.538.456.538.88c0 .384-.153.653-.493.869c-.184.115-.293.123-2.021.133c-1.067.007-1.916-.013-2.043-.048c-.669-.184-.918-1.143-.426-1.639m7.706 8.037l-.597.098l-3.114.035c-2.736.033-3.511-.018-3.652-.08c-.288-.124-.554-.472-.602-.78c-.042-.292.104-.696.33-.9c.285-.257.409-.266 3.911-.27c3.602-.002 3.583-.003 3.925.315c.482.45.381 1.251-.201 1.582"
                    />
                  </svg>
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/specalizations"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-white hover:bg-gray-700 hover:text-teal-200"
              } px-3 py-2 rounded-md text-sm font-medium`
            }
          >
            {isSidebarOpen ? (
              <>
                <div className="flex justify-start">
                  <span className="text-sm flex-shrink-0 py-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm8.6-3.3l2.3-1.75l2.3 1.75l-.85-2.85l2.3-1.85H15.8l-.9-2.8L14 12h-2.85l2.3 1.85z"
                      />
                    </svg>
                  </span>
                  &nbsp;
                  <span className="mt-1">Specializations</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm flex-shrink-0 py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm8.6-3.3l2.3-1.75l2.3 1.75l-.85-2.85l2.3-1.85H15.8l-.9-2.8L14 12h-2.85l2.3 1.85z"
                    />
                  </svg>
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/sales-user"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-white hover:bg-gray-700 hover:text-teal-200"
              } px-3 py-2 rounded-md text-sm font-medium`
            }
          >
            {isSidebarOpen ? (
              <>
                <div className="flex justify-start">
                  <span className="text-sm flex-shrink-0 py-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="4"
                      >
                        <path d="M41 14L24 4L7 14v20l17 10l17-10z" />
                        <path
                          strokeLinecap="round"
                          d="M24 22v8m8-12v12m-16-4v4"
                        />
                      </g>
                    </svg>
                  </span>
                  &nbsp;
                  <span className="mt-1">Sales</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm flex-shrink-0 py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    >
                      <path d="M41 14L24 4L7 14v20l17 10l17-10z" />
                      <path
                        strokeLinecap="round"
                        d="M24 22v8m8-12v12m-16-4v4"
                      />
                    </g>
                  </svg>
                </span>
              </>
            )}
          </NavLink>
        </nav>
        {/* <div className="border-t border-gray-700 p-4 font-medium mt-auto">
          <button
            className="flex items-center h-10 px-3 hover:text-red-500 hover:bg-gray-600 hover:bg-opacity-25 rounded-lg transition-colors w-full duration-150 ease-in-out focus:outline-none focus:shadow-outline"
            onClick={handleLogout}
          >
            {isSidebarOpen ? (
              <>
                <div className="flex justify-center">
                  <FiLogOut className="h-6 w-6 flex-shrink-0" />
                  &nbsp;
                  <span>Logout</span>
                </div>
              </>
            ) : (
              <>
                <FiLogOut className="h-6 w-6 flex-shrink-0" />
              </>
            )}
          </button>
        </div> */}
      </div>
    </aside>
  );
};

export default Sidebar;
