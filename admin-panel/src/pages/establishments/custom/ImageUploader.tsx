import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";

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
  const [imageUrls, setImageUrls] = useState<IEstablishmentImages[]>(initialImages || []);

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImageUrls(initialImages || []);
    }
  }, [initialImages]);

  const isFileSizeValid = (file: File) => {
    const maxFileSizeInBytes = 2 * 1024 * 1024; // 2 MB
    return file.size <= maxFileSizeInBytes;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    const validFiles = newFiles.filter(isFileSizeValid);
  
    if (newFiles.length > 0) {
      // Check if any file is larger than 2MB
      const invalidFiles = newFiles.filter(file => !isFileSizeValid(file));
      if (invalidFiles.length > 0) {
        alert(`File(s) ${invalidFiles.map(file => file.name).join(', ')} exceed the maximum size of 2MB.`);
        // Reset the input field value to prevent invalid files from being set
        event.target.value = "";
        return;
      }
  
      // Calculate the number of new valid files to be added
      const newValidFilesCount = validFiles.length;
      const totalFileCount = imageFiles.length + newValidFilesCount;
  
      if (totalFileCount > 5) {
        alert(`You can upload a maximum of 5 images. You are trying to upload ${newValidFilesCount} more images.`);
        // Reset the input field value to prevent invalid files from being set
        event.target.value = "";
        return;
      }
  
      const newImageUrls: IEstablishmentImages[] = validFiles.map((file, index) => ({
        id: index,
        image: URL.createObjectURL(file),
      }));
  
      setImageUrls([...imageUrls, ...newImageUrls]);
      setImageFiles([...imageFiles, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    const deletedImageId = initialImages?.[index]?.id;
    if (deletedImageId !== undefined) {
      setDeletedImages((prevDeletedImages) => [...prevDeletedImages, deletedImageId]);
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
              <img
                src={imageUrl.image}
                alt={`Image ${index}`}
                className="w-28 h-28 ring-1 ring-gray-200 object-cover rounded-lg"
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