import Link from "next/link";
import Image from "next/image";

export default function BlogList() {
  const staticBlogs = [
    {
      id: 1,
      title: "Making Your Clinic Visit Painless",
      subtitle:
        "Discover how to make your clinic visits smooth and stress-free with expert tips.",
      created_at: "2023-12-04",
      author: "Dr. Ruby Perrin",
      image: "/images/blog/Automated-Healthcare.jpg",
    },
    {
      id: 2,
      title: "Benefits of Online Doctor Booking",
      subtitle:
        "Explore the advantages of booking doctor appointments online for convenience.",
      created_at: "2023-12-03",
      author: "Dr. Darren Elder",
      image: "/images/blog/Elevating-Clinic.jpg",
    },
    {
      id: 3,
      title: "Consulting an Online Doctor",
      subtitle:
        "Learn how online consultations can save you time and improve care quality.",
      created_at: "2023-12-03",
      author: "Dr. Deborah Angel",
      image: "/images/blog/Cliniify_Blog_3.png",
    },
    {
      id: 4,
      title: "Consulting an Online Doctor",
      subtitle:
        "Learn how online consultations can save you time and improve care quality.",
      created_at: "2023-12-03",
      author: "Dr. Deborah Angel",
      image: "/images/blog/blue-digital.jpg",
    },
  ];

  const formatDate = (dateString: string) => {
    const options = { day: "numeric", month: "long", year: "numeric" } as const;
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-2xl mt-10 mb-10 mx-auto px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl sm:text-4xl mb-5 text-gray-700 font-bold">
              Blogs and News
            </h2>
            <p className="text-lg sm:text-lg text-gray-600 mt-2">
              Stay updated with the latest trends and insights from our experts.
            </p>
          </div>
          <div>
            <Link href="/blogs">
              <span className="px-6 py-3 bg-teal-600 text-white text-lg font-medium rounded-lg hover:bg-teal-700 transition">
                View All
              </span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {staticBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white duration-300 hover:scale-105"
            >
              <Link href={`/blogs/${blog.id}`}>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={500}
                  height={350}
                  className="w-full h-60 object-cover"
                />
              </Link>
              <div className="p-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{blog.author}</span>
                  <span>{formatDate(blog.created_at)}</span>
                </div>
                <Link href={`/blogs/${blog.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 mt-4 hover:text-teal-600 transition">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mt-4">
                  {blog.subtitle.length > 80
                    ? `${blog.subtitle.substring(0, 80)}...`
                    : blog.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
