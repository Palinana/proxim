"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HiOutlineShare, HiOutlineAdjustments, HiOutlineX  } from "react-icons/hi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelectPopover from "./MultiSelectPopover";
import OutlineButton from "../Elements/OutlineGreenButton";

export default function FilterBar({ coordinators, role, userId, mandateOptions }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const showCoordinatorFilter = role === "superadmin";

    const [open, setOpen] = useState(false);

    const setParam = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (!value) params.delete(key);
        else params.set(key, value);
      
        router.push(`${pathname}?${params.toString()}`);
    };
      
    const setMultiParam = (key, values) => {
        const params = new URLSearchParams(searchParams);
        if (!values.length) params.delete(key);
        else params.set(key, values.join(","));
      
        router.push(`${pathname}?${params.toString()}`);
    };  

    const handleClear = () => {
        router.push(pathname);
    };

    const handleShare = () => {
        const params = new URLSearchParams(searchParams);

        if (role === "admin" && userId) {
            params.set("coordinator", userId);
        }

        const shareUrl = `${window.location.origin}/?${params.toString()}`;
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard");
    }

    const renderFilters = () => (
        <>
            {/* Service */}
            <Select
                value={searchParams.get("service") || ""}
                onValueChange={(v) => setParam("service", v)}
            >
                <SelectTrigger className="h-10 w-full sm:w-[180px] bg-white text-secondary-2 border border-gray-300 rounded-lg">
                    <SelectValue placeholder="Service" />
                </SelectTrigger>

                <SelectContent className="bg-white border border-gray-200">
                    <SelectItem className="bg-white hover:bg-gray-50" value="ST">ST</SelectItem>
                    <SelectItem className="bg-white hover:bg-gray-50" value="OT">OT</SelectItem>
                    <SelectItem className="bg-white hover:bg-gray-50" value="PT">PT</SelectItem>
                    <SelectItem className="bg-white hover:bg-gray-50" value="SI">SI</SelectItem>
                    <SelectItem className="bg-white hover:bg-gray-50" value="ABA">ABA</SelectItem>
                </SelectContent>
            </Select>

            {/* Mandate */}
            <MultiSelectPopover
                label="Mandate"
                options={mandateOptions}
                value={(searchParams.get("mandate") || "").split(",").filter(Boolean)}
                onChange={(vals) => setMultiParam("mandate", vals)}
            />

            {/* Borough */}
            <Select
                value={searchParams.get("borough") || ""}
                onValueChange={(v) => setParam("borough", v)}
            >
                <SelectTrigger className="h-10 w-full sm:w-[180px] bg-white text-secondary-2 border border-gray-300 rounded-lg">
                    <SelectValue placeholder="Borough" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                    <SelectItem className="bg-white hover:bg-gray-50" value="Brooklyn">Brooklyn</SelectItem>
                    <SelectItem className="bg-white hover:bg-gray-50" value="Staten Island">Staten Island</SelectItem>
                </SelectContent>
            </Select>

            {/* ZIP */}
            <MultiSelectPopover
                label="ZIP"
                options={[
                    { label: "10301", value: "10301" },
                    { label: "10302", value: "10302" },
                    { label: "10303", value: "10303" },
                    { label: "10305", value: "10305" },
                    { label: "10306", value: "10306" },
                    { label: "10307", value: "10307" },
                    { label: "10308", value: "10308" },
                    { label: "10309", value: "10309" },
                    { label: "10310", value: "10310" },
                    { label: "10312", value: "10312" },
                ]}
                value={(searchParams.get("zip") || "").split(",").filter(Boolean)}
                onChange={(vals) => setMultiParam("zip", vals)}
            />

            {/* Coordinators */}
            {showCoordinatorFilter && (
                <MultiSelectPopover
                    label="Coordinator"
                    options={coordinators}
                    value={(searchParams.get("coordinator") || "").split(",").filter(Boolean)}
                    onChange={(vals) => setMultiParam("coordinator", vals)}
                />
            )}
        </>
    );

    return (
        <>
            {/* DESKTOP */}
            <div className="hidden sm:flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3 items-center">
                    {renderFilters()}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClear}
                        className="text-sm text-secondary-2 hover:underline !font-bold"
                    >
                        Clear filters
                    </button>

                    <span className="mx-3 h-4 w-px bg-gray-300" />

                    <OutlineButton onClick={handleShare}>
                        <HiOutlineShare className="h-4 w-4 shrink-0" />
                        Share
                    </OutlineButton>
                </div>
            </div>

            {/* MOBILE */}
            <div className="sm:hidden flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOpen(true)}
                        className="w-[140px] flex items-center justify-center gap-2 h-10 bg-white border border-gray-300 rounded-lg text-secondary-2"
                    >
                        <HiOutlineAdjustments />
                        Filters
                    </button>

                    <span className="text-gray-300">|</span>

                    <button
                        onClick={handleClear}
                        className="text-sm text-secondary-2 hover:underline !font-bold"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Right side: Share button */}
                <OutlineButton onClick={handleShare}>
                    <HiOutlineShare className="h-4 w-4 shrink-0" />
                    Share
                </OutlineButton>
            </div>

            {/* MOBILE PANEL */}
            {open && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-lg font-semibold">Filters</div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-500"
                            >
                                <HiOutlineX size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {renderFilters()}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleClear}
                                className="flex-1 border border-gray-300 rounded-lg py-2 font-medium"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="flex-1 bg-primary text-white rounded-lg py-2 font-medium"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
