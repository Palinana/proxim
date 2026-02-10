"use client";

import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <Link href="/api/admin/auth/signin" className="btn">
          Continue with Google
        </Link>
      </div>
    </div>
  );
}
