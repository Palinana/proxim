"use client";

import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EditStaffingDialog from "./EditStaffingDialog";
import { deleteStaffing } from "@/app/actions/deleteStaffing";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function StaffingItem({ staffing, admins, isSuperadmin }) {
    const { serviceType, ageRange, workload, location, preferredSchedule, caseId, coordinator } = staffing;

    const workloadText = workload
        ? `${workload.visits}x${workload.duration}/${workload.frequency}`
        : "Not set";
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <Card className="w-full border-default bg-staffing-card">
            <CardHeader className="flex flex-row items-start justify-between py-3 px-4">
                <div className="flex-1 min-w-0 flex items-center gap-2">
                    <CardTitle className="text-base font-semibold truncate">
                        EI #: {caseId || "N/A"}
                    </CardTitle>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <EditStaffingDialog
                        staffing={staffing}
                        admins={admins}
                        isSuperadmin={isSuperadmin}
                    />

                    <button
                        onClick={() => {
                            if (!confirm("Delete this staffing?")) return;
                            startTransition(async () => {
                            await deleteStaffing(staffing._id);
                            router.refresh();
                            });
                        }}
                    className="text-red-600 hover:text-red-800"
                    >
                        <HiOutlineTrash />
                    </button>
                </div>
            </CardHeader>

            <CardContent className="pt-0 pb-3 px-4 space-y-1 text-sm">

                <div>
                    <strong>Service:</strong> {serviceType}
                </div>
                <div>
                    <strong>Mandate:</strong> {workloadText}
                </div>
                <div>
                    <strong>Age:</strong> {ageRange} months
                </div>
                <div>
                    <strong>Location:</strong> {location?.city}, {location?.state} {location?.zipcode}
                </div>
                <div>
                    <strong>Preferred Schedule:</strong>{" "}
                    {preferredSchedule?.length ? preferredSchedule.join(", ") : "Any"}
                </div>

                {isSuperadmin && coordinator &&  (
                    <div className="pt-2 border-t border-gray-200 text-xs text-muted text-muted-foreground">
                        <div>
                            <strong>Coordinator:</strong>{" "}
                            {coordinator.first_name} {coordinator.last_name}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
