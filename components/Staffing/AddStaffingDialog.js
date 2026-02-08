"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HiOutlinePlus } from "react-icons/hi";
import OutlineButton from "../Elements/OutlineGreenButton";
import StaffingForm from "./StaffingForm";
import { addStaffing } from "@/app/actions/addStaffing";

export default function AddStaffingDialog({ admins = [], isSuperadmin = false }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // blank default values for new staffing
    const emptyStaffing = {
        serviceType: "",
        //   status: "",
        age: "",
        caseId: "",

        // prefilling state and city
        location: { city: "Staten Island", state: "NY", zipcode: "" },
        workload: { visits: "", duration: "", frequency: "Weekly" },
        preferredSchedule: [],
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <OutlineButton>
                        <HiOutlinePlus className="h-4 w-4 shrink-0" />
                        Add Staffing
                    </OutlineButton>
                </DialogTrigger>

                <DialogContent className="bg-white shadow-lg rounded-2xl max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Staffing</DialogTitle>
                    </DialogHeader>

                    <form
                        action={(formData) => {
                            startTransition(async () => {
                                await addStaffing(formData);
                                router.refresh();
                                setOpen(false);
                            });
                        }}
                    >
                      <StaffingForm
                          staffing={emptyStaffing}
                          admins={admins}
                          isSuperadmin={isSuperadmin}
                          isPending={isPending}
                      />
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
