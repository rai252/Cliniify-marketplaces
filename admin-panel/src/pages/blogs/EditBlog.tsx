import { FC, ChangeEvent, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import Breadcrumbs from "@/components/Breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useEditBlogMutation,
  useGetBlogByIdQuery,
} from "@/services/blogs/blogs.service";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "@radix-ui/react-label";
import { toast } from "react-toastify";

interface FormProps {}

interface Image {
  image: File | null;
}

const validationSchema = z.object({
  title: z.string().min(4),
  subtitle: z.string().optional(),
  image: z.string().optional().nullish(),
  content: z.string(),
});

export const EditBlogForm: FC<FormProps> = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [updateBlog, { isLoading }] = useEditBlogMutation();
  const [formData, setFormData] = useState<Image>({
    image: null,
  });

  const { data: blogData, isLoading: isBlogLoading } = useGetBlogByIdQuery(id);

  useEffect(() => {
    if (!isBlogLoading) {
      form.reset({
        title: blogData?.title,
        subtitle: blogData?.subtitle,
        content: blogData?.content,
      });
    }
  }, [blogData, isBlogLoading]);

  function isString(value: string | File | null | undefined): value is string {
    return typeof value === "string";
  }
  const blogImg = isString(blogData?.image)
    ? blogData?.image.split("/").pop()
    : "";

  type BlogFormValues = z.infer<typeof validationSchema> & {
    image: File | null;
  };
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(validationSchema) as any,
    defaultValues: {
      title: "",
      subtitle: "",
      image: null,
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files }: { name: string; files: FileList | null } = e.target;
    setFormData((prevData: Image) => ({
      ...prevData,
      [name]: files ? files[0] : null,
    }));
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let mergeData = { ...data };

      if (
        formData &&
        typeof formData?.image !== "string" &&
        formData?.image !== null
      ) {
        mergeData = { ...mergeData, ...formData } as any;
      }
      const form_Data: FormData = new FormData();

      for (const [key, value] of Object.entries(mergeData)) {
        form_Data.append(key, value as any);
      }

      try {
        await updateBlog({ id, data: form_Data }).unwrap();

        toast.success("Blog updated successfully");
        navigate("/blogs/");
      } catch (error: any) {
        toast.error("An unexpected error occurred while updating blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Blogs", path: "/blogs" },
    { label: "Edit Blog" },
  ];

  if (isBlogLoading) {
    return (
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
    );
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Edit Blog</div>
          <Link className="p-1" to="/blogs/">
            <Button variant="ghost">
              <IoIosArrowBack className="mt-0.5" />
              &nbsp; Back
            </Button>
          </Link>
        </div>
        <hr />
        <Form {...form}>
          <form className="container-fluid p-6" onSubmit={onSubmit}>
            {/* Personal Details */}
            <div className="mb-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="mb-2">
                    <Label htmlFor="avatar">Image</Label>
                    <Input
                      accept="image/*"
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleFileChange}
                      placeholder="Upload image"
                    />
                    {blogImg && (
                      <a
                        href={blogData?.image as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs"
                      >
                        Image:{" "}
                        <span className="text-blue-500 underline hover:text-blue-300">
                          {/* {blogData?.image as string} */}
                          {blogImg}
                        </span>
                      </a>
                    )}

                    {form.formState.errors.image && (
                      <span className="text-red-400 text-xs ">
                        {form.formState.errors.image.message}
                      </span>
                    )}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <Input
                        type="text"
                        id="title"
                        placeholder="Enter title"
                        {...field}
                      />
                      {form.formState.errors.title && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.title.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <Input
                        type="text"
                        id="subtitle"
                        placeholder="Enter subtitle"
                        {...field}
                      />
                      {form.formState.errors.subtitle && (
                        <span className="text-red-400 text-xs ">
                          {form.formState.errors.subtitle.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mb-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <ReactQuill
                      className="h-[550px] mb-16"
                      theme="snow"
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          [{ color: [] }, { background: [] }],
                          [{ script: "sub" }, { script: "super" }],
                          [{ align: [] }],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      {...field}
                    />
                    {form.formState.errors.content && (
                      <span className="text-red-400 text-xs ">
                        {form.formState.errors.content.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <br />
            <Button className="w-full mt-8" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Update Blog"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
