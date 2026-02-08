"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardStaffingPanelHeader({ total }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get("sort") || "recent";
    const [isRecent, setIsRecent] = useState(currentSort === "recent");

    // Keep switch in sync with URL changes
    useEffect(() => {
        setIsRecent(currentSort === "recent");
    }, [currentSort]);

    const toggleSort = () => {
        const nextSort = isRecent ? "old" : "recent";
        setIsRecent(!isRecent);

        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", nextSort);

        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between w-full px-4 py-5">
            <div className="text-sm text-primary text-primary-hover font-semibold">Total Staffing: {total}</div>

            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Oldest</span>

                <button
                    onClick={toggleSort}
                    className={`w-10 h-6 rounded-full flex items-center transition-all border border-gray-300
                    ${
                        isRecent ? "bg-primary" : "bg-gray-300"
                    }`}
                    aria-label="Toggle sort"
                >
                <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                        isRecent ? "translate-x-4" : "translate-x-1"
                    }`}
                />
                </button>

                <span className="text-xs text-gray-500">Newest</span>
            </div>
        </div>
    );
}
