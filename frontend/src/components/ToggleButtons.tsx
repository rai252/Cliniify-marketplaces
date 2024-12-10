"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { establishmentService } from "@/services/establishment.service";
import Loading from "./loader";

export default function ButtonsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [data, setData] = useState<any>(null);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const fetchedData = await establishmentService.getEstablishmentDetail({
        id: slug,
      });
      setData(fetchedData);
      setIsLoading(false);
    };

    fetchData();
  }, [slug]);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col sm:flex-row mb-5">
        <div className="flex flex-wrap -mx-1">
          <div className="w-1/2 px-1 mb-2 sm:w-auto sm:mb-0">
            <Link href={`/establishment/${slug}/`} passHref>
              <Button
                className={`w-full   text-black bg-slate-100 hover:bg-slate-200 ${
                  pathname === `/establishment/${slug}`
                    ? "active bg-teal-600 text-white hover:text-teal-600"
                    : ""
                }`}
              >
                Information
              </Button>
            </Link>
          </div>
          <div className="w-1/2 px-1 mb-2 sm:w-auto sm:mb-0">
            <Link href={`/establishment/${slug}/doctors`} passHref>
              <Button
                className={`w-full   text-black bg-slate-100 hover:bg-slate-200 ${
                  pathname === `/establishment/${slug}/doctors`
                    ? "active bg-teal-600 text-white hover:text-teal-600"
                    : ""
                }`}
              >
                Doctors
              </Button>
            </Link>
          </div>
          <div className="w-1/2 px-1 mb-2 sm:w-auto sm:mb-0">
            <Link href={`/establishment/${slug}/services/`} passHref>
              <Button
                className={`w-full   text-black bg-slate-100 hover:bg-slate-200 ${
                  pathname === `/establishment/${slug}/services`
                    ? "active bg-teal-600 text-white hover:text-teal-600"
                    : ""
                }`}
              >
                Services
              </Button>
            </Link>
          </div>
          <div className="w-1/2 px-1 mb-2 sm:w-auto sm:mb-0">
            <Link href={`/establishment/${slug}/images`} passHref>
              <Button
                className={`w-full   text-black bg-slate-100 hover:bg-slate-200 ${
                  pathname === `/establishment/${slug}/images`
                    ? "active bg-teal-600 text-white hover:text-teal-600"
                    : ""
                }`}
              >
                Images
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
