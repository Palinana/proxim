import connectDB from "@/config/database";
import Staffing from "@/models/Staffing";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import StaffingList from "@/components/staffing/StaffingList";

export default async function SuperAdminStaffingPage({ searchParams }) {
    await connectDB();

    const params =
        typeof searchParams?.then === "function"
        ? await searchParams
        : searchParams;

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "superadmin") return null;

    // ---- filters from URL ----
    const {
        service,
        age,
        borough,
        zip,
        mandate,
        ei,
        coordinator,
    } = params || {};

    const query = {};

    if (ei) query.caseId = ei;
    if (service) query.serviceType = service;
    // if (status) query.status = status;
    if (age) query.ageRange = age;
    if (borough) query["location.city"] = borough;

    if (zip) {
        query["location.zipcode"] = { $in: zip.split(",") };
    }

    if (coordinator) {
        query.coordinator = coordinator;
    }

    if (mandate) {
        const mandates = mandate.split(",");
        query.$or = mandates.map((m) => {
        const [visits, duration] = m.split("x").map(Number);
        return {
            "workload.visits": visits,
            "workload.duration": duration,
        };
        });
    }

    // ---- data ----
    // FULL list for options
    const staffingsRaw = await Staffing.find(query)
        .populate("coordinator", "first_name last_name email phone role")
        .sort({ createdAt: -1 })
        .lean();

    // FILTERED list for display 
    const allStaffingsRaw = await Staffing.find()
        .populate("coordinator", "first_name last_name email phone role")
        .sort({ createdAt: -1 })
        .lean();

    const normalize = (list) =>
        list.map((s) => ({
        ...s,
        _id: s._id.toString(),
        coordinator: s.coordinator
            ? { ...s.coordinator, _id: s.coordinator._id.toString() }
            : null,
        }));

    const staffings = JSON.parse(JSON.stringify(normalize(staffingsRaw)));

    // for coordinators dropdown
    const adminsRaw = await User.find({ role: "admin" })
        .select("first_name last_name _id")
        .lean();

    const coordinators = adminsRaw.map((a) => ({
        label: `${a.first_name} ${a.last_name}`,
        value: a._id.toString(),
    }));
      
    return (
        <div className="h-full bg-gray-50 px-6 md:px-8 py-6">
            {/* <div className="mx-auto max-w-4xl h-full"> */}
            <div className="mx-auto max-w-[1400px] h-full">
                <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto px-5 py-5">
                        <StaffingList
                            staffings={staffings}
                            allStaffing={normalize(allStaffingsRaw)} 
                            total={staffings.length}
                            admins={coordinators}
                            isSuperadmin={true}
                            coordinators={coordinators} // for dropdown display
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
