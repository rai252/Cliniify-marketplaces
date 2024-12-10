import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface IEstablishmentImages {
  id?: number;
  image: string;
}

interface ImageUploaderProps {
  initialImages?: IEstablishmentImages[] | null | undefined;
  setDeletedImages: React.Dispatch<React.SetStateAction<number[]>>;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imageFiles: File[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImages = [],
  setDeletedImages,
  setImageFiles,
  imageFiles,
}) => {
  const [imageUrls, setImageUrls] = useState<IEstablishmentImages[]>(
    initialImages || []
  );
  const [maxImagesReached, setMaxImagesReached] = useState(false);
  const [newFilesSelected, setNewFilesSelected] = useState(false);

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImageUrls(initialImages || []);
    }
  }, [initialImages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);

    if (newFiles.length > 0) {
      if (newFiles.length > 5) {
        setMaxImagesReached(true);
        toast.error("Only 5 images are allowed at a time");
        return;
      }

      newFiles.forEach((file) => {
        if (file.size > 2 * 1024 * 1024) {
          toast.error("Image size should not exceed 2MB");
          return;
        }
      });

      const newImageUrls: IEstablishmentImages[] = newFiles.map(
        (file, index) => ({
          id: index,
          image: URL.createObjectURL(file),
        })
      );

      setImageUrls([...imageUrls, ...newImageUrls]);
      setImageFiles([...imageFiles, ...newFiles]);
      setNewFilesSelected(true);
    }
  };

  const removeImage = (index: number) => {
    const deletedImageId = initialImages?.[index]?.id;
    if (deletedImageId) {
      setDeletedImages((prevDeletedImages) => [
        ...prevDeletedImages,
        deletedImageId,
      ]);
    }

    setImageUrls((prev) => prev.filter((_: any, i: number) => i !== index));

    setImageFiles((prev) => prev.filter((_: any, i: number) => i !== index));
  };

  return (
    <div>
      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="p-2 mb-4 w-full text-sm border border-gray-200 rounded-lg cursor-pointer bg-gray-50"
      />
      <ul className="flex flex-wrap -m-1">
        {imageUrls.map((imageUrl, index) => (
          <li key={index} className="p-1">
            <div className="relative">
              <Image
                src={imageUrl.image}
                alt={`Image ${index}`}
                className="ring-1 ring-gray-200 object-cover rounded-lg w-[200px] h-[200px] "
                width={500}
                height={500}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 mt-1 mr-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-lg"
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageUploader;
