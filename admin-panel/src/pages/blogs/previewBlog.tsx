import Breadcrumbs from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { IBlogPost } from "@/interfaces/blog.interface";
import { useGetBlogByIdQuery } from "@/services/blogs/blogs.service";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const BlogPreview = () => {
  const { id = "" } = useParams();

  const { data: blogData, isLoading } = useGetBlogByIdQuery(id);

  const [post, setPost] = useState<IBlogPost>({
    title: "",
    slug: "",
    subtitle: "",
    image: null,
    content: "",
    created_at: "",
  });

  useEffect(() => {
    if (!isLoading) {
      setPost(blogData as any);
    }
  }, [blogData, isLoading]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  };

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Blogs", path: "/blogs" },
    { label: "Preview Blog" },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="p-4">
        <div className="mx-auto flex justify-center">
          {!isLoading ? (
            <>
              <div className="max-w-screen-2xl bg-white rounded-lg shadow-lg p-10">
                <div className="flex justify-between">
                  <div className="text-xl mt-0.5 font-bold">Blog Preview</div>
                  <Link className="p-1" to="/blogs/">
                    <Button variant="ghost">
                      <IoIosArrowBack className="mt-0.5" />
                      &nbsp; Back
                    </Button>
                  </Link>
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                  {post.title}
                </h2>
                {post.subtitle && (
                  <h3 className="text-lg text-gray-600 mb-4">
                    {post.subtitle}
                  </h3>
                )}
                <hr />
                {post.created_at && (
                  <div className="blog-metadata text-sm italic font-semibold text-gray-500 mt-4">
                    <p>Published on: {formatDate(post.created_at)}</p>
                  </div>
                )}
                {post.image && (
                  <div className="blog-image mb-4 flex justify-center">
                    <img
                      className="rounded-lg w-2/4"
                      src={post.image as string}
                      alt="Blog post"
                    />
                  </div>
                )}
                <div className="blog-content text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center h-screen">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="42"
                    height="42"
                    viewBox="0 0 24 24"
                  >
                    <ellipse cx="12" cy="5" fill="#4f46e5" rx="4" ry="4">
                      <animate
                        id="svgSpinnersBouncingBall0"
                        fill="freeze"
                        attributeName="cy"
                        begin="0;svgSpinnersBouncingBall2.end"
                        calcMode="spline"
                        dur="0.375s"
                        keySplines=".33,0,.66,.33"
                        values="5;20"
                      />
                      <animate
                        attributeName="rx"
                        begin="svgSpinnersBouncingBall0.end"
                        calcMode="spline"
                        dur="0.05s"
                        keySplines=".33,0,.66,.33;.33,.66,.66,1"
                        values="4;4.8;4"
                      />
                      <animate
                        attributeName="ry"
                        begin="svgSpinnersBouncingBall0.end"
                        calcMode="spline"
                        dur="0.05s"
                        keySplines=".33,0,.66,.33;.33,.66,.66,1"
                        values="4;3;4"
                      />
                      <animate
                        id="svgSpinnersBouncingBall1"
                        attributeName="cy"
                        begin="svgSpinnersBouncingBall0.end"
                        calcMode="spline"
                        dur="0.025s"
                        keySplines=".33,0,.66,.33"
                        values="20;20.5"
                      />
                      <animate
                        id="svgSpinnersBouncingBall2"
                        attributeName="cy"
                        begin="svgSpinnersBouncingBall1.end"
                        calcMode="spline"
                        dur="0.4s"
                        keySplines=".33,.66,.66,1"
                        values="20.5;5"
                      />
                    </ellipse>
                  </svg>
                  {/* <div className="w-12 h-12 rounded-full absolute border-8 border-dashed border-gray-200"></div>
                  <div className="w-12 h-12 rounded-full animate-spin absolute border-8 border-dashed border-teal-400 border-t-transparent"></div> */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPreview;
