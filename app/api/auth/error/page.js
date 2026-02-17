import Link from "next/link";

export default function AuthErrorPage() {
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-md w-full text-center px-4 -translate-y-16">
                    <h1 className="text-2xl font-bold mb-3">Login Failed</h1>
                    <Link
                        href="/"
                        className="inline-block px-6 py-2 rounded bg-tertiary text-white "
                    >
                        Go back
                    </Link>
                </div>
            </div>
      </div>
    );
}
