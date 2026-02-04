"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EditStaffingDialog from "./EditStaffingDialog";
import { deleteStaffing } from "@/app/actions/deleteStaffing";

export default function StaffingTable({ staffings }) {
    return (
        <div className="relative w-full overflow-auto rounded-lg border bg-white">
            <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                        <TableHead>EI #</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Mandate</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Coordinator</TableHead>
                        {/* <TableHead className="text-right">Contact</TableHead> */}
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
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <TableCell className="font-medium">
                                {s.caseId || "N/A"}
                            </TableCell>

                            <TableCell>{s.serviceType}</TableCell>

                            <TableCell>{workloadText}</TableCell>

                            <TableCell>{s.ageRange} mo</TableCell>

                            <TableCell className="whitespace-nowrap">
                                {s.location?.city}, {s.location?.state} {s.location?.zipcode}
                            </TableCell>

                            <TableCell className="whitespace-nowrap">
                            {s.coordinator
                                ? `${s.coordinator.first_name} ${s.coordinator.last_name}`
                                : "—"}
                            </TableCell>

                            <TableCell className="text-right text-xs text-muted-foreground">
                            {s.coordinator?.email}
                            <br />
                            {s.coordinator?.phone || "No phone"}
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
