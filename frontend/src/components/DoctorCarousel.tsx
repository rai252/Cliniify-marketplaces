import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";

const DoctorCarousel = () => {
  const doctors = [
    {
      id: 1,
      name: "Darren Elder",
      specialization: "BDS, MDS - Oral & Maxillofacial Surgery",
      image: "/images/article/gynecologist.png",
      rating: "★ ★ ★ ★ ☆",
      reviews: 35,
      location: "Florida, USA",
      availability: "Available on Fri, 22 Mar",
      price: "₹500-₹1000",
    },
    {
      id: 2,
      name: "Jane Doe",
      specialization: "Dietitian",
      image: "/images/article/dietitian.png",
      rating: "★ ★ ★ ★ ☆",
      reviews: 28,
      location: "California, USA",
      availability: "Available on Thu, 21 Mar",
      price: "₹400-₹900",
    },
    {
      id: 3,
      name: "John Smith",
      specialization: "Physiotherapist",
      image: "/images/article/physiotherapist.png",
      rating: "★ ★ ★ ★ ★",
      reviews: 50,
      location: "Texas, USA",
      availability: "Available on Sat, 23 Mar",
      price: "₹700-₹1200",
    },
    {
      id: 4,
      name: "Alice Johnson",
      specialization: "Dermatologist",
      image: "/images/article/dentist.png",
      rating: "★ ★ ★ ★ ☆",
      reviews: 42,
      location: "New York, USA",
      availability: "Available on Mon, 25 Mar",
      price: "₹600-₹1100",
    },
    {
      id: 5,
      name: "Michael Lee",
      specialization: "Cardiologist",
      image: "/images/article/physiotherapist.png",
      rating: "★ ★ ★ ★ ☆",
      reviews: 39,
      location: "Nevada, USA",
      availability: "Available on Tue, 26 Mar",
      price: "₹800-₹1500",
    },
  ];

  return (
    <div>
      <Carousel
        className="mt-6"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {doctors.map((doctor) => (
            <CarouselItem key={doctor.id} className="sm:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex flex-col items-center">
                  {/* Image Section */}
                  <div className="w-48 h-48 mb-4">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={200}
                      height={200}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>

                  {/* Doctor Info */}
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {doctor.specialization}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400 text-lg mr-1">
                      {doctor.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({doctor.reviews})
                    </span>
                  </div>

                  {/* Location and Info */}
                  <div className="mt-3 text-sm text-gray-600 space-y-2">
                    <p className="flex items-center">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-gray-500 mr-2"
                      />
                      {doctor.location}
                    </p>
                    <p className="flex items-center">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="text-gray-500 mr-2"
                      />
                      {doctor.availability}
                    </p>
                    <p className="flex items-center">
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        className="text-gray-500 mr-2"
                      />
                      {doctor.price}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex gap-4">
                    <button className="bg-blue-500 text-white text-sm px-6 py-3 rounded-lg hover:bg-blue-600">
                      View Profile
                    </button>
                    <button className="bg-green-500 text-white text-sm px-6 py-3 rounded-lg hover:bg-green-600">
                      Book Now
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
    </div>
  );
};

export default DoctorCarousel;
