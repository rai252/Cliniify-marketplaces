import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-5 ">
      <div className="container mx-auto px-6 py-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-4">
            <Image
              src="/images/logo/cliniify_logo_black.png"
              alt="Cliniify Logo"
              width={150}
              height={40}
              className="mb-4 h-11 w-auto"
            />
            <p className="text-black font-Inter mb-4 text-sm">
              AI-based Clinic Management Software To Make Your Work Easy And
              Efficient!
            </p>
          </div>

          {/* For Patients Section */}
          <div className="md:col-span-2">
            <h3 className="text-base font-Inter font-semibold text-gray-700 mb-4">
              For Patients
            </h3>
            <ul className="space-y-2 text-sm">
              {/* <li>
                <a
                  href="/doctors"
                  className="text-gray-800 font-Inter hover:text-teal-700"
                >
                  Find Doctors
                </a>
              </li> */}
              <li>
                <a
                  href="/about-us"
                  className="text-gray-800 font-Inter hover:text-teal-700"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/doctor"
                  className="text-gray-800 font-Inter hover:text-teal-700"
                >
                  Doctor
                </a>
              </li>
              <li>
                <a
                  href="/patient"
                  className="text-gray-800 font-Inter hover:text-teal-700"
                >
                  Patient
                </a>
              </li>
              <li>
                <a
                  href="/blogs"
                  className="text-gray-800 font-Inter hover:text-teal-700"
                >
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Our Resources Section */}
          <div className="md:col-span-2">
            <h3 className="text-base font-semibold font-Inter text-gray-700 mb-4">
              Our Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://cliniify.com/privacy-policy"
                  className="text-gray-800 font-Inter hover:text-teal-700"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://cliniify.com/terms-of-use"
                  className="text-gray-800 font-Inter hover:text-teal-700"
                >
                  Terms of use
                </a>
              </li>
              <li>
                <a
                  href="https://cliniify.com/cookies-policy"
                  className="text-gray-800 font-Inter hover:text-teal-700"
                >
                  Cookies Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="md:col-span-4">
            <h3 className="text-base font-semibold font-Inter text-gray-700 mb-4">
              Join Our Newsletter
            </h3>
            <div className="flex mb-6 gap-4">
              <input
                type="email"
                placeholder="Enter Email"
                className="flex-1 px-3 py-2 border border-teal-700-300 rounded-lg focus:outline-none text-sm"
              />

              <button className="px-4 py-2 bg-teal-700 text-white font-Inter rounded-lg hover:bg-teal-600  text-sm">
                Submit
              </button>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap -m-1.5">
              <div className="w-auto p-1.5">
                <a href="https://www.facebook.com/cliniify" target="_blank">
                  <div className="flex items-center justify-center w-9 h-9 border border-black hover:border-gray-900 rounded-full">
                    <svg
                      width="9"
                      height="16"
                      viewBox="0 0 9 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.81589 5.30371L5.81589 3.80371C5.81589 3.15371 5.97379 2.80371 7.07905 2.80371H8.44747V0.303711L6.34221 0.303711C3.71063 0.303711 2.658 1.95371 2.658 3.80371V5.30371H0.552734L0.552734 7.80371H2.658L2.658 15.3037H5.81589L5.81589 7.80371H8.13168L8.44747 5.30371H5.81589Z"
                        fill="black"
                      ></path>
                    </svg>
                  </div>
                </a>
              </div>
              <div className="w-auto p-1.5">
                <a
                  href="https://www.linkedin.com/in/cliniify-clinic-management-software-5b5916280/"
                  target="_blank"
                >
                  <div className="flex items-center justify-center w-9 h-9 border border-black hover:border-gray-900 rounded-full">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 0H5C2.24 0 0 2.24 0 5V19C0 21.76 2.24 24 5 24H19C21.76 24 24 21.76 24 19V5C24 2.24 21.76 0 19 0ZM7.12 20.5H3.56V8.98H7.12V20.5ZM5.34 7.48C4.11 7.48 3.13 6.51 3.13 5.28C3.13 4.05 4.11 3.07 5.34 3.07C6.57 3.07 7.55 4.05 7.55 5.28C7.55 6.51 6.57 7.48 5.34 7.48ZM20.5 20.5H16.94V14.94C16.94 13.77 16.91 12.31 15.38 12.31C13.82 12.31 13.54 13.57 13.54 14.85V20.5H9.98V8.98H13.36V10.56H13.41C13.87 9.66 15.09 8.69 16.81 8.69C20.01 8.69 20.5 11.14 20.5 14.03V20.5Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                </a>
              </div>
              <div className="w-auto p-1.5">
                <a href="https://www.instagram.com/cliniify/" target="_blank">
                  <div className="flex items-center justify-center w-9 h-9 border border-black hover:border-gray-900 rounded-full">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 0.803711C6.329 0.803711 6.056 0.813711 5.203 0.851711C4.35 0.891711 3.769 1.02571 3.26 1.22371C2.72609 1.42453 2.24249 1.73954 1.843 2.14671C1.43608 2.54641 1.12111 3.02995 0.92 3.56371C0.722 4.07171 0.587 4.65371 0.548 5.50371C0.51 6.35871 0.5 6.63071 0.5 8.80471C0.5 10.9767 0.51 11.2487 0.548 12.1017C0.588 12.9537 0.722 13.5347 0.92 14.0437C1.125 14.5697 1.398 15.0157 1.843 15.4607C2.287 15.9057 2.733 16.1797 3.259 16.3837C3.769 16.5817 4.349 16.7167 5.201 16.7557C6.055 16.7937 6.327 16.8037 8.5 16.8037C10.673 16.8037 10.944 16.7937 11.798 16.7557C12.649 16.7157 13.232 16.5817 13.741 16.3837C14.2746 16.1828 14.7578 15.8678 15.157 15.4607C15.602 15.0157 15.875 14.5697 16.08 14.0437C16.277 13.5347 16.412 12.9537 16.452 12.1017C16.49 11.2487 16.5 10.9767 16.5 8.80371C16.5 6.63071 16.49 6.35871 16.452 5.50471C16.412 4.65371 16.277 4.07171 16.08 3.56371C15.8789 3.02994 15.5639 2.54639 15.157 2.14671C14.7576 1.73939 14.274 1.42436 13.74 1.22371C13.23 1.02571 12.648 0.890711 11.797 0.851711C10.943 0.813711 10.672 0.803711 8.498 0.803711H8.501H8.5ZM7.783 2.24571H8.501C10.637 2.24571 10.89 2.25271 11.733 2.29171C12.513 2.32671 12.937 2.45771 13.219 2.56671C13.592 2.71171 13.859 2.88571 14.139 3.16571C14.419 3.44571 14.592 3.71171 14.737 4.08571C14.847 4.36671 14.977 4.79071 15.012 5.57071C15.051 6.41371 15.059 6.66671 15.059 8.80171C15.059 10.9367 15.051 11.1907 15.012 12.0337C14.977 12.8137 14.846 13.2367 14.737 13.5187C14.6087 13.8661 14.404 14.1801 14.138 14.4377C13.858 14.7177 13.592 14.8907 13.218 15.0357C12.938 15.1457 12.514 15.2757 11.733 15.3117C10.89 15.3497 10.637 15.3587 8.501 15.3587C6.365 15.3587 6.111 15.3497 5.268 15.3117C4.488 15.2757 4.065 15.1457 3.783 15.0357C3.4355 14.9076 3.12113 14.7033 2.863 14.4377C2.59675 14.1797 2.39172 13.8654 2.263 13.5177C2.154 13.2367 2.023 12.8127 1.988 12.0327C1.95 11.1897 1.942 10.9367 1.942 8.79971C1.942 6.66371 1.95 6.41171 1.988 5.56871C2.024 4.78871 2.154 4.36471 2.264 4.08271C2.409 3.70971 2.583 3.44271 2.863 3.16271C3.143 2.88271 3.409 2.70971 3.783 2.56471C4.065 2.45471 4.488 2.32471 5.268 2.28871C6.006 2.25471 6.292 2.24471 7.783 2.24371V2.24571ZM12.771 3.57371C12.6449 3.57371 12.5201 3.59854 12.4036 3.64679C12.2872 3.69503 12.1813 3.76574 12.0922 3.85489C12.003 3.94403 11.9323 4.04986 11.8841 4.16633C11.8358 4.28281 11.811 4.40764 11.811 4.53371C11.811 4.65978 11.8358 4.78461 11.8841 4.90109C11.9323 5.01756 12.003 5.12339 12.0922 5.21253C12.1813 5.30168 12.2872 5.37239 12.4036 5.42064C12.5201 5.46888 12.6449 5.49371 12.771 5.49371C13.0256 5.49371 13.2698 5.39257 13.4498 5.21253C13.6299 5.0325 13.731 4.78832 13.731 4.53371C13.731 4.2791 13.6299 4.03492 13.4498 3.85489C13.2698 3.67485 13.0256 3.57371 12.771 3.57371ZM8.501 4.69571C7.95607 4.68721 7.41489 4.7872 6.90898 4.98985C6.40306 5.19251 5.94251 5.49378 5.55415 5.87613C5.16579 6.25849 4.85736 6.71428 4.64684 7.21697C4.43632 7.71966 4.3279 8.25921 4.3279 8.80421C4.3279 9.34921 4.43632 9.88876 4.64684 10.3915C4.85736 10.8941 5.16579 11.3499 5.55415 11.7323C5.94251 12.1146 6.40306 12.4159 6.90898 12.6186C7.41489 12.8212 7.95607 12.9212 8.501 12.9127C9.57954 12.8959 10.6082 12.4556 11.365 11.687C12.1217 10.9183 12.5459 9.88288 12.5459 8.80421C12.5459 7.72554 12.1217 6.69012 11.365 5.92146C10.6082 5.1528 9.57954 4.71254 8.501 4.69571ZM8.501 6.13671C9.20833 6.13671 9.88669 6.4177 10.3869 6.91786C10.887 7.41802 11.168 8.09638 11.168 8.80371C11.168 9.51104 10.887 10.1894 10.3869 10.6896C9.88669 11.1897 9.20833 11.4707 8.501 11.4707C7.79367 11.4707 7.11531 11.1897 6.61515 10.6896C6.11499 10.1894 5.834 9.51104 5.834 8.80371C5.834 8.09638 6.11499 7.41802 6.61515 6.91786C7.11531 6.4177 7.79367 6.13671 8.501 6.13671Z"
                        fill="black"
                      ></path>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Download Apps Section */}
        <div className="flex flex-wrap gap-2 justify-start mb-4">
          <a href="#" className="inline-block">
            <Image
              src="/images/ios-app.png"
              alt="iOS App"
              width={100}
              height={30}
              className="w-full h-full"
            />
          </a>
          <a href="#" className="inline-block">
            <Image
              src="/images/google-app.png"
              alt="Android App"
              width={100}
              height={30}
              className="w-full h-full"
            />
          </a>
        </div>
      </div>

      {/* Copyright */}

      <div className="text-center text-sm text-gray-800 pt-4 border-t">
        <p>Copyright © 2024 Cliniify. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;