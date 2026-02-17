"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelectPopover from "./MultiSelectPopover";
import { HiOutlineAdjustments, HiOutlineX } from "react-icons/hi";

export default function FilterBarAdminPage({ staffings = [], allStaffing = [], showCoordinator = false, coordinators = [] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // URL PARAM HELPERS
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

    //DATA
    const eiList = allStaffing || staffings;

    const uniqueEIs = Array.from(
        new Set((eiList || []).map((s) => s.caseId).filter(Boolean))
    );

    const mandateOptions = Array.from(
        new Set(
            (allStaffing || staffings)
                .map((s) => s.workload)
                .filter(Boolean)
                .map((w) => `${w.visits}x${w.duration}`)
        )
    )
        .sort()
        .map((m) => ({ label: m, value: m }));

    const uniqueZips = Array.from(
        new Set(
            (allStaffing || staffings)
            .map((s) => s.location?.zipcode)
            .filter(Boolean)
        )
    ).sort();
      
    const handleClear = () => {
        router.push(pathname);
        setOpen(false);
    };

    const renderFilters = () => (
        <>
            {/* EI # */}
            <Select
                value={searchParams.get("ei") || ""}
                onValueChange={(v) => setParam("ei", v)}
            >
                <SelectTrigger className="h-10 w-full sm:w-[130px] bg-white text-secondary-2 border border-gray-300 rounded-lg">
                    <SelectValue placeholder="EI #" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                    {uniqueEIs.map((ei) => (
                        <SelectItem key={ei} value={ei}>
                            {ei}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Service */}
            <Select
                value={searchParams.get("service") || ""}
                onValueChange={(v) => setParam("service", v)}
            >
                <SelectTrigger className="h-10 w-full sm:w-[130px] bg-white text-secondary-2 border border-gray-300 rounded-lg">
                    <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="OT">OT</SelectItem>
                    <SelectItem value="PT">PT</SelectItem>
                    <SelectItem value="SI">SI</SelectItem>
                    <SelectItem value="ABA">ABA</SelectItem>
                </SelectContent>
            </Select>

            {/* Mandate */}
            <MultiSelectPopover
                label="Mandate"
                options={mandateOptions}
                value={(searchParams.get("mandate") || "")
                    .split(",")
                    .filter(Boolean)}
                onChange={(vals) => setMultiParam("mandate", vals)}
            />

            {/* Borough */}
            <Select
                value={searchParams.get("borough") || ""}
                onValueChange={(v) => setParam("borough", v)}
            >
                <SelectTrigger className="h-10 w-full sm:w-[130px] bg-white text-secondary-2 border border-gray-300 rounded-lg">
                    <SelectValue placeholder="Borough" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                    <SelectItem value="Staten Island">Staten Island</SelectItem>
                </SelectContent>
            </Select>

            {/* ZIP */}
            <MultiSelectPopover
                label="ZIP"
                options={uniqueZips.map((item) => ({ label: item, value: item }))}
                value={(searchParams.get("zip") || "")
                    .split(",")
                    .filter(Boolean)}
                onChange={(vals) => setMultiParam("zip", vals)}
            />

            {/* Coordinator */}
            {showCoordinator && (
                <MultiSelectPopover
                    label="Coordinator"
                    options={coordinators}
                    value={(searchParams.get("coordinator") || "")
                        .split(",")
                        .filter(Boolean)}
                    onChange={(vals) =>
                        setMultiParam("coordinator", vals)
                    }
                />
            )}
        </>
    );

    return (
        <>
            {/* DESKTOP FILTER BAR */}
            <div className="hidden sm:block border border-gray-200 bg-staffing-card rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {renderFilters()}
                    </div>

                    <button
                        onClick={handleClear}
                        className="text-sm font-semibold text-secondary-2 hover:underline whitespace-nowrap"
                    >
                        Clear filters
                    </button>
                </div>
            </div>

            {/* MOBILE FILTER BUTTON */}
            <div className="sm:hidden flex items-center w-full justify-between">
                {/* Left side: Filters button */}
                <button
                    onClick={() => setOpen(true)}
                    className="w-[140px] flex items-center justify-center gap-2 h-10 bg-white border border-gray-300 rounded-lg text-secondary-2"
                >
                    <HiOutlineAdjustments />
                    Filters
                </button>

                {/* Right side: Clear text */}
                <button
                    onClick={handleClear}
                    className="text-sm text-secondary-2 hover:underline !font-bold"
                >
                    Clear Filters
                </button>
            </div>
            
            {/* MOBILE FILTER PANEL */}
            {open && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-lg font-semibold">
                                Filters
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-500"
                            >
                                <HiOutlineX size={20} />
                            </button>
                        </div>

                        {/* Filters (FULL WIDTH ON MOBILE) */}
                        <div className="flex flex-col gap-3">
                            {renderFilters()}
                        </div>

                        {/* Actions */}
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

