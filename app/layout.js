'use client'; 

import React from 'react';
import '@/assets/styles/globals.css';
import { SessionProvider } from "next-auth/react";
import AuthProvider from '../components/Auth/AuthProvider';
import Navbar from '../components/Navigation/Navbar';
import Footer from '../components/Navigation/Footer';
import HeadMeta from '../components/HeadMeta';

export default function MainLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Logo */}
                <HeadMeta /> 
            </head>
            <body className="h-screen flex flex-col bg-app">
                <SessionProvider>
                        <AuthProvider>
                            <Navbar />
                            <main className="flex-1 overflow-hidden">
                                {children}
                            </main>
                            <Footer />
                        </AuthProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
