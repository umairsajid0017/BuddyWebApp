import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const services = [
  { title: "Website Development", color: "bg-green-500" },
  { title: "Logo Design", color: "bg-orange-500" },
  { title: "SEO", color: "bg-green-700" },
  { title: "Architecture & Interior Design", color: "bg-purple-700" },
  { title: "Social Media Marketing", color: "bg-yellow-700" },
  { title: "Voice Over", color: "bg-brown-700" },
];

export function PopularServices() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container">
        <h2 className="mb-8 text-3xl font-bold">Popular services</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className={`${service.color} text-white`}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src="/placeholder.svg?height=150&width=250"
                  alt={service.title}
                  width={250}
                  height={150}
                  className="rounded-lg"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
