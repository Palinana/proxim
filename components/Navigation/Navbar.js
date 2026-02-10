"use client";
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut, getProviders } from "next-auth/react";
import { NAV_BY_ROLE } from "../../utils/navConfig";
import { HiMenu, HiX } from "react-icons/hi"; // hamburger icons
import Image from 'next/image';
import Link from 'next/link';

import logo from '@/assets/images/logo.png';

const Navbar = () => {
    const { data: session } = useSession();
    const role = session?.user?.role || "public";
    const links = NAV_BY_ROLE[role] || NAV_BY_ROLE.public;

    const [providers, setProviders] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const needsPhone = !!session && ["admin"].includes(session.user.role) && !session.user.phone;

    useEffect(() => {
        const setAuthProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };

        setAuthProviders();
    }, []);

    return (
        <header className="bg-surface border-b border border-gray-200 text-text-primary px-6 md:px-8 py-3 flex items-center justify-between h-14 relative">
            {/* Left: Logo */}
            <div className="flex items-center">
                {/* Logo */}
                <Link className='flex flex-shrink-0 items-center' href='/'>
                    <Image className='h-10 w-auto' src={logo} alt='Proxim' />
                    <span className='hidden md:block text-2xl font-bold'>Proxim</span>
                </Link>

                {/* Desktop Links immediately after logo */}
                <nav className="hidden md:flex ml-8 space-x-8">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="flex items-center text-primary text-primary-hover">
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

           {/* Right: Profile notice + Auth + Mobile */}
            {/* <div className="flex items-center space-x-3"> */}
            <div className="flex items-center">
                {needsPhone && (
                    <>
                        <Link
                            href="/profile"
                            className="hidden md:inline-flex items-center text-sm font-medium text-gray-500  underline-offset-2 hover:underline hover:text-gray-600 bg-yellow-100 px-2 py-1 rounded"
                        >
                            Finish your profile - add your phone number
                        </Link>

                        <span className="hidden md:inline px-3 text-gray-400 text-xl">
                            |
                        </span>
                    </>
                )}

                {!session && (
                    providers &&
                    Object.values(providers).map((provider, index) => (
                        <button
                            onClick={() => signIn(provider.id)}
                            key={index}
                            className="hidden md:inline px-3 py-1 rounded btn-primary"
                        >
                            {/* Sign In */} Admin Login
                        </button>
                    ))
                )}

                {session && (
                    <button
                        className="hidden md:inline px-3 py-1 rounded border hover:bg-gray-100"
                        onClick={() =>
                            signOut({ callbackUrl: "http://localhost:3001" })
                        }
                    >
                        Log Out
                    </button>
                )}

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="absolute top-14 left-0 w-full bg-white border-t md:hidden shadow-lg z-50">
                    <nav className="flex flex-col space-y-2 px-4 py-3">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className="text-primary text-primary-hover">
                                {link.label}
                            </Link>
                        ))}

                        {needsPhone && (
                        <div className="md:hidden w-full">
                            <Link
                            href="/profile"
                            className="block w-full text-center text-sm font-medium text-gray-500 underline-offset-2 hover:underline hover:text-gray-600 bg-yellow-100 px-3 py-2 rounded"

                            >
                            Finish your profile - add your phone number
                            </Link>
                        </div>
                        )}

                        {!session && (
                            providers &&
                            Object.values(providers).map((provider, index) => (
                                <button
                                    onClick={() => signIn(provider.id)}
                                    key={index}
                                    className='px-3 py-1 rounded btn-primary text-white hover:bg-blue-700'
                                >
                                    {/* Sign In */}Admin Login
                                </button>
                            ))
                        )}

                        {session && (
                            <button
                                className="px-3 py-1 rounded border hover:bg-gray-100"
                                onClick={() => signOut({
                                    callbackUrl: 'http://localhost:3001', 
                                })}
                            >
                                Log Out
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Navbar;
