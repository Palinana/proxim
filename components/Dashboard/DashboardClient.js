"use client";

import { useState, useMemo } from "react";
import DashboardStaffingMap from "../Map/DashboardStaffingMap";
import DashboardStaffingPanel from "../Staffing/DashboardStaffingPanel";
import MobileStaffingToggle from "@/components/Staffing/MobileStaffingToggle";

export default function DashboardClient({ staffings, role }) {
    const [selectedStaffingId, setSelectedStaffingId] = useState(null);
    const [open, setOpen] = useState(false);

    const selectedStaffing = useMemo(
        () => staffings.find(s => s._id === selectedStaffingId),
        [staffings, selectedStaffingId]
    );

    return (
        // <div className="flex flex-1 h-full overflow-hidden bg-card">
        <div className="flex h-[100dvh] overflow-hidden bg-card">
            {/* Desktop sidebar */}
            <aside className="hidden md:block w-[420px] lg:w-[480px] border-r border-default overflow-y-auto">
                <DashboardStaffingPanel
                    staffings={staffings}
                    selectedStaffingId={selectedStaffingId}
                    onSelectStaffing={setSelectedStaffingId}
                    role={role}
                />
            </aside>
    
            {/* Map */}
            <section className="flex-1 relative pb-16 md:pb-0">
                <DashboardStaffingMap
                    staffings={staffings}
                    selectedStaffingId={selectedStaffingId}
                    onSelectStaffing={setSelectedStaffingId}
                />

                <MobileStaffingToggle open={open} setOpen={setOpen}>
                    <DashboardStaffingPanel
                        staffings={staffings}
                        selectedStaffingId={selectedStaffingId}
                        onSelectStaffing={setSelectedStaffingId}
                    />
                </MobileStaffingToggle>

                {/* MOBILE BUTTON */}
                <div className="md:hidden absolute inset-x-0 bottom-0 h-16 flex items-center justify-center pointer-events-none">
                    <button
                        className="pointer-events-auto px-4 py-2 rounded-lg bg-primary text-white shadow"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? "Hide staffing" : "Show staffing"}
                    </button>
                </div>
            </section>
        </div>
    );
}
