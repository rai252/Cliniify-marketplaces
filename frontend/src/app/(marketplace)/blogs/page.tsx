import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { blogService } from "@/services/blog.service";
import PaginationComponent from "../components/pagination";

type Props = {
  searchParams: {
    page?: string;
  };
};

export default async function BlogList(props: Props) {
  const { searchParams } = props;
  const currentPage = Number(searchParams?.page) || 1;
  const page_size = 6;
  const data = await blogService.getBlogs({ page: currentPage, page_size });
  const totalPages = Math.ceil(data?.count / page_size);

  const formatDate = (dateString: string) => {
    const options = { day: "numeric", month: "long", year: "numeric" } as const;
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
    const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(
      new Date(dateString)
    );
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(dateString)
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
  };

  return (
    <div className="main-section">
      <div className="mt-1">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto container flex flex-col-reverse sm:flex-row py-5 sm:py-5 lg:py-5"></div>
        </div>
      </div>

      <section className="blog-section text-gray-600 body-font mt-10">
        <div className="container py-10 mx-auto">
          <h1 className=" font-medium text-4xl text-center sm:text-left text-gray-900 sm:text-4xl">
            Latest news & blogs
          </h1>
          <div className="flex flex-wrap mt-10">
            {data?.results.map((blog) => (
              <div key={blog.id} className="md:w-1/3">
                <div className="max-w-md mx-auto">
                  <Link key={blog.id} href={`/blogs/${blog.id}/`}>
                    <div className="mb-6 max-w-max overflow-hidden rounded-xl">
                      <Image
                        className="transform hover:scale-105 transition ease-in-out duration-1000 object-cover"
                        src={(blog?.image as string) || "/images/no-Image.png"}
                        alt="blog"
                        width={500}
                        height={500}
                        style={{ height: "300px" }}
                      />
                    </div>
                  </Link>
                  <h2 className=" tracking-widest text-sm title-font font-medium text-gray-500 mb-2 mt-2">
                    {formatDate(blog.created_at)}
                  </h2>
                  <Link key={blog.id} href={`/blogs/${blog.id}/`}>
                    <h3 className=" text-xl font-medium font-heading leading-normal text-gray-800">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className=" text-gray-500 font-medium leading-relaxed">
                    {blog.subtitle.length > 80
                      ? `${blog.subtitle.substring(0, 80)}...`
                      : blog.subtitle}
                  </p>
                  <Link key={blog.id} href={`/blogs/${blog.id}/`}>
                    <Button className="mt-5 mb-5 bg-teal-800">Read more</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        {data && data.results.length > page_size && (
          <PaginationComponent
            currentPage={currentPage}
            totalNumberOfPages={totalPages}
          />
        )}
      </section>
    </div>
  );
}
