"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HiOutlinePencil } from "react-icons/hi";
import StaffingForm from "./StaffingForm";
import { updateStaffing } from "@/app/actions/updateStaffing";

export default function EditStaffingDialog({ staffing, admins, isSuperadmin }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  return (
      <>
          <button onClick={() => setOpen(true)}>
              <HiOutlinePencil />
          </button>
    
          <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="bg-white shadow-lg rounded-2xl max-w-lg">
                  <DialogHeader>
                      <DialogTitle>Edit Staffing</DialogTitle>
                  </DialogHeader>
        
                <form
                    action={(formData) => {
                        startTransition(async () => {
                            await updateStaffing(staffing._id, formData);
                            router.refresh();
                            setOpen(false);
                        });
                    }}
                >
                    <StaffingForm
                        staffing={staffing}
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
