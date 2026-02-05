"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HiOutlineTrash } from "react-icons/hi";
import EditStaffingDialog from "./EditStaffingDialog";
import { deleteStaffing } from "@/app/actions/deleteStaffing";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function StaffingTable({ staffings, admins, isSuperadmin }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <div className="relative w-full overflow-auto rounded-lg border border-gray-200 bg-white">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-staffing-card">
                    <TableRow className="border-b border-gray-200">
                        <TableHead>EI #</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Mandate</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Coordinator</TableHead>
                        <TableHead className="w-[120px] text-right" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {staffings.map((s) => {
                        const workloadText = s.workload
                        ? `${s.workload.visits}x${s.workload.duration}`
                        : "—";

                        return (
                            <TableRow
                                key={s._id}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <TableCell className="font-medium py-4">{s.caseId || "N/A"}</TableCell>
                                <TableCell className="py-4">{s.serviceType}</TableCell>
                                <TableCell className="py-4">{workloadText}</TableCell>
                                <TableCell className="py-4">{s.ageRange} mo</TableCell>
                                <TableCell className="py-4 whitespace-nowrap">
                                    {s.location?.city}, {s.location?.state} {s.location?.zipcode}
                                </TableCell>
                                <TableCell className="py-4 whitespace-nowrap">
                                    {s.coordinator
                                        ? `${s.coordinator.first_name} ${s.coordinator.last_name}`
                                        : "—"}
                                </TableCell>

                                <TableCell className="py-4 text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <EditStaffingDialog
                                            staffing={s}
                                            admins={admins}
                                            isSuperadmin={isSuperadmin}
                                        />
                                        <button
                                            onClick={() => {
                                                if (!confirm("Delete this staffing?")) return;
                                                startTransition(async () => {
                                                await deleteStaffing(s._id);
                                                router.refresh();
                                                });
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
