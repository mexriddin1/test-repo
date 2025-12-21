"use client";

import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context";
import TourCard from "@/components/shared/tour-card";
import { getAllCars, findCars } from "@/network/api/car";
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
// we read search params from `window.location.search` on the client to avoid
// `useSearchParams` SSR suspense issues during static prerender
import Footer from "@/components/shared/footer";
import PeopleDropdown from "@/components/ui/people-dropdown";
import DateRangePicker from "@/components/ui/date-range-picker";

const Page = () => {
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useGlobalContext();
  const [activeTab, setActiveTab] = useState<string>("first");
  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchStart, setSearchStart] = useState("");
  const [searchEnd, setSearchEnd] = useState("");
  const [searchPeople, setSearchPeople] = useState<number | "">(2);
  const [searchChildren, setSearchChildren] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  useEffect(() => {
    let mounted = true;

    // read URL params from window on client mount
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
    const address = params.get("address");
    const start = params.get("start");
    const end = params.get("end");
    const peopleParam = params.get("people");

    // set active tab from `show` param if present
    const show = params.get("show");
    if (show === "second") setActiveTab("second");

    setLoading(true);
    setError(null);

    // restore search fields from URL params
    if (address) setSearchLocation(address);
    if (start) setSearchStart(start);
    if (end) setSearchEnd(end ?? "");
    if (peopleParam) setSearchPeople(Number(peopleParam));

    const doFetch = async () => {
      try {
        if (address && start) {
          const args: any = { address, start, end, people: peopleParam };
          if (end) args.end = end;
          const data = await findTours(args as any);
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
  }, []);
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
        if (searchLocation) {
          const data = await findCars({
            title: searchLocation,
            min_price: minPrice === "" ? 0 : minPrice,
            max_price: maxPrice === "" ? undefined : maxPrice,
          });
          if (!mounted) return;
          setCars(data ?? []);
        } else {
          const data = await getAllCars(1, 100);
          if (!mounted) return;
          let items = data?.items ?? [];
          if (minPrice !== "" && minPrice != null)
            items = items.filter(
              (c) => Number(c.price_per_day) >= Number(minPrice)
            );
          if (maxPrice !== "" && maxPrice != null)
            items = items.filter(
              (c) => Number(c.price_per_day) <= Number(maxPrice)
            );
          setCars(items);
        }
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

  const fetchCars = async () => {
    setCarsLoading(true);
    try {
      if (searchLocation) {
        const data = await findCars({
          title: searchLocation,
          min_price: minPrice === "" ? 0 : minPrice,
          max_price: maxPrice === "" ? undefined : maxPrice,
        });
        setCars(data ?? []);
      } else {
        const data = await getAllCars(1, 100);
        let items = data?.items ?? [];
        if (minPrice !== "" && minPrice != null)
          items = items.filter(
            (c) => Number(c.price_per_day) >= Number(minPrice)
          );
        if (maxPrice !== "" && maxPrice != null)
          items = items.filter(
            (c) => Number(c.price_per_day) <= Number(maxPrice)
          );
        setCars(items);
      }
    } catch (err) {
      console.error("Failed to load cars", err);
    } finally {
      setCarsLoading(false);
    }
  };

  const clearSearch = () => {
    try {
      setSearchLocation("");
      setSearchStart("");
      setSearchEnd("");
      setSearchPeople(2);
      setSearchChildren(0);
      setMinPrice("");
      setMaxPrice("");
      // reset URL to base browse without params
      try {
        window.history.replaceState({}, "", `/browse`);
      } catch (e) {}
      // refresh current tab results by fetching full lists
      if (activeTab === "second") {
        (async () => {
          setCarsLoading(true);
          try {
            const data = await getAllCars(1, 100);
            setCars(data?.items ?? []);
          } catch (e) {
            console.error("Failed to load cars", e);
          } finally {
            setCarsLoading(false);
          }
        })();
      } else {
        (async () => {
          setLoading(true);
          try {
            const data = await galAllTours(1, 10);
            setAllTours(data?.items ?? []);
          } catch (e) {
            console.error("Failed to load tours", e);
          } finally {
            setLoading(false);
          }
        })();
      }
    } catch (e) {
      console.error("Failed to clear search", e);
    }
  };

  const fetchTours = async () => {
    console.log("Fetching tours");
    setLoading(true);
    try {
      if (searchLocation) {
        const totalPeople =
          Number(searchPeople || 0) + Number(searchChildren || 0);
        // use start if provided, otherwise default to today
        const startToUse = searchStart || minDate;
        const endToUse = searchEnd || startToUse;
        const args: any = {
          address: searchLocation,
          start: startToUse,
          end: endToUse,
          people: totalPeople,
        };
        const data = await findTours(args as any);
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
          {t("loading")}
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

    return (
      <div className="w-full text-center py-10 text-gray-600">
        {t("no_tours_found")}
      </div>
    );
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
                    <DateRangePicker
                      start={searchStart || undefined}
                      end={searchEnd || undefined}
                      onChange={({ start, end }) => {
                        setSearchStart(start ?? "");
                        setSearchEnd(end ?? "");
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-white text-start text-sm">
                    {t("number_of_travelers")}
                  </span>
                  <PeopleDropdown
                    adults={Number(searchPeople) || 0}
                    children={searchChildren}
                    onChange={({ adults, children }) => {
                      setSearchPeople(adults);
                      setSearchChildren(children);
                    }}
                  />
                </div>

                <div className="flex gap-2 sm:flex-row flex-col items-center mt-2 md:mt-0">
                  <Button
                    onClick={() => {
                      try {
                        const params = new URLSearchParams();
                        if (searchLocation)
                          params.set("address", searchLocation);
                        if (searchStart) params.set("start", searchStart);
                        if (searchEnd) params.set("end", searchEnd);
                        if (searchPeople !== "" && searchPeople != null)
                          params.set(
                            "people",
                            String(
                              Number(searchPeople) + Number(searchChildren || 0)
                            )
                          );
                        window.history.replaceState(
                          {},
                          "",
                          `/browse?${params.toString()}`
                        );
                      } catch (e) {}
                      fetchTours();
                    }}
                    className="rounded-xl sm:flex-1 w-full bg-white hover:bg-gray-200 text-black text-base h-12 md:h-full"
                  >
                    {t("find_tours")}
                  </Button>

                  <button
                    onClick={clearSearch}
                    className="rounded-xl border sm:flex-1 w-full border-white text-white bg-transparent px-4 py-2 h-12 md:h-full"
                    aria-label={t("reset_search")}
                  >
                    {t("reset_search")}
                  </button>
                </div>
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
                    {t("min_price_label")}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder={t("min_placeholder")}
                    className="border p-3 rounded-xl bg-white text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-white text-start text-sm">
                    {t("max_price_label")}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder={t("max_placeholder")}
                    className="border p-3 rounded-xl bg-white text-sm"
                  />
                </div>

                <div className="flex gap-2 items-center mt-2 md:mt-0">
                  <button
                    onClick={() => {
                      try {
                        const params = new URLSearchParams();
                        if (searchLocation)
                          params.set("address", searchLocation);
                        if (minPrice !== "" && minPrice != null)
                          params.set("min_price", String(minPrice));
                        if (maxPrice !== "" && maxPrice != null)
                          params.set("max_price", String(maxPrice));
                        params.set("show", "second");
                        window.history.replaceState(
                          {},
                          "",
                          `/browse?${params.toString()}`
                        );
                      } catch (e) {}
                      fetchCars();
                    }}
                    className="rounded-xl bg-white hover:bg-gray-200 text-black text-base h-12 md:h-full px-4 py-2"
                  >
                    {t("find_tours")}
                  </button>

                  <button
                    onClick={clearSearch}
                    className="rounded-xl border border-white text-white bg-transparent px-4 py-2 h-12 md:h-full"
                    aria-label={t("reset_search")}
                  >
                    {t("reset_search")}
                  </button>
                </div>
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
                  <div className="w-full text-center py-10">{t("loading")}</div>
                )}
                {!carsLoading && cars.length === 0 && (
                  <div className="w-full text-center py-10">
                    {t("no_cars_found")}
                  </div>
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
