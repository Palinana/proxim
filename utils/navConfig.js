// nav.js
import { AiOutlineHome, AiOutlineStar, AiOutlineFileText, AiOutlineLineChart } from "react-icons/ai";
import { HiOutlineUser } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";

export const NAV_BY_ROLE = {
    public: [
        { label: "Dashboard", href: "/", icon: <AiOutlineHome className="inline-block mr-1" /> },
    ],
    user: [
        { label: "Dashboard", href: "/", icon: <AiOutlineHome className="inline-block mr-1" /> },
        { label: "Saved", href: "/saved", icon: <AiOutlineStar className="inline-block mr-1" /> },
        { label: "Profile", href: "/profile", icon: <HiOutlineUser className="inline-block mr-1" /> },
    ],
    admin: [
        { label: "Dashboard", href: "/", icon: <AiOutlineHome className="inline-block mr-1" /> },
        { label: "My Staffing", href: "/admin/staffing", icon: <FaUserFriends className="inline-block mr-1" /> },
        { label: "Profile", href: "/profile", icon: <HiOutlineUser className="inline-block mr-1" /> },
    ],
    superadmin: [
        { label: "Dashboard", href: "/", icon: <AiOutlineHome className="inline-block mr-1" /> },
        { label: "All Staffings", href: "/superadmin/staffing", icon: <AiOutlineFileText className="inline-block mr-1" /> },
        { label: "Insights", href: "/insights", icon: <AiOutlineLineChart className="inline-block mr-1" /> },
        { label: "Profile", href: "/profile", icon: <HiOutlineUser className="inline-block mr-1" /> },
    ]
};
