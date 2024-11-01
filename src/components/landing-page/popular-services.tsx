import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
  {
    title: "Masonry Services",
    color: "bg-green-600",
    image:
      "https://images.unsplash.com/photo-1673865641469-34498379d8af?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Electrical Work",
    color: "bg-orange-400",
    image:
      "https://images.unsplash.com/photo-1682345262055-8f95f3c513ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Plumbing",
    color: "bg-green-800",
    image:
      "https://plus.unsplash.com/premium_photo-1663045495725-89f23b57cfc5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D ",
  },
  {
    title: "Interior Design",
    color: "bg-purple-800",
    image:
      "https://plus.unsplash.com/premium_photo-1681980018817-b36ab8848616?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Carpentry Services",
    color: "bg-yellow-700",
    image:
      "https://images.unsplash.com/photo-1590880795696-20c7dfadacde?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Mechanic Services",
    color: "bg-blue-700",
    image:
      "https://plus.unsplash.com/premium_photo-1677009835876-4a29ddc4cc2c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Cleaning Services",
    color: "bg-pink-600",
    image:
      "https://plus.unsplash.com/premium_photo-1661478280979-25712a1378c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function PopularServices() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollButtons);
      // Check initial state
      checkScrollButtons();
      // Check after images load as this might affect the scroll width
      window.addEventListener("load", checkScrollButtons);
      // Check on window resize
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        carousel.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("load", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, []);

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 600, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -600, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="font-regular mb-8 leading-relaxed text-text-800 lg:text-5xl">
          Popular services
        </h2>
        <div className="relative">
          <div
            ref={carouselRef}
            className="scrollbar-hide no-scrollbar flex space-x-0 overflow-x-auto pb-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="w-64 flex-none md:w-72"
                style={{ scrollSnapAlign: "start" }}
              >
                <div
                  className={`${service.color} h-72 w-64 overflow-hidden rounded-lg`}
                >
                  <div className="p-4 text-white">
                    <h3 className="mb-2 text-lg font-bold">{service.title}</h3>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={100}
                      height={100}
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {showLeftButton && (
            <button
              onClick={scrollLeft}
              className="absolute -left-5 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg hover:bg-gray-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          )}
          {showRightButton && (
            <button
              onClick={scrollRight}
              className="absolute -right-5 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg hover:bg-gray-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default PopularServices;
