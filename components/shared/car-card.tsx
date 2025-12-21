"use client";

import Image from "next/image";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {useGlobalContext} from "@/context";
import {Button} from "@/components/ui/button";
import {createBooking as createCarBooking} from "@/network/api/car";
import {Users, Briefcase, RotateCw} from "lucide-react";

type Props = {
    id?: number;
    title: string;
    price: number | string;
    description?: string;
    image: string;
    seats?: number;
    luggage?: number;
    isTopCars?: boolean;
    transmission?: string;
    unlimited_km?: boolean;
};

export default function CarCard(props: Props) {
    const {t} = useGlobalContext();
    const {
        id,
        title,
        price,
        description,
        image,
        seats = 0,
        luggage = 0,
        isTopCars = false,
        transmission = "",
        unlimited_km = false,
    } = props;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        people: 1,
        start_date: "",
        end_date: "",
    });

    const router = useRouter();

    const openBooking = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        e?.preventDefault();
        setOpen(true);
    };

    const closeBooking = () => setOpen(false);

    const handleConfirm = async () => {
        if (!id) {
            alert(t("error_message") || "Car id is missing");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                people: Number(form.people),
                car_id: Number(id),
                start_date: form.start_date || null,
                end_date: form.end_date || null,
            } as any;

            const ok = await createCarBooking(payload);
            if (ok) {
                alert(t("success_message") || "Booking created");
                setForm({
                    name: "",
                    email: "",
                    phone: "",
                    people: 1,
                    start_date: "",
                    end_date: "",
                });
                closeBooking();
                try {
                    const first =
                        typeof window !== "undefined"
                            ? localStorage.getItem("browse_first")
                            : null;
                    const target =
                        first === "tours" ? "/browse?show=first" : "/browse?show=second";
                    router.push(target);
                } catch (err) {
                    // ignore
                }
            } else {
                alert(t("error_message") || "Booking failed");
            }
        } catch (err) {
            console.error(err);
            alert(t("error_message") || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="rounded-2xl w-full sm:w-[600px] snap-start overflow-hidden transition-shadow duration-150 bg-white shadow-sm">
            <div className="relative h-[260px] sm:h-[340px]">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover rounded-t-2xl"
                />

                {!isTopCars && (
                    <div
                        className="absolute bottom-3 right-3 bg-white text-primary px-4 py-2 font-medium rounded-full text-sm shadow">
                        ${price}/per day
                    </div>)}

                {isTopCars && (
                    <>
                        <h2 className="absolute bottom-10 left-4 right-4 text-white text-xl sm:text-3xl font-medium drop-shadow-lg border-b pb-1 sm:pb-2">
                            {title}
                        </h2>

                        <p className="absolute bottom-4 left-4 text-white/80 line-clamp-1  text-xs sm:text-sm font-light">
                            {description}
                        </p>
                    </>
                )}
            </div>


            <div className="p-4">
                {!isTopCars ? (
                    <><h3 className="text-2xl font-semibold">{title}</h3>
                        {description && (
                            <p className="text-neutral-600 text-sm mt-1 line-clamp-2">
                                {description}
                            </p>
                        )}</>
                ) :  <h3 className="text-xl sm:text-2xl font-medium text-primary">
                    {price}$/{t("per_person")}
                </h3>}

                <div className="flex items-center gap-3 mt-4 text-gray-600">
                    <div className="flex items-center gap-2 border px-3 py-2 rounded-full">
                        <Users size={16}/> <span>{seats}</span>
                    </div>
                    <div className="flex items-center gap-2 border px-3 py-2 rounded-full">
                        <Briefcase size={16}/> <span>{luggage}</span>
                    </div>
                    <div className="flex items-center gap-2 border px-3 py-2 rounded-full">
                        <RotateCw size={16}/> <span>{transmission || "Auto"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                    <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span className="text-gray-600">Unlimited kilometers available</span>
                </div>

                <div className="flex w-full gap-4 mt-6">
                    <Button
                        onClick={openBooking}
                        className="flex-1 h-10 rounded-xl bg-primary text-sm"
                    >
                        {t("sign_up")}
                    </Button>
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <h4 className="text-xl font-medium mb-3">
                            {t("car_booking") || "Car booking"}
                        </h4>

                        <div className="flex flex-col gap-2">
                            <input
                                className="border p-2 rounded"
                                placeholder={t("name") || "Name"}
                                value={form.name}
                                onChange={(e) =>
                                    setForm((s) => ({...s, name: e.target.value}))
                                }
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder={t("email") || "Email"}
                                value={form.email}
                                onChange={(e) =>
                                    setForm((s) => ({...s, email: e.target.value}))
                                }
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder={t("phone") || "Phone"}
                                value={form.phone}
                                onChange={(e) =>
                                    setForm((s) => ({...s, phone: e.target.value}))
                                }
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="date"
                                    className="border p-2 rounded"
                                    value={form.start_date}
                                    onChange={(e) =>
                                        setForm((s) => ({...s, start_date: e.target.value}))
                                    }
                                />
                                <input
                                    type="date"
                                    className="border p-2 rounded"
                                    value={form.end_date}
                                    onChange={(e) =>
                                        setForm((s) => ({...s, end_date: e.target.value}))
                                    }
                                />
                            </div>
                            <input
                                type="number"
                                min={1}
                                className="border p-2 rounded"
                                value={form.people}
                                onChange={(e) =>
                                    setForm((s) => ({...s, people: Number(e.target.value)}))
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="outline" onClick={closeBooking}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="bg-primary"
                            >
                                {loading ? "..." : t("confirm") || "Confirm"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
