"use client";

import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context";
import { useRouter } from "next/navigation";
import TourCard from "@/components/shared/tour-card";
import CarCard from "@/components/shared/car-card";
import { galAllTours, getTopTours } from "@/network/api/tours";
import {getAllCars, getTopCars} from "@/network/api/car";
import { Car } from "@/network/model/car";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Header } from "@/components/shared/header";
import {
  CustomTabs,
  TabsContent,
  CustomTabsList,
  CustomTabsTrigger,
} from "@/components/ui/custom-tabs";
import { PaginatedData, Tour } from "@/network/model";
import Footer from "@/components/shared/footer";

const Page = () => {
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [topTours, setTopTours] = useState<Tour[]>([]);
  const [topCars, setTopCars] = useState<Car[]>([]);
  const [prefFirst, setPrefFirst] = useState<string>("tours");
  const [selectedTop, setSelectedTop] = useState<string>("tours");
  const { t } = useGlobalContext();
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchStart, setSearchStart] = useState("");
  const [searchPeople, setSearchPeople] = useState<number | "">(2);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [toursData, carsData] = await Promise.all([
          getTopTours(),
          getAllCars(),
        ]);
        if (!mounted) return;
        setAllTours(toursData ?? []);
        setTopTours((toursData ?? []).slice(0, 5));
        setTopCars(carsData?.items ?? []);
      } catch (err) {
        console.error("Failed to load top items", err);
      }
    };

    load();

    // read preference from localStorage
    try {
      if (typeof window !== "undefined") {
        const first = localStorage.getItem("browse_first") || "tours";
        setPrefFirst(first);
        setSelectedTop(first);
      }
    } catch (e) {
      // ignore
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <div className="lg:min-h-[100vh] sm:min-h-[80vh] flex flex-col">
        <Header logoUrl={"../logo.png"} />

        <div
          className="flex-1 justify-between flex flex-col px-4 sm:px-30 py-10 sm:py-20"
          style={{
            backgroundImage: 'url("/mock-img.png")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-white text-2xl flex flex-col sm:text-3xl lg:text-5xl lg:w-[50%] leading-8 sm:leading-16 container font-medium mb-10">
            {t("tour_full_title")}
          </div>

          {/* TABS */}
          <CustomTabs defaultValue="first" className="w-full">
            <CustomTabsList className="flex">
              <CustomTabsTrigger
                className="rounded-tl-xl flex-1 text-xs sm:text-base"
                value="first"
              >
                {t("through_uzbekistan")}
              </CustomTabsTrigger>
              <CustomTabsTrigger
                className="rounded-tr-xl flex-1 text-xs sm:text-base"
                value="second"
              >
                {t("transport")}
              </CustomTabsTrigger>
            </CustomTabsList>

            <TabsContent value="first">
              <div className="grid p-4 grid-cols-1 md:grid-cols-4 gap-4 w-full bg-primary rounded-br-xl rounded-tr-xl rounded-bl-xl">
                <div className="flex flex-col gap-2">
                  <span className="text-white text-start text-sm">
                    {t("location")}
                  </span>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder={t("location")}
                    className="border p-3 rounded-xl w-full bg-white text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-white text-start text-sm">
                    {t("date")}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={searchStart}
                      onChange={(e) => setSearchStart(e.target.value)}
                      className="border p-3 rounded-xl w-full bg-white text-sm"
                      min={minDate}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-white text-start text-sm">
                    {t("number_of_travelers")}
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={searchPeople}
                    onChange={(e) =>
                      setSearchPeople(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder={String(t("number_of_travelers"))}
                    className="border p-3 rounded-xl bg-white text-sm"
                  />
                </div>

                <Button
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (searchLocation) params.set("address", searchLocation);
                    if (searchStart) params.set("start", searchStart);
                    if (searchPeople !== "" && searchPeople != null)
                      params.set("people", String(searchPeople));
                    router.push(`/browse?${params.toString()}`);
                  }}
                  className="rounded-xl bg-white hover:bg-gray-200 text-black text-base h-12 md:h-full mt-2 md:mt-0"
                >
                  {t("find_tours")}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="second">
              <div className="grid p-4 grid-cols-1 md:grid-cols-4 gap-4 w-full bg-primary rounded-br-xl rounded-tr-xl rounded-bl-xl">
                <div className="flex flex-col gap-2">
                  <span className="text-white text-start text-sm">
                    {t("location")}
                  </span>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder={t("location")}
                    className="border p-3 rounded-xl w-full bg-white text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-white text-start text-sm">
                    {t("date")}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={searchStart}
                      onChange={(e) => setSearchStart(e.target.value)}
                      className="border p-3 rounded-xl w-full bg-white text-sm"
                      min={minDate}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-white text-start text-sm">
                    {t("number_of_travelers")}
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={searchPeople}
                    onChange={(e) =>
                      setSearchPeople(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder={String(t("number_of_travelers"))}
                    className="border p-3 rounded-xl bg-white text-sm"
                  />
                </div>

                <Button
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (searchLocation) params.set("address", searchLocation);
                    if (searchStart) params.set("start", searchStart);
                    if (searchPeople !== "" && searchPeople != null)
                      params.set("people", String(searchPeople));
                    router.push(`/browse?${params.toString()}`);
                  }}
                  className="rounded-xl bg-white hover:bg-gray-200 text-black text-base h-12 md:h-full mt-2 md:mt-0"
                >
                  {t("find_tours")}
                </Button>
              </div>
            </TabsContent>
          </CustomTabs>
        </div>
      </div>

      {/* NUMBERS SECTION */}
      <div className="bg-primary py-10 sm:py-14 text-white flex flex-col px-4 sm:px-30 gap-6 sm:gap-10">
        <h2 className="text-4xl font-bold">{t("our_results_in_numbers")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-6xl font-bold">20,000+</p>
            <p className="font-medium text-xl">{t("happy_customers")}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-6xl font-bold">1,000+</p>
            <p className="font-medium text-xl">{t("certificates_approved")}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-6xl font-bold">21+</p>
            <p className="font-medium text-xl">{t("partners")}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-6xl font-bold">{t("services")}</p>
            <p className="font-medium text-xl">{t("airline_service")}</p>
          </div>
        </div>
      </div>

      {/*/!* OFFER SECTION *!/*/}
      {/*<div className="flex flex-col gap-6 sm:gap-10 py-10 sm:py-20 px-4 sm:px-10">*/}
      {/*    <h2 className="text-2xl sm:text-4xl font-medium">*/}
      {/*        {t("what_we_offer")}*/}
      {/*    </h2>*/}

      {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">*/}
      {/*        {(allTours.length ? allTours.slice(0, 3) : [1, 2, 3]).map(*/}
      {/*            (item: any, idx: number) => {*/}
      {/*                const tourItem = allTours[idx] || item;*/}
      {/*                return (*/}
      {/*                    <div*/}
      {/*                        key={tourItem.id || idx}*/}
      {/*                        className="relative h-[300px] sm:h-[460px] flex w-full rounded-2xl overflow-hidden shadow-lg"*/}
      {/*                    >*/}
      {/*                        <Image*/}
      {/*                            src={tourItem.images?.[0]?.image_url || "/transport.png"}*/}
      {/*                            alt={tourItem.address || "Offer"}*/}
      {/*                            fill*/}
      {/*                            className="object-cover"*/}
      {/*                        />*/}

      {/*                        <div*/}
      {/*                            className="absolute top-3 left-3 text-primary bg-white  px-2 py-1.5 rounded-full font-bold text-xs sm:text-sm">*/}
      {/*                            {String(idx + 1).padStart(2, "0")}*/}
      {/*                        </div>*/}

      {/*                        <div className="absolute bottom-3 left-3 right-3 text-white">*/}
      {/*                            <p className="text-xl sm:text-2xl font-semibold border-b border-white pb-2 sm:pb-4">*/}
      {/*                                {tourItem.address || t("offer")}*/}
      {/*                            </p>*/}
      {/*                            <p className="text-xs sm:text-sm line-clamp-2 opacity-80  h-12 pt-1 sm:pt-2">*/}
      {/*                                {tourItem.about || t("offer_description")}*/}
      {/*                            </p>*/}
      {/*                        </div>*/}
      {/*                    </div>*/}
      {/*                );*/}
      {/*            }*/}
      {/*        )}*/}
      {/*    </div>*/}
      {/*    <div className="flex justify-center w-full">*/}
      {/*        <Button*/}
      {/*            onClick={() => {*/}
      {/*                window.location.href = "/browse";*/}
      {/*            }}*/}
      {/*            className="rounded-xl px-6 py-4 h-[60px] lg:h-[82px] w-full lg:w-1/5 items-center text-base sm:text-xl"*/}
      {/*        >*/}
      {/*            {t("find_tours")}*/}
      {/*        </Button>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {/* TOURS SECTION - Key Change */}
      <div className="flex flex-col gap-6 sm:gap-10 pt-12 pb-10">
        <div className="flex items-center flex-col gap-4 sm:flex-row justify-between">
          <h2 className="text-2xl sm:text-4xl font-medium px-4 sm:px-10">
            {selectedTop === "cars" ? t("top_cars") : t("top_tours")}
          </h2>

          <div className="px-4 sm:px-10">
            <div className="inline-flex gap-2">
              <button
                className={`px-3 py-2 rounded-full text-sm ${
                  selectedTop === "tours"
                    ? "bg-primary text-white"
                    : "bg-white text-black border"
                }`}
                onClick={() => {
                  setSelectedTop("tours");
                  setPrefFirst("tours");
                  try {
                    if (typeof window !== "undefined")
                      localStorage.setItem("browse_first", "tours");
                  } catch (e) {}
                }}
              >
                {t("top_tours")}
              </button>
              <button
                className={`px-3 py-2 rounded-full text-sm ${
                  selectedTop === "cars"
                    ? "bg-primary text-white"
                    : "bg-white text-black border"
                }`}
                onClick={() => {
                  setSelectedTop("cars");
                  setPrefFirst("cars");
                  try {
                    if (typeof window !== "undefined")
                      localStorage.setItem("browse_first", "cars");
                  } catch (e) {}
                }}
              >
                {t("top_cars")}
              </button>
            </div>
          </div>
        </div>

        <section className="w-full flex flex-col">
          <div className="flex flex-col sm:flex-row gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-hide snap-y sm:snap-x snap-mandatory px-4 sm:px-10">
            {prefFirst === "cars"
              ? topCars.length
                ? topCars.map((c: Car, index: number) => (
                    <CarCard
                      key={c.id || index}
                      id={c.id}
                      title={c.title}
                      price={c.price_per_day}
                      description={c.description || ""}
                      image={c.images?.[0]?.image_url || "/mock-img.png"}
                      seats={c.seats}
                      luggage={c.luggage}
                      transmission={c.transmission}
                      unlimited_km={c.unlimited_km}
                    />
                  ))
                : [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl w-full sm:w-1/2 h-[380px] bg-gray-100"
                    />
                  ))
              : topTours.length
              ? topTours.map((tour: Tour, index: number) => (
                  <TourCard
                    id={tour.id}
                    key={tour.id || index}
                    title={tour.address || tour.about || "Tour"}
                    price={tour.price ? `${tour.price}` : "—"}
                    isTopTour={true}
                    about={tour.history || ""}
                    desc={tour.about || ""}
                    image={tour.images?.[0]?.image_url || "/mock-img.png"}
                    days={
                      tour.days
                        ? `${tour.days} ${t("days")} / ${tour.nights} ${t(
                            "nights"
                          )}`
                        : undefined
                    }
                    location={tour.location}
                    badge={index === 0 ? t("hot_tours") : undefined}
                  />
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl w-full sm:w-1/2 h-[380px] bg-gray-100"
                  />
                ))}
          </div>

          <div className="flex justify-center mt-6 sm:mt-10 gap-3 ">
            {(topTours.length ? topTours : Array.from({ length: 3 })).map(
              (_: unknown, index: number) => (
                <button
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    0 === index ? "bg-black scale-150" : "bg-gray-500"
                  }`}
                />
              )
            )}
          </div>
        </section>
      </div>

      {/* ADVANTAGES SECTION */}
      <div className="flex flex-col gap-6 sm:gap-10 px-4 sm:px-10 py-10 sm:py-20">
        <div className="flex flex-col gap-2">
          <span
            className="text-3xl sm:text-5xl font-bold"
            style={{
              background:
                "linear-gradient(90deg, #182148 0%, #667DDA 46%, #182148 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("our_advantages")}
          </span>
          <span
            style={{
              background:
                "linear-gradient(90deg, #182148 0%, #667DDA 46%, #182148 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="text-xl sm:text-3xl font-semibold"
          >
            {t("how_we_differ")}
          </span>
        </div>

        {/* Cards are a column on mobile, 2-col on md, 3-col on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="relative bg-primary/20 border border-gray-300 flex flex-col gap-2 p-4 w-full rounded-2xl overflow-hidden"
            >
              <span className="text-lg sm:text-xl font-semibold">
                Туркия — Европа ва Осиёнинг кесишган нуқтаси
              </span>
              <span className="text-xs sm:text-sm font-normal">
                Istanbulning tarixiy ko‘chalaridan tortib, Antalyadagi
                plyajlargacha —Turkiyada har kim o‘ziga mos sayohat topadi.Qulay
                narxlar, vizasiz kirish, to‘liq xizmat paketi Real Dreams’da.
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/transport.png"
                alt="Transport"
                style={{
                  height: "200px",
                  paddingBottom: "10px",
                }}
                className="rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center w-full">
          <Button
            onClick={() => {
              window.location.href = "/browse";
            }}
            className="rounded-xl px-6 py-4 h-[60px] lg:h-[82px] w-full lg:w-1/5 items-center text-base sm:text-xl"
          >
            {t("find_tours")}
          </Button>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      {/* <div className="flex flex-col gap-6 sm:gap-10 px-4 sm:px-10 sm:py-20 ">
        <div className="flex flex-col gap-2">
          <span
            className="text-3xl sm:text-5xl font-bold"
            style={{
              background:
                "linear-gradient(90deg, #182148 0%, #667DDA 46%, #182148 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("testimonials")}
          </span>
          <span
            style={{
              background:
                "linear-gradient(90deg, #182148 0%, #667DDA 46%, #182148 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="text-xl sm:text-3xl font-semibold"
          >
            {t("tour_description")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 py-10 lg:grid-cols-3 gap-6 w-full">
          {(allTours.length ? allTours.slice(0, 3) : [1, 2, 3]).map(
            (tour: any, idx: number) => (
              <div
                key={tour.id || idx}
                className=" border border-gray-400  flex flex-col gap-4 p-4 sm:p-6 w-full rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={tour.images?.[0]?.image_url || "/mock-img.png"}
                    alt="Client Photo"
                    width={48}
                    height={48}
                    className="rounded-full h-12 w-12 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-base sm:text-lg font-semibold text-blue-950">
                      {tour.address || `Guest ${idx + 1}`}
                    </span>
                    <span className="text-xs text-blue-950">Traveler</span>
                  </div>
                </div>

                <p className="text-sm font-normal leading-relaxed text-gray-600">
                  {tour.about || "Great experience with Real Dreams!"}
                </p>
              </div>
            )
          )}
        </div>
      </div> */}

      {/* ARTICLES SECTION */}
      <div className="bg-primary py-10 sm:py-10 px-4 sm:px-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-white">
          {t("articles")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="relative border bg-white border-gray-300 flex flex-col gap-2 p-4 w-full rounded-2xl overflow-hidden"
            >
              <span className="text-lg sm:text-xl font-semibold">
                Туркия — Европа ва Осиёнинг кесишган нуқтаси
              </span>
              <span className="text-xs sm:text-sm font-normal">
                Istanbulning tarixiy ko‘chalaridan tortib, Antalyadagi
                plyajlargacha —Turkiyada har kim o‘ziga mos sayohat topadi.Qulay
                narxlar, vizasiz kirish, to‘liq xizmat paketi Real Dreams’da.
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/transport.png"
                alt="Transport"
                style={{
                  height: "200px",
                  paddingBottom: "10px",
                }}
                className="rounded-xl object-cover"
              />
              <Button className="bg-[#F0B75A] hover:bg-[#EBA129] rounded-xl px-6 py-4 h-[82px] w-full items-center font-semibold text-2xl">
                Maqolani o’qish
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Footer logoUrl={"logo.png"} />
    </>
  );
};

export default Page;
