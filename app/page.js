import connectDB from "@/config/database";
import Staffing from "@/models/Staffing";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

import DashboardClient from "../components/Dashboard/DashboardClient";
import StaffingMap from "../components/Map/StaffingMap";
import FilterBar from "../components/Filter/FilterBar";
import StaffingPanel from "../components/Staffing/StaffingPanel";
import MobileStaffingToggle from "@/components/Staffing/MobileStaffingToggle";

const Dashboard = async ({ searchParams }) => {
    await connectDB();

    const params = await searchParams;

    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const userId = session?.user?.id;

    const query = {};

    // ADMIN ONLY: see only their own staffings
    if (role === "admin") {
        query.coordinator = userId;
    }
     
    // PUBLIC/USER/SUPERADMIN: filter by coordinator if provided
    if (params?.coordinator) {
        query.coordinator = params.coordinator;
    }

    // PUBLIC: share link by admin ID
    if (!role && params?.admin) {
        query.coordinator = params.admin;
    }
      
    // Filters
    if (params?.borough) query["location.city"] = params.borough;
    if (params?.service) query.serviceType = params.service;
    if (params?.status) query.status = params.status;

    if (params?.zip) {
        query["location.zipcode"] = { $in: params.zip.split(",") };
    }

    // Mandate filter (visits x duration)
    if (params?.mandate) {
        const mandates = params.mandate.split(",");
        const mandateQueries = mandates.map((m) => {
        const [visits, duration] = m.split("x").map(Number);
        return {
            "workload.visits": visits,
            "workload.duration": duration,
        };
        });
        query.$or = mandateQueries;
    }

    const sort = params?.sort === "old" ? 1 : -1;

    const staffingsRaw = await Staffing.find(query)
        .populate("coordinator", "first_name last_name email phone role")
        .sort({ createdAt: sort })
        .lean();

    const staffings = staffingsRaw.map((s) => ({
        ...s,
        _id: s._id.toString(),
        createdAt: s.createdAt?.toISOString(),
        updatedAt: s.updatedAt?.toISOString(),
        coordinator: s.coordinator
            ? {
                ...s.coordinator,
                _id: s.coordinator._id.toString(),
            }
            : null,
    }));
        
    const coordinators = await User.find({ role: "admin" })
        .select("first_name last_name _id")
        .lean();

    const coordinatorOptions = coordinators.map((c) => ({
        label: `${c.first_name} ${c.last_name}`,
        value: c._id.toString(),
    }));

    return (
        <div className="flex flex-col h-full">
            <div className="border-b border-default bg-background px-4 md:px-6 lg:px-8 py-5">
                <FilterBar coordinators={coordinatorOptions} role={role} userId={userId}/>
            </div>

            <DashboardClient staffings={staffings} />
        </div>
    );
};

export default Dashboard;
