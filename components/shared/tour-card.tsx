"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { createBooking } from "@/network/api/booking";
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
  id,
  title,
  price,
  desc,
  about,
  image,
  days,
  location,
  badge,
  isTopTour,
}: Props) {
  const { t } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", people: 1 });

  const openBooking = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setOpen(true);
  };

  const closeBooking = () => setOpen(false);

  const handleConfirm = async () => {
    if (!id) {
      alert(t("error_message") || "Tour id is missing");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        people: Number(form.people),
        tour_id: Number(id),
      } as any;
      const ok = await createBooking(payload);
      if (ok) {
        alert(t("success_message") || "Booking created");
        setForm({ name: "", email: "", people: 1 });
        closeBooking();
      } else {
        alert(t("error_message") || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert(t("error_message") || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <h3 className="text-xl sm:text-2xl font-medium text-primary">
                {price}$/{t("per_person")}
              </h3>
              <p className="text-neutral-600 text-sm h-12 line-clamp-2 mt-1 sm:mt-2 leading-relaxed">
                {desc}
              </p>
            </>
          )}

          {!isTopTour && (
            <>
              <h3 className="text-xl sm:text-2xl font-medium">
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
          <Link href={id ? `/tour/${id}` : "#"} className="flex-1">
            <Button
              variant="outline"
              className="w-full h-10 rounded-xl text-sm"
            >
              {t("read_more")}
            </Button>
          </Link>
          <Button
            className="flex-1 h-10 rounded-xl bg-primary text-sm"
            onClick={openBooking}
          >
            {t("sign_up")}
          </Button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h4 className="text-xl font-medium mb-3">
              {t("tour_booking") || "Tour booking"}
            </h4>

            <div className="flex flex-col gap-2">
              <input
                className="border p-2 rounded"
                placeholder={t("name_label")}
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded"
                placeholder={t("email_label")}
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
              />
              <input
                type="number"
                min={1}
                className="border p-2 rounded"
                value={form.people}
                onChange={(e) =>
                  setForm((s) => ({ ...s, people: Number(e.target.value) }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={closeBooking}>
                {t("cancel") || "Cancel"}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className="bg-primary"
              >
                {loading ? "..." : t("confirm") || "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TourCard(props: Props) {
  return <CardContent {...props} />;
}
