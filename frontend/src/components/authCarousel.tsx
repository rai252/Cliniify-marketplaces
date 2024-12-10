import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import React from "react";

const authCarousel = () => {
  return (
    <div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent className="w-full h-full">
          <CarouselItem className="h-[908px]">
            <Image
              src="/images/11.jpg"
              alt="Image Alt Text"
              className="object-cover w-full h-full"
              width={1000}
              height={800}
              priority
            />
          </CarouselItem>
          <CarouselItem className="h-[908px]">
            <Image
              src="/images/12.jpg"
              alt="Image Alt Text"
              className="object-cover w-full h-full"
              width={1000}
              height={1000}
              priority
            />
          </CarouselItem>
          <CarouselItem className="h-[908px]">
            <Image
              src="/images/13.jpg"
              alt="Image Alt Text"
              className="object-cover w-full h-full"
              width={1000}
              height={1000}
              priority
            />
          </CarouselItem>
          <CarouselItem className="h-[908px]">
            <Image
              src="/images/14.jpg"
              alt="Image Alt Text"
              className="object-cover w-full h-full"
              width={1000}
              height={1000}
              priority
            />
          </CarouselItem>
          <CarouselItem className="h-full"></CarouselItem>
        </CarouselContent>
      </Carousel>
      ;
    </div>
  );
};

export default authCarousel;
