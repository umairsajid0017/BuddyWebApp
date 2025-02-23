import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Service } from "@/lib/types";
import { CURRENCY } from "@/utils/constants";

interface ServiceCardProps {
  service: Service;
  compact?: boolean;
}

export function ServiceCard({ service, compact = false }: ServiceCardProps) {
  return (
    <Card className={`w-full overflow-hidden`}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div
            className={`relative ${compact ? "h-28 sm:w-40" : "h-56 sm:w-56"}`}
          >
            <Image
              src={
                service.images?.[0]?.name
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${service.images[0].name}`
                  : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${service.image}`
              }
              alt={service.name}
              layout="fill"
              objectFit="cover"
              className=""
              unoptimized
            />
          </div>
          <div className="flex flex-1 flex-col justify-start p-4">
            <h3
              className={`mb-2 ${!compact ? "text-xl" : "text-base"} + font-semibold text-text-900`}
            >
              {service.name}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {CURRENCY} {service.fixed_price}
                </p>
              </div>

              <div className="text-sm font-medium text-muted-foreground">
                by {service.user.name}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
