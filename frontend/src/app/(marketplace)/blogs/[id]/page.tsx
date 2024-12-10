import Link from "next/link";
import Image from "next/image";
import { blogService } from "@/services/blog.service";

export default async function BlogDetail({
  params,
}: {
  params: { id: number };
}) {
  const { id } = params;
  const data = await blogService.getBlogDetail({ id });
  const blogList = await blogService.getBlogs();

  const formatDate = (dateString: string) => {
    try {
      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
      } as const;
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${dateString}`);
      }

      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );
      const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(
        date
      );
      const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        date
      );

      const dayWithSuffix =
        day +
        (["11", "12", "13"].includes(day)
          ? "th"
          : ["1", "21", "31"].includes(day.slice(-1))
          ? "st"
          : ["2", "22"].includes(day.slice(-1))
          ? "nd"
          : ["3", "23"].includes(day.slice(-1))
          ? "rd"
          : "th");

      return `${dayWithSuffix} ${month}, ${formattedDate.split(", ")[1]}`;
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="main-section">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>
      <section className="blogdetail-section mt-10">
        <div className="overflow-x-hidden">
          <div className="py-8">
            <div className="container flex justify-between mx-auto">
              <div className="w-full lg:w-8/12">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-gray-700 md:text-2xl">
                    Latest news & blogs
                  </h1>
                </div>
                <div className="mt-6">
                  <div
                    key={data?.id}
                    className="max-w-4xl px-4 sm:px-10 py-6 mx-auto bg-white rounded-lg shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-light text-gray-600">
                        {formatDate(data?.created_at || "")}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Image
                        className="lg:h-96 md:h-96 w-full object-cover object-center mt-5 mb-8"
                        src={(data?.image as string) || "/images/no-Image.png"}
                        alt="blog"
                        width={700}
                        height={500}
                      />
                      <p className="text-base sm:text-xl font-bold text-gray-700">
                        {data?.title}
                      </p>
                      <p className="text-sm sm:text-base mt-2 text-gray-600">
                        {data?.content.replace(/<[^>]*>/g, "")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden w-4/12 -mx-8 lg:block">
                <div className="px-8 mt-10">
                  <h1 className="mb-4 text-xl font-bold text-gray-700">
                    Recent Blogs
                  </h1>
                  <div className="flex flex-col max-w-sm px-8 py-6 mx-auto bg-white rounded-lg shadow-md">
                    {blogList?.results.map((blog) => (
                      <div key={blog.id} className="flex flex-col sm:flex-row">
                        <Image
                          src={
                            (blog?.image as string) || "/images/no-Image.png"
                          }
                          alt="avatar"
                          className="object-cover w-16 h-16 rounded-full mr-4 mt-2"
                          height={200}
                          width={200}
                        />
                        <div className="sm:text-left mb-6">
                          <Link
                            key={blog.id}
                            href={`/blogs/${blog.id}/`}
                            className="text-sm font-medium text-gray-700 mt-4"
                          >
                            {blog.title}
                          </Link>
                          <div>
                            <span className="text-sm font-light text-gray-500 mt-1">
                              {formatDate(blog?.created_at || "")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
