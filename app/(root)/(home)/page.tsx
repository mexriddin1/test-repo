"use client";

import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "@/context";
import { useRouter } from "next/navigation";
import TourCard from "@/components/shared/tour-card";
import CarCard from "@/components/shared/car-card";
import { galAllTours, getTopTours } from "@/network/api/tours";
import { getAllCars, getTopCars } from "@/network/api/car";
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
import SearchForm from "@/components/shared/search-form";

const Page = () => {
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [topTours, setTopTours] = useState<Tour[]>([]);
  const [topCars, setTopCars] = useState<Car[]>([]);
  const [prefFirst, setPrefFirst] = useState<string>("tours");
  const [selectedTop, setSelectedTop] = useState<string>("tours");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { t } = useGlobalContext();
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchStart, setSearchStart] = useState("");
  const [searchEnd, setSearchEnd] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [searchPeople, setSearchPeople] = useState<number | "">(2);
  const [searchChildren, setSearchChildren] = useState<number>(0);

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
          getTopCars(),
        ]);
        if (!mounted) return;
        setAllTours(toursData ?? []);
        setTopTours((toursData ?? []).slice(0, 5));
        setTopCars(carsData ?? []);
      } catch (err) {
        console.error("Failed to load top items", err);
      }
    };

    load();

    try {
      if (typeof window !== "undefined") {
        const first = localStorage.getItem("browse_first") || "tours";
        setPrefFirst(first);
        setSelectedTop(first);
      }
    } catch (e) {}

    return () => {
      mounted = false;
    };
  }, []);

  const itemsRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveIndex(0);

    setTimeout(() => {
      try {
        const row = itemsRowRef.current;
        if (row && row.children.length > 0) {
          (row.children[0] as HTMLElement).scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      } catch (e) {}
    }, 50);
  }, [selectedTop]);

  useEffect(() => {
    try {
      const row = itemsRowRef.current;
      if (!row) return;
      const el = row.children[activeIndex] as HTMLElement | undefined;
      if (el)
        el.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
    } catch (e) {}
  }, [activeIndex]);

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
              <SearchForm
                variant="tours"
                searchLocation={searchLocation}
                setSearchLocation={setSearchLocation}
                searchStart={searchStart}
                setSearchStart={setSearchStart}
                searchEnd={searchEnd}
                setSearchEnd={setSearchEnd}
                searchPeople={searchPeople}
                setSearchPeople={setSearchPeople}
                searchChildren={searchChildren}
                setSearchChildren={setSearchChildren}
                onFind={() => {
                  const params = new URLSearchParams();
                  if (searchLocation) params.set("address", searchLocation);
                  if (searchStart) params.set("start", searchStart);
                  if (searchEnd) params.set("end", searchEnd);
                  if (searchPeople !== "" && searchPeople != null)
                    params.set(
                      "people",
                      String(Number(searchPeople) + Number(searchChildren || 0))
                    );
                  router.push(`/browse?${params.toString()}`);
                }}
              />
            </TabsContent>
            <TabsContent value="second">
              {/*<SearchForm*/}
              {/*  variant="cars"*/}
              {/*  searchLocation={searchLocation}*/}
              {/*  setSearchLocation={setSearchLocation}*/}
              {/*  minPrice={minPrice}*/}
              {/*  setMinPrice={setMinPrice}*/}
              {/*  maxPrice={maxPrice}*/}
              {/*  setMaxPrice={setMaxPrice}*/}
              {/*  onFind={() => {*/}
              {/*    const params = new URLSearchParams();*/}
              {/*    if (searchLocation) params.set("address", searchLocation);*/}
              {/*    if (minPrice !== "" && minPrice != null)*/}
              {/*      params.set("min_price", String(minPrice));*/}
              {/*    if (maxPrice !== "" && maxPrice != null)*/}
              {/*      params.set("max_price", String(maxPrice));*/}
              {/*    params.set("show", "second");*/}
              {/*    router.push(`/browse?${params.toString()}`);*/}
              {/*  }}*/}
              {/*  setSearchStart={function (v: string): void {*/}
              {/*    throw new Error("Function not implemented.");*/}
              {/*  }}*/}
              {/*  setSearchEnd={function (v: string): void {*/}
              {/*    throw new Error("Function not implemented.");*/}
              {/*  }}*/}
              {/*/>*/}
              <SearchForm
                  variant="tours"
                  searchLocation={searchLocation}
                  setSearchLocation={setSearchLocation}
                  searchStart={searchStart}
                  setSearchStart={setSearchStart}
                  searchEnd={searchEnd}
                  setSearchEnd={setSearchEnd}
                  searchPeople={searchPeople}
                  setSearchPeople={setSearchPeople}
                  searchChildren={searchChildren}
                  setSearchChildren={setSearchChildren}
                  onFind={() => {

                  }}
              />
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
          <div
            ref={itemsRowRef}
            className="flex flex-col sm:flex-row gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-hide snap-y sm:snap-x snap-mandatory px-4 sm:px-10"
          >
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
                      isTopCars={true}
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
            {(() => {
              const displayedCount =
                prefFirst === "cars"
                  ? Math.max(topCars.length, 1)
                  : Math.max(topTours.length, 1);
              return Array.from({ length: displayedCount }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    idx === activeIndex ? "bg-black scale-150" : "bg-gray-500"
                  }`}
                />
              ));
            })()}
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
