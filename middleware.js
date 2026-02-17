// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req) {
//     // const { pathname } = req.nextUrl;

//     // if (pathname === "/" || pathname === "/index") {
//     //     return NextResponse.next();
//     // }

//     // const token = await getToken({
//     //     req,
//     //     secret: process.env.NEXTAUTH_SECRET,
//     // });

//     // if (!token) {
//     //     return NextResponse.redirect(new URL("/", req.url));
//     // }

//     // const role = token.role;
    

//     // if (pathname.startsWith("/admin")) {
//     //     if (role !== "admin" && role !== "superadmin") {
//     //         return NextResponse.redirect(new URL("/", req.url));
//     //     }
//     // }

//     // if (pathname.startsWith("/superadmin")) {
//     //     if (role !== "superadmin") {
//     //         return NextResponse.redirect(new URL("/", req.url));
//     //     }
//     // }
//     const { pathname } = req.nextUrl;

//     // 1. Public routes
//     const publicPaths = [
//         "/",
//     ];

//     if (publicPaths.includes(pathname)) {
//         return NextResponse.next();
//     }

//     // 2. Get token
//     const token = await getToken({
//         req,
//         secret: process.env.NEXTAUTH_SECRET,
//     });

//     // 3. Not logged in
//     if (!token) {
//         return NextResponse.redirect(new URL("/login", req.url));
//     }

//     const role = token.role;

//     // 4. Admin routes
//     if (pathname.startsWith("/admin")) {
//         if (!["admin", "superadmin"].includes(role)) {
//             return NextResponse.redirect(new URL("/auth/error?error=AccessDenied", req.url));
//         }
//     }
      
//     // // 5. Superadmin routes
//     // if (pathname.startsWith("/superadmin")) {
//     //     if (role !== "superadmin") {
//     //         return NextResponse.redirect(new URL("/auth/error?error=AccessDenied", req.url));
//     //     }
//     // }

//     // // Protect / (dashboard)
//     // if (pathname === "/") {
//     //     if (!["admin", "superadmin"].includes(role)) {
//     //         return NextResponse.redirect(new URL("/", req.url));
//     //     }
//     // }
//     if (pathname.startsWith("/admin")) {
//         if (!["admin", "superadmin"].includes(role)) {
//           return NextResponse.redirect(new URL("/", req.url));
//         }
//       }
      
//       if (pathname.startsWith("/superadmin")) {
//         if (role !== "superadmin") {
//           return NextResponse.redirect(new URL("/", req.url));
//         }
//       }
//     //   

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
// };

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
        if (!token || token.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Protect superadmin routes
    if (pathname.startsWith("/superadmin")) {
        if (!token || token.role !== "superadmin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Protect dashboard
    if (pathname === "/") {
        if (!token) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*"],
};
