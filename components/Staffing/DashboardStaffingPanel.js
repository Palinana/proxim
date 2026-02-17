import StaffingCard from "./StaffingCard";
import DashboardStaffingPanelHeader from "./DashboardStaffingPanelHeader";

export default function DashboardStaffingPanel({ staffings, role, selectedStaffingId, onSelectStaffing }) {
    return (
        <div className="bg-surface h-full flex flex-col">
            <div className="sticky top-0 z-10 border-b border-default">
                <DashboardStaffingPanelHeader total={staffings.length} />
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="space-y-3 p-4">
                    {staffings.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No staffings found for your filters
                        </div>
                    ) : (
                        staffings.map((s) => (
                            <StaffingCard
                                key={s._id}
                                staffing={s}
                                isSelected={s._id === selectedStaffingId}
                                onSelect={() => onSelectStaffing(s._id)}
                                role={role}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
