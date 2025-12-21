"use client";

import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "@/context";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tour,
  TourCost,
  TourDate,
  TourImage,
  TourQuestion,
} from "@/network/model";
import Footer from "@/components/shared/footer";
import { Clock9, Loader2, MapPin } from "lucide-react";
import TourCard from "@/components/shared/tour-card";
import { findById, getTopTours } from "@/network/api/tours";
import { TRANSLATIONS } from "@/lang";
import { Booking } from "@/network/model/booking";
import { createBooking } from "@/network/api/booking";

export default function TourPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [tour, setTour] = useState<Tour | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);
  const [openRouteId, setOpenRouteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { t } = useGlobalContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    people: 1,
  });

  const bookingRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!id) return;

    const fetchData = async () => {
      try {
        const [tourRes, topToursRes] = await Promise.all([
          findById(id),
          getTopTours(),
        ]);

        if (!mounted) return;

        if (tourRes.data) setTour(tourRes.data);
        if (topToursRes) setTours(topToursRes as unknown as Tour[]);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleBookingSubmit = async () => {
    if (!tour) return;

    setBookingLoading(true);

    try {
      const bookingPayload: Booking = {
        name: formData.name,
        email: formData.email,
        people: Number(formData.people),
        tour_id: tour.id,
      };

      const isSuccess = await createBooking(bookingPayload);
      if (isSuccess) {
        alert(t("success_message") || "Sizning buyurtmangiz qabul qilindi!");
        setFormData({ name: "", email: "", people: 1 });
      } else {
        alert(t("error_message") || "Xatolik yuz berdi.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Server bilan bog'lanishda xatolik.");
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("openBooking")) {
        setTimeout(() => {
          bookingRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          nameInputRef.current?.focus();
        }, 300);
      }
    } catch (e) {
      // ignore if not in browser
    }
  }, []);

  if (loading) return <div className="p-10">{t("loading")}</div>;
  if (!tour) return <div className="p-10">{t("tour_not_found")}</div>;

  const topSuggestions = (tours || [])
    .filter((tt) => tt.id !== tour.id)
    .slice(0, 3);

  return (
    <div>
      <Header logoUrl={"../logo.png"} />

      <main className="container mx-auto px-6 pt-12 pb-12">
        <h1 className="text-5xl font-medium mb-2">
          {t("tour_to")}{" "}
          <span className="text-primary">{tour.location || tour.address}</span>
        </h1>
        <div className="flex gap-2 sm:gap-3 mt-3 pb-12 sm:mt-5 text-gray-500 text-sm sm:text-sm flex-wrap">
          <span className="border flex gap-2 items-center px-4 py-2 rounded-full">
            <Clock9 /> {tour.days} {t("days")} / {tour.nights} {t("nights")}
          </span>

          {tour.location && (
            <span className="border flex gap-2 items-center px-4 py-2 rounded-full">
              <MapPin /> {tour.location}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Gallery */}
            <div className="flex sm:flex-row flex-col sm:max-h-[382px] h-[100vh] gap-2 mb-6">
              <div className="flex-col flex-3 row-span-2 relative h-96 rounded-md overflow-hidden">
                <Image
                  src={tour.images?.[0]?.image_url || "/mock-img.png"}
                  alt={tour.address || "tour"}
                  fill
                  className="object-cover max-h-[385px] rounded-xl"
                />
              </div>
              <div className="flex-2 grid grid-cols-2 gap-2">
                {tour.images?.slice(1, 5).map((img: TourImage, idx: number) => (
                  <div
                    key={idx}
                    className="relative h-full rounded-md overflow-hidden"
                  >
                    <Image
                      src={img.image_url}
                      alt={`img-${idx}`}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="w-full overflow-x-auto ">
                <TabsTrigger className="flex justify-start" value="overview">
                  {t("overview")}
                </TabsTrigger>
                <TabsTrigger value="route">{t("route")}</TabsTrigger>
                <TabsTrigger value="include">
                  {t("include_exclude")}
                </TabsTrigger>
                <TabsTrigger value="qa">{t("qa")}</TabsTrigger>
              </TabsList>

              <div className="border-t-2 h-5"></div>

              {/* scroll only the tab content on small screens */}
              <div className="max-h-none touch-scroll">
                <TabsContent value="overview">
                  <section className="prose max-w-none">
                    <h2 className="text-2xl font-medium pb-2">
                      {t("about")} {tour.location || tour.address}
                    </h2>
                    <p className="text-gray-500">{tour.about}</p>

                    <h3 className="text-2xl font-medium pb-2 mt-5">
                      {t("history")}
                    </h3>
                    <p className="text-gray-500">{tour.history}</p>

                    <h4 className="text-2xl font-medium pb-2 mt-5">
                      {t("dates_of_arrival")}
                    </h4>
                    <div className="flex gap-3 flex-wrap mb-6">
                      {(tour.dates || []).map((d: TourDate) => (
                        <div
                          key={d.id}
                          className="pr-3 py-1 border-r text-sm text-gray-500"
                        >
                          {new Date(d.start_date).toLocaleDateString()}
                        </div>
                      ))}
                    </div>

                    <h4 className="text-2xl font-medium pb-2 mt-5">
                      {t("cost_of_living")}
                    </h4>
                    <div className="mb-6 flex flex-col gap-2">
                      <p className="text-gray-500">
                        {t("price_per_person_in_usd")}
                      </p>
                      {(tour.costs || []).map((c: TourCost) => (
                        <div
                          key={c.id}
                          className="flex md:w-1/4 justify-between"
                        >
                          <span className="text-gray-500">{c.title}</span>
                          <span className="text-primary font-medium">
                            +{c.price} {tour.currency} (p/p)
                          </span>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-2xl font-medium pb-2 mt-5">
                      {t("price_notes")}
                    </h3>
                    <p className="text-gray-500">
                      {t("price_notes")}, {t("booking_email")}:{" "}
                      {
                        <span className="font-bold text-primary">
                          {t("booking_email")}
                        </span>
                      }
                    </p>
                  </section>
                </TabsContent>

                <TabsContent value="route">
                  <section className="prose max-w-none">
                    {(tour.routes || []).length === 0 && (
                      <p>{t("no_route_details")}</p>
                    )}

                    <div className="flex gap-6">
                      <div className="w-2">
                        <div className="h-full border-l-2 border-primary ml-2" />
                      </div>

                      <div className="flex-1 space-y-6">
                        {(tour.routes || [])
                          .sort(
                            (a, b) => (a.day_number || 0) - (b.day_number || 0)
                          )
                          .map((r) => {
                            const open = openRouteId === r.id;
                            return (
                              <div key={r.id} className="rounded-md">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenRouteId(open ? null : r.id)
                                  }
                                  className="w-full flex items-center justify-between p-4"
                                >
                                  <div className="text-base font-medium text-left">
                                    <span className="text-gray-500 mr-2">
                                      Day {r.day_number}:
                                    </span>
                                    <span className="font-semibold">
                                      {r.title}
                                    </span>
                                  </div>
                                  <div
                                    className={`transform transition-transform duration-200 ${
                                      open ? "rotate-180" : "rotate-0"
                                    }`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-gray-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </div>
                                </button>

                                <div
                                  className={`${
                                    open ? "block" : "hidden"
                                  } px-4`}
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1">
                                      <div className="relative h-40 w-full rounded-md overflow-hidden">
                                        <Image
                                          src={
                                            r.image?.image_url ||
                                            "/mock-img.png"
                                          }
                                          alt={r.title || `day-${r.day_number}`}
                                          fill
                                          className="object-cover rounded-xl"
                                        />
                                      </div>
                                      {r.address && (
                                        <div className="text-sm text-gray-500 mt-2">
                                          {r.address}
                                        </div>
                                      )}
                                    </div>

                                    <div className="md:col-span-2 prose max-w-none text-gray-600">
                                      <div className="mb-2 font-medium">
                                        {r.title}
                                      </div>
                                      <div>{r.description}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="include">
                  <section className="prose max-w-none">
                    <h4 className="text-2xl font-medium pb-2">
                      {t("include_exclude")}
                    </h4>

                    {tour.include_exclude ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: tour.include_exclude,
                        }}
                      />
                    ) : (
                      <p>
                        Information about included and excluded items is not
                        available.
                      </p>
                    )}
                  </section>
                </TabsContent>

                <TabsContent value="qa">
                  <section className="prose max-w-none">
                    <h3 className="text-3xl font-medium pb-4">{t("qa")}:</h3>
                    {(tour.questions || []).length === 0 && (
                      <p>No questions yet.</p>
                    )}

                    <div className="flex-1 space-y-4">
                      {(tour.questions || []).map((q: TourQuestion) => {
                        const open = openQuestionId === q.id;
                        return (
                          <div key={q.id} className="">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenQuestionId(open ? null : q.id)
                              }
                              className="w-full flex items-center justify-between"
                            >
                              <div className="text-base font-medium py-4 pl-4 text-left border-l-2 border-primary">
                                {q.question}
                              </div>
                              <div
                                className={`transform transition-transform duration-200 ${
                                  open ? "rotate-180" : "rotate-0"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </button>
                            <div
                              className={`px-4 pb-4 text-sm text-gray-600 ${
                                open ? "block" : "hidden"
                              }`}
                            >
                              {q.answer}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </TabsContent>
              </div>
            </Tabs>

            <h4 className="text-2xl font-medium pb-2 mt-10">Location</h4>
            <div className="rounded-md overflow-hidden mb-8">
              <iframe
                title="map"
                className="w-full h-64"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  tour.location || tour.address || ""
                )}&output=embed`}
              />
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div
              ref={bookingRef}
              className="border rounded-2xl p-6 sticky top-6"
            >
              <div className="flex  justify-between items-end border-b-2 pb-2 ">
                <div className="text-3xl text-primary font-medium">
                  $ {tour.price}
                </div>
                <div className="text-sm text-gray-500">
                  {tour.dates?.length || 0} days
                </div>
              </div>

              <form className="mt-6 flex flex-col gap-3">
                <label className="block text-sm font-medium text-gray-700">
                  {t("name_label")}
                </label>
                <input
                  ref={nameInputRef}
                  placeholder={t("name_label")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border p-3 rounded-full px-4"
                />
                <label className="block text-sm font-medium text-gray-700">
                  {t("email_label")}
                </label>
                <input
                  placeholder={t("email_label")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border p-3 rounded-full px-4"
                />
                <label className="block text-sm font-medium text-gray-700">
                  {t("number_of_travelers_label")}
                </label>
                <input
                  placeholder={t("number_of_travelers_label")}
                  value={formData.people}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      people: parseInt(e.target.value) || 1,
                    })
                  }
                  className="border p-3 rounded-full px-4"
                />
              </form>
              <div className="flex justify-between text-primary  mt-2  items-end border-b-2 pb-4">
                <div className="text-lg font-light text-gray-500">
                  {t("total_label")}
                </div>
                <div className="text-3xl text-primary font-medium">
                  $ {tour.price}
                </div>
              </div>

              <Button
                disabled={bookingLoading}
                onClick={handleBookingSubmit}
                className="h-[64px] w-full mt-2 rounded-2xl"
              >
                {bookingLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  t("send")
                )}
              </Button>
            </div>
          </aside>
        </div>
      </main>

      {/* Destinations you might like - show in 3 languages and exclude current tour */}
      <section className="container mx-auto px-6 pb-12">
        <div className="flex items-end justify-between mb-6">
          <span className="text-3xl font-medium">
            {t("destinations_you_might_like")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topSuggestions.length === 0 && (
            <div className="text-gray-500">{t("no_tours_found")}</div>
          )}

          {topSuggestions.map((tt) => (
            <div key={tt.id} className="">
              <TourCard
                id={tt.id}
                title={tt.location || tt.address}
                price={String(tt.price)}
                desc={tt.about || ""}
                about={tt.include_exclude || ""}
                image={tt.images?.[0]?.image_url || "/mock-img.png"}
                days={`${tt.days} ${t("days")}`}
                location={tt.location}
                badge={t("hot_tours")}
              />
            </div>
          ))}
        </div>
      </section>

      <Footer logoUrl={"../logo.png"} />
    </div>
  );
}
