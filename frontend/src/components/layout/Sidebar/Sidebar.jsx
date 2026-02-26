import React from 'react';
import { Home, LogOut, Info, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth';

const NAV_ITEMS = [
  { type: 'link', to: '/Dashboard',  icon: Home, label: 'Dashboard' },
  { type: 'link', to: '/AboutUsPage', icon: Info, label: 'About Us'  },
];

export default function Sidebar({ sidebarOpen }) {
    const { logout, loading } = useAuth();
    const { pathname } = useLocation();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <>
            {/* ── Sidebar panel ─────────────────────────────────────────────── */}
            <aside
                className={`
                    fixed top-[56px] left-0 z-20
                    h-[calc(100vh-56px)] w-64
                    flex flex-col
                    bg-lifewood-darkSerpent border-r border-white/5
                    shadow-lifewood-lg
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* ── Top gold accent line ── */}
                <div className="h-[2px] bg-gradient-to-r from-lifewood-goldenBrown via-lifewood-saffaron to-transparent" />

                {/* ── Nav ── */}
                <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-thin">

                    <p className="px-3 mb-3 text-[10px] font-bold tracking-widest uppercase text-white/25">
                        Navigation
                    </p>

                    {NAV_ITEMS.map((item) => {
                        if (item.type === 'link') {
                            const isActive = pathname === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`
                                        group flex items-center justify-between gap-3
                                        px-3 py-2.5 rounded-xl text-sm font-semibold
                                        transition-all duration-200
                                        ${isActive
                                            ? 'bg-lifewood-saffaron/15 text-lifewood-saffaron'
                                            : 'text-white/60 hover:text-white hover:bg-white/8'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Active indicator */}
                                        <span className={`w-1 h-5 rounded-full transition-all ${isActive ? 'bg-lifewood-saffaron' : 'bg-transparent group-hover:bg-white/20'}`} />
                                        <item.icon className="w-4 h-4 shrink-0" />
                                        {item.label}
                                    </div>
                                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-lifewood-saffaron/70" />}
                                </Link>
                            );
                        }

                        return null;
                    })}
                </nav>

                {/* ── Bottom: Sign Out ── */}
                <div className="px-3 py-4 border-t border-white/8">
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                                   text-sm font-semibold text-white/50
                                   hover:text-red-400 hover:bg-red-500/10
                                   transition-all duration-200 disabled:opacity-50"
                    >
                        <span className="w-1 h-5 rounded-full bg-transparent group-hover:bg-red-400/40 transition-all" />
                        <LogOut className="w-4 h-4 shrink-0" />
                        {loading ? 'Signing out…' : 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* ── Mobile overlay ─────────────────────────────────────────────── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 top-[56px] bg-black/50 backdrop-blur-sm z-10 lg:hidden"
                    onClick={() => {}}
                />
            )}
        </>
    );
}


