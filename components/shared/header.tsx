"use client";

import React from "react";
import {useGlobalContext} from "@/context";

export const Header = ({logoUrl}: { logoUrl?: string }) => {
    const {lang, setLang, t} = useGlobalContext();

    return (
        <div className="flex justify-between px-4 sm:px-42 items-center h-[90px] sm:h-[90px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={logoUrl}
                alt="logo"
                style={{
                    height: "71px",
                    width: "auto",
                }}
                className="object-contain"
            />
            <div className="sm:ml-40  hidden sm:flex items-center gap-2 md:gap-4">
                {["home", "about_us", "articles", "destinations"].map((key) => (
                    <span
                        key={key}
                        className={`text-[18px] hover:underline font-medium cursor-pointer ${key == "destinations" ? "underline" : ""}`}
                    >
    {t(key)}
  </span>
                ))}

            </div>

            <div className="flex items-center justify-between gap-4 sm:gap-8">
                <button
                    onClick={() => setLang("uz")}
                    className={`flex gap-1 sm:gap-2 items-center ${
                        lang === "uz" ? "underline font-semibold" : "text-gray-700"
                    }`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={"https://flagsapi.com/UZ/flat/64.png"}
                        style={{
                            height: "20px",
                            width: "auto",
                        }}
                        alt="Uz"
                    />
                    <span className="font-medium hover:underline text-sm sm:text-xl">UZ</span>
                </button>

                <button
                    onClick={() => setLang("ru")}
                    className={`flex gap-1 sm:gap-2 items-center ${
                        lang === "ru" ? "underline font-semibold" : "text-gray-700"
                    }`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://flagsapi.com/RU/shiny/64.png"
                        style={{
                            height: "20px",
                            width: "auto",
                        }}
                        alt="Ru"
                    />
                    <span className="font-medium hover:underline text-sm sm:text-xl">РУ</span>
                </button>

                {/*<button*/}
                {/*  onClick={() => setLang("en")}*/}
                {/*  className={`flex gap-1 sm:gap-2 items-center ${*/}
                {/*    lang === "en" ? "text-blue-600 font-semibold" : "text-gray-700"*/}
                {/*  }`}*/}
                {/*>*/}
                {/*  /!* eslint-disable-next-line @next/next/no-img-element *!/*/}
                {/*  <img*/}
                {/*    src="https://flagsapi.com/GB/shiny/64.png"*/}
                {/*    style={{*/}
                {/*      height: "20px",*/}
                {/*      width: "auto",*/}
                {/*    }}*/}
                {/*    alt="En"*/}
                {/*  />*/}
                {/*  <span className="font-medium text-sm sm:text-xl">En</span>*/}
                {/*</button>*/}
            </div>
        </div>
    );
};
