import connectDB from "@/config/database";
import Staffing from "@/models/Staffing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import StaffingList from "@/components/staffing/StaffingList";

export default async function AdminStaffingPage({ searchParams }) {
    await connectDB();

    const params =
    typeof searchParams?.then === "function"
        ? await searchParams
        : searchParams;

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return null;

    const userId = session.user.id;

    // Server side params (plain object)
    const service = params?.service;
    const status = params?.status;
    const borough = params?.borough;
    const zip = params?.zip;
    const mandate = params?.mandate;
    const ei = params?.ei;

    const query = { coordinator: userId };

    if (ei) query.caseId = ei;
    if (service) query.serviceType = service;
    if (status) query.status = status;
    if (borough) query["location.city"] = borough;

    if (zip) {
        query["location.zipcode"] = { $in: zip.split(",") };
    }

    if (mandate) {
        const mandates = mandate.split(",");
        const mandateQueries = mandates.map((m) => {
        const [visits, duration] = m.split("x").map(Number);
        return {
            "workload.visits": visits,
            "workload.duration": duration,
        };
        });
        query.$or = mandateQueries;
    }

    const normalize = (list) =>
        list.map((s) => ({
          ...s,
          _id: s._id.toString(),
          coordinator: s.coordinator
            ? { ...s.coordinator, _id: s.coordinator._id.toString() }
            : null,
        }));
      
    const staffings = await Staffing.find(query)
        .populate("coordinator", "first_name last_name email phone role")
        .sort({ createdAt: -1 })
        .lean();
      
    const allStaffingsRaw = await Staffing.find({ coordinator: userId })
        .populate("coordinator", "first_name last_name email phone role")
        .lean();
    const plainStaffings = JSON.parse(JSON.stringify(normalize(staffings)));
    const allStaffings = JSON.parse(JSON.stringify(normalize(allStaffingsRaw)));

    return (
        <div className="h-full bg-gray-50 px-6 md:px-8 py-6">
            <div className="mx-auto max-w-4xl h-full">
                <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto px-5 py-5">
                        <StaffingList
                            staffings={plainStaffings}
                            allStaffing={allStaffings} // for filtering options
                            total={plainStaffings.length}
                            admins={[]}
                            isSuperadmin={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
