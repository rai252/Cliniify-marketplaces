"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { doctorService } from "@/services/doctor.service";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ButtonsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [data, setData] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await doctorService.getDoctorDetail({ id: slug });
      setData(fetchedData);
    };

    fetchData();
  }, [slug]);

  return (
    <div className="buttons">
      <Link href={`/doctors/${data?.slug}/`} passHref>
        <Button
          className={`  text-black bg-slate-100 hover:bg-slate-200 ${
            pathname === `/doctors/${data?.slug}` ? "active bg-slate-300" : ""
          }`}
        >
          Information
        </Button>
      </Link>
      <Link href={`/doctors/${data?.slug}/feedbacks/`} passHref>
        <Button
          className={`  ml-2 text-black bg-slate-100 hover:bg-slate-200 ${
            pathname === `/doctors/${data?.slug}/feedbacks`
              ? "active bg-slate-300"
              : ""
          }`}
        >
          Feedbacks
        </Button>
      </Link>
    </div>
  );
}
