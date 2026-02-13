"use client"; 
import React, { useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function getServiceColor(type) {
    switch (type) {
        case "OT": return "bg-service-OT";
        case "PT": return "bg-service-PT";
        case "ST": return "bg-service-ST";
        case "SI": return "bg-service-SI";
        case "ABA": return "bg-service-ABA";
        default: return "bg-gray-400";
    }
}

export default function StaffingCard({ staffing, role, isSelected, onSelect }) {
    const ref = useRef(null);
    const isAdmin = role === "admin";

    const { serviceType, ageRange, workload, location, preferredSchedule, caseId, coordinator } = staffing;

    const workloadText = workload
        ? `${workload.visits}x${workload.duration}/${workload.frequency}`
        : "Not set";

    const coordName = coordinator
        ? `${coordinator.first_name} ${coordinator.last_name}`
        : "Unknown";
    
    // Auto-scroll when selected
    useEffect(() => {
        if (isSelected) {
            ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [isSelected]);

    return (
        <Card
            ref={ref}
            onClick={onSelect}
            className={`
                w-full bg-staffing-card border-default cursor-pointer transition
                ${isSelected ? "selected-card-dashboard" : "hover:bg-muted"}
            `}
            
        >
            <CardHeader className="flex items-start justify-between py-3 px-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${getServiceColor(serviceType)}`} />
                    {serviceType} - {workloadText}
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-0 pb-3 px-4 space-y-1 text-sm">
                {/* <div><strong>Status:</strong> {status}</div> */}
                <div><strong>EI #:</strong> {caseId || "N/A"}</div>
                <div><strong>Age:</strong> {ageRange} months</div>

                <div>
                    <strong>Location:</strong> {location.city}, {location.state} {location.zipcode}
                </div>
                <div>
                    <strong>Preferred Schedule:</strong>{" "}
                    {preferredSchedule?.length ? preferredSchedule.join(", ") : "Any"}
                </div>

                {/* Only show coordinator to superadmin */}
                {!isAdmin && (
                    <div className="pt-2 border-t border-gray-200 text-sm text-muted">
                        <div><strong>Coordinator:</strong> {coordName}</div>
                        <div className="text-xs text-muted-foreground">
                            {coordinator?.email} • {coordinator?.phone || "No phone"}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
