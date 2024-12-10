"use client";
import { useUserContext } from "@/context/user";
import { doctorService } from "@/services/doctor.service";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  doctorId: number;
};

export default function ShareFeedback({ doctorId }: Props) {
  const { user } = useUserContext();
  const pathname = usePathname();
  const router = useRouter();

  const handleFeedbackClick = async () => {
    let redirectUrl;
    let feedbackUrl;

    if (!user) {
      redirectUrl = `/login?next=${pathname}`;
      router.push(redirectUrl);
      return;
    } else {
      try {
        const data = await doctorService.getDoctorDetail({ id: doctorId });
        feedbackUrl = `/patients/${user?.patient_id}/feedbacks/add/?p=${user?.patient_id}&doctor=${data?.id}`;
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        return;
      }
    }

    router.push(feedbackUrl);
  };

  return (
    <>
      {user?.patient_id && (
        <button
          className=" text-teal-600 hover:text-teal-500 font-medium hover:underline self-end sm:self-end"
          onClick={handleFeedbackClick}
        >
          Share your feedback
        </button>
      )}
    </>
  );
}
