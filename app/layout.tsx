'use client';
import './globals.css';
import LeftNav from './components/LeftNav';
import Providers from "@/app/providers";
import {useState} from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <html lang="en" suppressHydrationWarning className="h-full">
            <body suppressHydrationWarning className="h-full bg-gray-50 dark:bg-gray-900">
                <Providers>
                    <div className="flex h-screen overflow-hidden">
                        {/* Mobile overlay */}
                                              {isSidebarOpen && (
                            <div
                                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}

                        {/* Sidebar */}
                        <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out 
                            lg:translate-x-0 lg:relative ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                            <LeftNav onClose={() => setSidebarOpen(false)} />
                        </div>


                        {/* Main content */}
                        <main className="flex-1 relative overflow-y-auto focus:outline-none">
                            {/* Mobile header with menu button */}
                            <div className="lg:hidden absolute top-0 left-0 w-full bg-white dark:bg-gray-800 z-10 px-4 py-2">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="text-gray-500 hover:text-gray-600 dark:text-gray-400"
                                >
                                    <span className="sr-only">Open sidebar</span>
                                    {/* Add your menu icon here */}
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}