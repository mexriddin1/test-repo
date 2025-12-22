"use client";

import { Instagram } from "lucide-react";
import React from "react";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { useGlobalContext } from "@/context";

const Footer = ({ logoUrl }: { logoUrl?: string }) => {
  const { t } = useGlobalContext();

  return (
    <footer className="py-15 px-4 sm:px-10">
      <div className="w-full sm:px-20 px-4 mx-auto sm:items-center flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex items-start text-[#182148] flex-col lg:w-1/3">
          <img
            src={logoUrl}
            alt={t("about")}
            style={{ height: "80px", width: "auto" }}
            className="object-contain"
          />
          <div>
            <p className="text-2xl font-semibold">{t("world_travels")}</p>
            <p className="text-2xl font-semibold">
              20.000+ {t("satisfied_customers")}
            </p>
          </div>
        </div>

        <div className="flex flex-col text-[#182148] underline sm:flex-row justify-center gap-6 sm:gap-16 flex-1 mt-6 lg:mt-0">
          <div className="flex flex-col gap-2 items-start">
            <a href="#" className="text-xl  font-medium">
              {t("home")}
            </a>
            <a href="#" className="text-xl font-medium">
              {t("destinations")}
            </a>
            <a href="#" className="text-xl font-medium">
              {t("articles")}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 text-[#182148] sm:items-end">
          <div className="flex flex-col gap-2">
            <a href="#" className="flex text-xl font-medium hover:opacity-80">
              <span className="text-2xl pe-2">
                <FaTelegram />
              </span>{" "}
              {t("Telegram")}
            </a>
            <a href="#" className="flex text-xl font-medium hover:opacity-80">
              <span className="text-lg pe-2">
                <Instagram />
              </span>{" "}
              {t("Instagram")}
            </a>
            <a href="#" className="flex text-xl font-medium hover:opacity-80">
              <span className="text-2xl pe-2">
                <FaFacebook />
              </span>{" "}
              {t("Facebook")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
