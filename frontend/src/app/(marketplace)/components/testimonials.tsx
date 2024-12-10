"use client";
import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const featureRefs = useRef<(HTMLButtonElement | null)[]>([]); // To track the button elements

  const features = [
    {
      id: 1,
      title: "ICU",
      image: "/images/ICUbg.jpg",
      description: `ICU (Intensive Care Unit) Services

      Our Intensive Care Unit (ICU) is equipped with the latest technology and staffed by highly trained medical professionals to provide critical care for patients with life-threatening conditions. Whether it’s for post-surgical recovery, severe trauma, or chronic illness management, our ICU offers round-the-clock monitoring, specialized treatment, and a tailored care plan to ensure the best possible outcome for each patient.
      
      Key Services:
      - 24/7 Monitoring: Continuous vital sign monitoring and advanced diagnostic tools.
      - Advanced Equipment: State-of-the-art ventilators, dialysis machines, and other life-support systems.
      - Multidisciplinary Team: Doctors, nurses, respiratory therapists, and other specialists working together.
      - Personalized Care: Focus on providing individual care based on each patient’s unique needs.
      
      At our ICU, we prioritize patient safety, comfort, and recovery, providing families with peace of mind during critical times.`,
    },
    {
      id: 2,
      title: "Operation",
      image: "/images/Operationbg.jpg",
      description: "Details about Operation services.",
    },
    {
      id: 3,
      title: "Medical",
      image: "/images/Medicalbg.jpg",
      description: "Information about Medical services.",
    },
    {
      id: 4,
      title: "Patient Ward",
      image: "/images/Patient Wardbg.jpg",
      description: "Details about Patient Ward services.",
    },
  ];

  // Close the description if clicked outside of the button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        featureRefs.current.every(
          (ref) => ref && !ref.contains(event.target as Node)
        )
      ) {
        setActiveFeature(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section className="relative pt-10 pb-10 bg-white overflow-hidden">
      <div className="relative z-10 container px-4 mx-auto">
        <div className="flex flex-wrap justify-between items-end -m-2 mb-12">
          <div className="w-auto p-2">
            <h2 className="text-4xl sm:text-4xl font-bold text-gray-700">
              Available Features in Our Clinic
            </h2>
            <p className="text-base sm:text-4sm text-gray-600 mt-2">
              Meet our Experts & Book Online
            </p>
          </div>
        </div>

        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="container max-w-7xl"
        >
          <CarouselContent>
            {features.map((feature, index) => (
              <CarouselItem
                key={feature.id}
                className="md:basis-1/2 lg:basis-1/4 shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-full bg-white bg-opacity-80 rounded-3xl">
                  <div className="relative block rounded-3xl overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={1000}
                      height={600}
                      className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300 rounded-lg"
                    />
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300 rounded-3xl">
                      <button
                        ref={(el) => (featureRefs.current[index] = el)}
                        onClick={() =>
                          setActiveFeature((prev) =>
                            prev === feature.id ? null : feature.id
                          )
                        }
                        className="px-6 py-3 bg-teal-700 text-white font-semibold rounded-full hover:bg-blue-600 transition-all"
                      >
                        {feature.title}
                      </button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="text-teal-600" />
            <CarouselNext className="text-teal-600" />
          </div>
        </Carousel>

        {/* Description Section */}
        <div className="mt-6">
          {features.map(
            (feature) =>
              activeFeature === feature.id && (
                <div
                  key={feature.id}
                  className="p-4 bg-gray-100 rounded-lg shadow-md transition-all"
                >
                  <h3 className="text-xl font-bold text-teal-700">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{feature.description}</p>
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
}
