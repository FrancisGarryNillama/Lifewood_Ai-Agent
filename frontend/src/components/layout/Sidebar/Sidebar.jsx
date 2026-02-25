import React from 'react';
import { Home, UserCircle, LogOut, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../features/auth';

export default function Sidebar({ sidebarOpen, onOpenProfile }) {
    const { logout, loading } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <>
            <aside
                className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-white border-r border-gray-200 shadow-lg z-20 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } w-64`}
            >
                <div className="pt-6 px-4">
                    <nav className="space-y-2">
                        <Link
                            to="/Dashboard"
                            className="flex items-center gap-3 py-3 px-4 text-lifewood-darkSerpent hover:bg-lifewood-saffaron hover:text-lifewood-darkSerpent rounded-lg transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            <span>Dashboard</span>
                        </Link>

                        <button
                            onClick={onOpenProfile}
                            className="flex items-center gap-3 py-3 px-4 text-lifewood-darkSerpent hover:bg-lifewood-saffaron hover:text-lifewood-darkSerpent rounded-lg transition-colors w-full text-left"
                        >
                            <UserCircle className="w-5 h-5" />
                            <span>Profile</span>
                        </button>

                        <Link
                            to="/AboutUsPage"
                            className="flex items-center gap-3 py-3 px-4 text-lifewood-darkSerpent hover:bg-lifewood-saffaron hover:text-lifewood-darkSerpent rounded-lg transition-colors"
                        >
                            <Info className="w-5 h-5" />
                            <span>About Us</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="flex items-center gap-3 py-3 px-4 text-lifewood-darkSerpent hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors w-full text-left disabled:opacity-50"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => { }}
                />
            )}
        </>
    );
}
