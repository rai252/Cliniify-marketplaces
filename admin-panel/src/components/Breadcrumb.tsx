import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

interface Breadcrumb {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <nav className="bg-gray-100 py-3 px-1 rounded">
      <ol className="list-reset flex justify-end">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-600">
                <IoIosArrowForward />
              </span>
            )}
            {breadcrumb.path ? (
              <Link
                to={breadcrumb.path}
                className="text-blue-600 hover:text-blue-800"
              >
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="text-gray-600">{breadcrumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
