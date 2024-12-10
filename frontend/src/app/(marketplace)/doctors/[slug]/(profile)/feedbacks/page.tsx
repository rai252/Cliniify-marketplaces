import { FaStar } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { feedbackService } from "@/services/feedback.service";
import PaginationComponent from "@/app/(marketplace)/components/pagination";
import { doctorService } from "@/services/doctor.service";
import dayjs from "dayjs";
import Image from "next/image";

type Props = {
  searchParams: {
    page?: string;
  };
  params: { slug: string };
};

export default async function FeedbackList(props: Props) {
  const { searchParams, params } = props;
  const currentPage = Number(searchParams?.page) || 1;
  const data = await doctorService.getDoctorDetail({ id: params.slug });
  const page_size = 10;
  const feedback = await feedbackService.getFeedbacks({
    expand: "patient,doctor",
    page: currentPage,
    doctor: data?.id,
    page_size,
  });

  const totalPages = Math.ceil(feedback?.count / page_size);

  const formatTimeAgo = (dateString: string) => {
    const date = dayjs(dateString);
    const days = dayjs().diff(date, "day");
    const months = dayjs().diff(date, "month");

    if (months > 0) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else if (days >= 7) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    } else if (days >= 1) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return "Today";
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full">
          {feedback?.results && feedback.results.length > 0 ? (
            feedback.results.map((feedback) => (
              <div
                key={feedback.id}
                className="border-b pb-4 flex items-center"
              >
                <div className="w-full sm:w-4/5 mt-5">
                  <div className="flex flex-col sm:flex-row">
                    <Avatar className="  w-8 h-8 mr-4">
                      <AvatarImage
                        src={
                          (feedback?.patient.avatar as string) ||
                          "/images/image.png"
                        }
                      />
                      <AvatarFallback>
                        {feedback?.patient.full_name}
                      </AvatarFallback>
                    </Avatar>
                    <div className="sm:text-left">
                      <div className="flex flex-col">
                        <p className="  text-lg font-semibold mb-2">
                          {feedback?.patient.full_name}
                        </p>
                        <span className="font-normal text-xs text-gray-500 -mt-2 mb-1">
                          {formatTimeAgo(feedback.comment_at)}
                        </span>
                      </div>
                      <div
                        className="flex align-center"
                        style={{
                          marginBottom: "10px",
                          marginLeft: "-3px",
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            style={{
                              color:
                                star <= feedback.rating ? "#FDCC0D" : "#D3D3D3",
                              fontSize: "20px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                          />
                        ))}
                      </div>
                      <p className="  text-base text-gray-700 mb-2">
                        {feedback.comment}
                      </p>
                    </div>
                  </div>
                  {feedback.reply && (
                    <div className="w-full mt-2 flex items-center sm:ml-12">
                      <svg
                        xmlns="/images/reply.svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="main-grid-item-icon mb-10 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <polyline points="15 10 20 15 15 20" />
                        <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                      </svg>
                      <div className="ml-3">
                        <p className="  text-base font-medium mb-2">
                          {feedback?.doctor?.full_name} replied
                        </p>
                        <p className="  text-base text-gray-700 mb-2">
                          {feedback.reply}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="max-w-full p-4 text-sm mt-10 flex flex-col items-center">
              <Image
                src="/images/no-feedbacks.png"
                alt="no-feedback"
                height={24}
                width={24}
              />
              <p className="mt-4   text-xl text-teal-800">No Feedbacks!</p>
            </div>
          )}
        </div>
        {feedback && feedback.results.length > 0 && (
          <div className="flex mt-5 justify-end">
            <div className="pagination-container">
              <PaginationComponent
                currentPage={currentPage}
                totalNumberOfPages={totalPages}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
