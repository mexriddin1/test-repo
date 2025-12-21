"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/context";

type Props = {
  start?: string;
  end?: string;
  placeholder?: string;
  onChange?: (v: { start: string | null; end: string | null }) => void;
};

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(dateStr: string | null, days: number) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export default function DateRangePicker({
  start,
  end,
  placeholder,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [localStart, setLocalStart] = useState<string | null>(start ?? null);
  const [localEnd, setLocalEnd] = useState<string | null>(end ?? null);
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useGlobalContext();

  useEffect(() => {
    setLocalStart(start ?? null);
    setLocalEnd(end ?? null);
  }, [start, end]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const apply = () => {
    onChange?.({ start: localStart, end: localEnd });
    setOpen(false);
  };

  const quickAdd = (days: number) => {
    if (!localStart) {
      const today = formatDate(new Date());
      setLocalStart(today);
      setLocalEnd(
        formatDate(new Date(new Date().setDate(new Date().getDate() + days)))
      );
      return;
    }
    setLocalEnd(addDays(localStart, days));
  };

  return (
    <div className="relative w-full inline-block" ref={ref}>
      <button
        type="button"
        className="border p-3 rounded-xl bg-white text-sm w-full text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm">
          {localStart && localEnd
            ? `${localStart} — ${localEnd}`
            : placeholder ?? t("check_in_out")}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[520px] bg-white rounded-lg shadow-lg p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium mb-2">{t("start_label")}</div>
              <input
                type="date"
                value={localStart ?? ""}
                onChange={(e) => setLocalStart(e.target.value || null)}
                className="border p-2 rounded-md w-full"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-2">{t("end_label")}</div>
              <input
                type="date"
                value={localEnd ?? ""}
                onChange={(e) => setLocalEnd(e.target.value || null)}
                className="border p-2 rounded-md w-full"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button
              className="px-3 py-2 rounded-full border"
              onClick={() => {
                setLocalStart(null);
                setLocalEnd(null);
              }}
            >
              {t("exact_dates")}
            </button>
            <button
              className="px-3 py-2 rounded-full border"
              onClick={() => quickAdd(1)}
            >
              {t("plus_1_day")}
            </button>
            <button
              className="px-3 py-2 rounded-full border"
              onClick={() => quickAdd(2)}
            >
              {t("plus_2_days")}
            </button>
            <button
              className="px-3 py-2 rounded-full border"
              onClick={() => quickAdd(3)}
            >
              {t("plus_3_days")}
            </button>
            <button
              className="px-3 py-2 rounded-full border"
              onClick={() => quickAdd(7)}
            >
              {t("plus_7_days")}
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 rounded-md bg-gray-100 mr-2"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-primary text-white"
              onClick={apply}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
