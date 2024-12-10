"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CarouselProps {
  images: {
    id: number;
    image: string;
  }[];
}

const CarouselComponent: React.FC<CarouselProps> = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setIsOpen(true);
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Grid layout for thumbnails */}
      <div className="flex gap-4 ml-4">
        {images.map((image, index) => (
          <div key={image.id} className="aspect-square">
            <Image
              src={image.image}
              alt={`Image ${index + 1}`}
              width={300}
              height={300}
              className="w-24 h-24 object-cover cursor-pointer rounded-lg"
              onClick={() => handleImageClick(index)}
            />
          </div>
        ))}
      </div>

      {/* Modal with Carousel */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[350px] sm:max-w-[700px] bg-transparent border-none text-white flex items-center justify-center">
          <Carousel className="max-w-[250px] sm:max-w-[500px] text-black">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={image.id}>
                  <div className="flex items-center justify-center h-full">
                    <Image
                      src={image.image}
                      alt={`Full size image ${index + 1}`}
                      width={500}
                      height={500}
                      className="object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CarouselComponent;
