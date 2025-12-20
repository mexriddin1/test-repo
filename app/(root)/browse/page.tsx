"use client";

import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context";
import TourCard from "@/components/shared/tour-card";
import { getAllCars } from "@/network/api/car";
import CarCard from "@/components/shared/car-card";
import { Car } from "@/network/model/car";
import { galAllTours } from "@/network/api/tours";
import { findTours } from "@/network/api/tours";
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
import { useSearchParams } from "next/navigation";
import Footer from "@/components/shared/footer";

const Page = () => {
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useGlobalContext();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(
    searchParams?.get("show") === "second" ? "second" : "first"
  );
  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(false);
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

    const address = searchParams?.get("address");
    const start = searchParams?.get("start");
    const people = searchParams?.get("people");

    setLoading(true);
    setError(null);

    const doFetch = async () => {
      try {
        if (address && start) {
          const data = await findTours({ address, start, people });
          if (!mounted) return;
          setAllTours(data ?? []);
        } else {
          const data = await galAllTours(1, 10);
          if (!mounted) return;
          setAllTours(data?.items ?? []);
        }
      } catch (err: any) {
        console.error("Failed to load tours", err);
        if (!mounted) return;
        setError(err?.message || "Failed to load tours");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    doFetch();

    return () => {
      mounted = false;
    };
  }, [searchParams]);

  // detect which tab is first in the DOM and store preference
  // detect which tab is first in the DOM and store preference (runs once)
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const list = document.querySelector('[data-slot="tabs-list"]');
      if (!list) return;
      const first = list.children[0];
      if (!first) return;
      const firstText = first.textContent?.trim().toLowerCase() || "";
      const tourLabel = (t("through_uzbekistan") || "")
        .toString()
        .toLowerCase();
      if (tourLabel && firstText.includes(tourLabel)) {
        localStorage.setItem("browse_first", "tours");
      } else {
        localStorage.setItem("browse_first", "cars");
      }
    } catch (err) {
      // ignore
    }
    // only run once after mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch cars when activeTab changes to second
  useEffect(() => {
    let mounted = true;
    const doFetchCars = async () => {
      if (activeTab !== "second") return;
      setCarsLoading(true);
      try {
        const data = await getAllCars(1, 12);
        if (!mounted) return;
        setCars(data?.items ?? []);
      } catch (err) {
        console.error("Failed to load cars", err);
      } finally {
        if (mounted) setCarsLoading(false);
      }
    };

    doFetchCars();
    return () => {
      mounted = false;
    };
  }, [activeTab]);

  const fetchTours = async () => {
    console.log("Fetching tours");
    setLoading(true);
    try {
      if (searchLocation && searchStart) {
        const data = await findTours({
          address: searchLocation,
          start: searchStart,
          people: searchPeople,
        });
        setAllTours(data ?? []);
      } else {
        const data = await galAllTours(1, 10);
        setAllTours(data?.items ?? []);
      }
    } catch (err: any) {
      console.error("Failed to load tours", err);
      setError(err?.message || "Failed to load tours");
    } finally {
      setLoading(false);
    }
  };

  const renderTours = () => {
    if (loading)
      return (
        <div className="w-full flex items-center justify-center">
          Loading...
        </div>
      );
    if (error) return <div className="w-full text-red-600">{error}</div>;
    if (allTours.length) {
      return allTours.map((tour, index) => (
        <TourCard
          id={tour.id}
          key={tour.id || index}
          title={tour.address || tour.about || "Tour"}
          price={tour.price ? `${tour.price} ${tour.currency || ""}` : "—"}
          desc={tour.about || ""}
          about={tour.history || ""}
          isTopTour={false}
          image={tour.images?.[0]?.image_url || "/mock-img.png"}
          days={
            tour.days
              ? `${tour.days} ${t("days")} / ${tour.nights} ${t("nights")}`
              : undefined
          }
          location={tour.location}
          badge={index === 0 ? t("hot_tours") : undefined}
        />
      ));
    }

    return [1, 2, 3].map((i) => (
      <div
        key={i}
        className="rounded-2xl w-full sm:w-1/2 h-[380px] bg-gray-100"
      />
    ));
  };

  return (
    <>
      {/* HERO SECTION */}
      <div className="lg:min-h-[70vh] flex flex-col">
        <Header logoUrl={"../logo.png"} />

        <div className="flex-1 w-full text-center justify-between flex flex-col px-4 sm:px-30 py-10 sm:py-20">
          <h1 className="text-5xl font-medium mb-2 leading-snug">
            {t("hero_title_top")}{" "}
            <span className="text-primary"> {t("hero_title_highlight")} </span>
            {t("hero_title_bottom")}
          </h1>

          {/* TABS */}
          <CustomTabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v);
              try {
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    "browse_first",
                    v === "first" ? "tours" : "cars"
                  );
                }
              } catch (err) {
                // ignore
              }
            }}
            className="w-full md:mt-0 mt-12"
          >
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
                  onClick={() => fetchTours()}
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

                {/* Button is full width on mobile */}
                <Button
                  onClick={() => fetchTours()}
                  className="rounded-xl bg-white hover:bg-gray-200 text-black text-base h-12 md:h-full mt-2 md:mt-0"
                >
                  {t("find_tours")}
                </Button>
              </div>
            </TabsContent>
          </CustomTabs>
        </div>
      </div>

      {/* MAIN LIST SECTION */}
      <div className="flex flex-col gap-6 sm:gap-10 pb-10">
        {activeTab === "first" ? (
          <>
            <h2 className="text-2xl sm:text-4xl font-medium px-4 sm:px-10">
              {t("tours")}
            </h2>

            <section className="w-full flex flex-col">
              <div className="flex flex-col sm:flex-row gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-hide snap-y sm:snap-x snap-mandatory px-4 sm:px-10">
                {renderTours()}
              </div>
            </section>
          </>
        ) : (
          <>
            <h2 className="text-2xl sm:text-4xl font-medium px-4 sm:px-10">
              {t("cars")}
            </h2>

            <section className="w-full flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-10">
                {carsLoading && (
                  <div className="w-full text-center py-10">
                    Loading cars...
                  </div>
                )}
                {!carsLoading && cars.length === 0 && (
                  <div className="w-full text-center py-10">No cars found.</div>
                )}

                {!carsLoading &&
                  cars.map((c) => (
                    <CarCard
                      key={c.id}
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
                  ))}
              </div>
            </section>
          </>
        )}
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
      </div>

      <Footer logoUrl={"logo.png"} />
    </>
  );
};

export default Page;
