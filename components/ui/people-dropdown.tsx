"use client";

import React, { useState } from "react";
import { useGlobalContext } from "@/context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Props = {
  adults?: number;
  children?: number;
  onChange?: (v: { adults: number; children: number; rooms: number }) => void;
};

export default function PeopleDropdown({
  adults = 2,
  children = 0,
  onChange,
}: Props) {
  const { t } = useGlobalContext();

  const [a, setA] = useState(adults);
  const [c, setC] = useState(children);

  const clamp = (v: number, min = 0, max = 99) =>
    Math.max(min, Math.min(max, v));

  const summary = `${a} ${t("adults")} · ${c} ${t("children")}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="border p-3 rounded-xl bg-white text-sm flex items-center justify-between">
          <span className="text-sm">{summary}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px] p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{t("adults")}</div>
              <div className="text-xs text-muted-foreground">
                {t("adults_age_hint")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-9 h-9 rounded-md border"
                onClick={() => setA((v) => clamp(v - 1, 1))}
                aria-label={`${t("decrease")} ${t("adults")}`}
              >
                —
              </button>
              <div className="w-8 text-center">{a}</div>
              <button
                className="w-9 h-9 rounded-md border"
                onClick={() => setA((v) => clamp(v + 1))}
                aria-label={`${t("increase")} ${t("adults")}`}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{t("children")}</div>
              <div className="text-xs text-muted-foreground">
                {t("children_age_hint")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-9 h-9 rounded-md border"
                onClick={() => setC((v) => clamp(v - 1))}
                aria-label={`${t("decrease")} ${t("children")}`}
              >
                —
              </button>
              <div className="w-8 text-center">{c}</div>
              <button
                className="w-9 h-9 rounded-md border"
                onClick={() => setC((v) => clamp(v + 1))}
                aria-label={`${t("increase")} ${t("children")}`}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => onChange?.({ adults: a, children: c, rooms: 0 })}
              className="w-full"
            >
              {t("done")}
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
