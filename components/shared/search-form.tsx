"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/ui/date-range-picker";
import PeopleDropdown from "@/components/ui/people-dropdown";
import { useGlobalContext } from "@/context";

interface Props {
  variant: "tours" | "cars";
  searchLocation: string;
  setSearchLocation: (v: string) => void;
  searchStart?: string;
  setSearchStart: (v: string) => void;
  searchEnd?: string;
  setSearchEnd: (v: string) => void;
  searchPeople?: number | "";
  setSearchPeople?: (v: number | "") => void;
  searchChildren?: number;
  setSearchChildren?: (v: number) => void;
  minPrice?: number | "";
  setMinPrice?: (v: number | "") => void;
  maxPrice?: number | "";
  setMaxPrice?: (v: number | "") => void;
  onFind: () => void;
}

const SearchForm: React.FC<Props> = ({
  variant,
  searchLocation,
  setSearchLocation,
  searchStart,
  setSearchStart,
  searchEnd,
  setSearchEnd,
  searchPeople,
  setSearchPeople,
  searchChildren,
  setSearchChildren,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onFind,
}) => {
  const { t } = useGlobalContext();

  return (
    <div className="grid p-4 grid-cols-1 md:grid-cols-4 gap-4 w-full bg-primary rounded-br-xl rounded-tr-xl rounded-bl-xl">
      <div className="flex flex-col gap-2">
        <span className="text-white text-start text-sm">{t("location")}</span>
        <input
          type="text"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          placeholder={t("location")}
          className="border p-3 rounded-xl w-full bg-white text-sm"
        />
      </div>

      {variant === "tours" ? (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-white text-start text-sm">{t("date")}</span>
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
              children={searchChildren || 0}
              onChange={({ adults, children }) => {
                setSearchPeople?.(adults);
                setSearchChildren?.(children || 0);
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-white text-start text-sm">
              {t("min_price_label")}
            </span>
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) =>
                setMinPrice?.(
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
                setMaxPrice?.(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              placeholder={t("max_placeholder")}
              className="border p-3 rounded-xl bg-white text-sm"
            />
          </div>
        </>
      )}

      <Button
        onClick={onFind}
        className="rounded-xl bg-white hover:bg-gray-200 text-black text-base h-12 md:h-full mt-2 md:mt-0"
      >
        {t("find_tours")}
      </Button>
    </div>
  );
};

export default SearchForm;
