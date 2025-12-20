"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGlobalContext } from "@/context";
import { Button } from "@/components/ui/button";
import { Clock9, MapPin } from "lucide-react";

type Props = {
  id?: number | string;
  title: string;
  price: string;
  desc: string;
  about: string;
  image: string;
  days?: string;
  location?: string;
  badge?: string;
  isTopTour?: boolean;
};

function CardContent({
  title,
  price,
  desc,
  about,
  image,
  days,
  location,
  badge,
  isTopTour,
}: Omit<Props, "id">) {
  const { t } = useGlobalContext();

  return (
    <div className="rounded-2xl w-full sm:w-[600px] flex-shrink-0 sm:flex-shrink-0 snap-start overflow-hidden transition-shadow duration-150">
      <div className="relative h-[280px] sm:h-[380px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-2xl"
        />

        {badge && isTopTour && (
          <div className="absolute top-3 left-3 bg-primary/80 text-white px-3 py-1 rounded-sm text-xs">
            {badge}
          </div>
        )}

        {isTopTour && (
          <>
            <h2 className="absolute bottom-10 left-4 right-4 text-white text-xl sm:text-3xl font-medium drop-shadow-lg border-b pb-1 sm:pb-2">
              {title}
            </h2>

            <p className="absolute bottom-4 left-4 text-white/80 line-clamp-1  text-xs sm:text-sm font-light">
              {t("includes")}: {about}
            </p>
          </>
        )}

        {!isTopTour && (
          <div className="absolute bottom-3 right-3 bg-white text-primary px-4 py-4 font-medium rounded-full text-ms">
            {price}$/{t("per_person")}
          </div>
        )}
      </div>

      <div className="pt-3 sm:pt-5">
        {isTopTour && (
          <>
            <h3 className="text-xl sm:text-2xl font-semibold text-primary">
              {price}$/{t("per_person")}
            </h3>
            <p className="text-neutral-600 text-sm h-12 line-clamp-2 mt-1 sm:mt-2 leading-relaxed">
              {desc}
            </p>
          </>
        )}

        {!isTopTour && (
          <>
            <h3 className="text-xl sm:text-2xl font-semibold">
              {t("tour_to")} {title}
            </h3>
          </>
        )}

        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-5 text-gray-500 text-sm sm:text-sm flex-wrap">
          <span className="border flex gap-2 items-center px-4 py-2 rounded-full">
            <Clock9 /> {days}
          </span>

          {location && (
            <span className="border flex gap-2 items-center px-4 py-2 rounded-full">
              <MapPin /> {location}
            </span>
          )}
        </div>
        {!isTopTour && (
          <p className="text-neutral-600 line-clamp-2 h-12 text-sm mt-1 sm:mt-2 leading-relaxed">
            {desc}
          </p>
        )}
      </div>

      <div className="flex w-full gap-4 mt-4 sm:mt-6">
         <Button variant="outline" className="flex-1 h-10 rounded-xl text-sm">
                    {t("read_more")}
                  </Button>
        <Button className="flex-1 h-10 rounded-xl bg-primary text-sm">
          {t("sign_up")}
        </Button>
      </div>
    </div>
  );
}

export default function TourCard(props: Props) {
  const { id } = props;
  if (id !== undefined && id !== null) {
    return (
      <Link href={`/tour/${id}`} className="block hover:opacity-95">
        <CardContent {...props} />
      </Link>
    );
  }
  return <CardContent {...props} />;
}
