import { FC, ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import Breadcrumbs from "@/components/Breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddBlogMutation } from "@/services/blogs/blogs.service";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "@radix-ui/react-label";
import { toast } from "react-toastify";

interface FormProps {}

const validationSchema = z.object({
  title: z.string().min(4),
  subtitle: z.string().optional(),
  image: z.string().optional().nullish(),
  content: z.string(),
});

interface Image {
  image: File | null;
}

export const BlogForm: FC<FormProps> = () => {
  const navigate = useNavigate();
  const [addBlog, { isLoading }] = useAddBlogMutation();
  const [formData, setFormData] = useState<Image>({
    image: null,
  });
  type BlogFormValues = z.infer<typeof validationSchema>;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(validationSchema) as any,
    defaultValues: {
      title: "",
      subtitle: "",
      content: "",
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
        await addBlog(form_Data).unwrap();

        toast.success("Blog added successfully");
        navigate("/blogs/");
      } catch (error: any) {
        if (error && error.data) {
          const errorData = error.data;
          for (const field in errorData) {
            if (errorData.hasOwnProperty(field)) {
              const errorMessages = errorData[field];
              console.log(errorMessages);
              if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                form.setError(field as any, { message: errorMessages[0] });
                form.setFocus(field as any);
              }
            }
          }
        } else {
          toast.error("An unexpected error occurred while updating doctor.");
        }
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Blogs", path: "/blogs" },
    { label: "Add Blog" },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Add Blog</div>
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
                      placeholder="Write your blog content here..."
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
              {isLoading ? "Saving..." : "Save Blog"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
