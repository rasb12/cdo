"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function Sidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, loading } = useAuth();

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    const navItems = [
        { name: "Inicio", path: "/", icon: "home" },
        { name: "Nosotros", path: "/nosotros", icon: "groups" },
        { name: "Blog", path: "/blog", icon: "article" },
    ];

    return (
        <>
            {/* Mobile Header (Hidden on lg) */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-surface-dark border-b border-white/5 sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-3">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 shadow-[0_0_10px_rgba(10,255,95,0.2)] border border-primary/20 shrink-0"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgbXWr2pDxXaQ2RzPHwBG8MJ_-Nt5HXjvaO_0YAc1ji2OCOkgWpHHL1P3jmhi82ir8AYaQ_IIc9YxifiLXm8523XWqdjVQFImwfSrxUJnxQDqEjBPSM7sZC7IFDFTkrFT7DLJKVjzqeHl97Y3JAlkjPX2IcIT238FE3RtTvw1ZwlXFfkDjpqZPbjvKub7rTXkhM8J2Jtc14NyJAqXs-47XpeF73ucErAdf0PuY-BJF14hrPl45rDBrtJNJJO49aLIUb-wD1sNutFU")',
                        }}
                    />
                    <div className="flex flex-col">
                        <h1 className="text-white text-sm md:text-base font-bold leading-tight tracking-wide">
                            Corredores de Oriente
                        </h1>
                    </div>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white bg-white/5 hover:bg-white/10 transition-colors rounded-md border border-white/10 flex items-center justify-center"
                    aria-label="Toggle Navigation"
                >
                    <span className="material-symbols-outlined">
                        {isMobileMenuOpen ? "close" : "menu"}
                    </span>
                </button>
            </header>

            {/* Sidebar / Mobile Menu Overlay */}
            <aside
                className={`
                    fixed lg:sticky top-[65px] lg:top-0 left-0 z-40
                    w-full sm:w-80 lg:w-72 h-[calc(100dvh-65px)] lg:h-[100dvh]
                    bg-surface-dark border-r border-white/5
                    flex flex-col justify-between shrink-0
                    transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? "translate-x-0 overflow-y-auto" : "-translate-x-full lg:translate-x-0"}
                    shadow-[4px_0_24px_rgba(0,0,0,0.5)] lg:shadow-tech
                `}
            >
                <div className="flex flex-col h-full p-6">
                    {/* Logo & Brand (Desktop Only) */}
                    <div className="hidden lg:flex items-center gap-3 mb-10">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-[0_0_10px_rgba(10,255,95,0.2)] border border-primary/20 shrink-0"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgbXWr2pDxXaQ2RzPHwBG8MJ_-Nt5HXjvaO_0YAc1ji2OCOkgWpHHL1P3jmhi82ir8AYaQ_IIc9YxifiLXm8523XWqdjVQFImwfSrxUJnxQDqEjBPSM7sZC7IFDFTkrFT7DLJKVjzqeHl97Y3JAlkjPX2IcIT238FE3RtTvw1ZwlXFfkDjpqZPbjvKub7rTXkhM8J2Jtc14NyJAqXs-47XpeF73ucErAdf0PuY-BJF14hrPl45rDBrtJNJJO49aLIUb-wD1sNutFU")',
                            }}
                        />
                        <div className="flex flex-col">
                            <h1 className="text-white text-base font-bold leading-tight tracking-wide">
                                Corredores<br />de Oriente
                            </h1>
                            <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1">
                                Escuela de Atletismo
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2 flex-1 mt-4 lg:mt-0">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 sm:py-4 lg:py-3 rounded-lg border-l-2 transition-all duration-300 group
                  ${isActive
                                            ? "bg-primary/10 border-primary text-white"
                                            : "hover:bg-white/5 border-transparent hover:border-white/20 text-gray-400 hover:text-white"
                                        }`}
                                >
                                    <span
                                        className={`material-symbols-outlined transition-all ${isActive
                                            ? "text-primary drop-shadow-[0_0_5px_rgba(10,255,95,0.8)]"
                                            : "text-inherit group-hover:text-primary/70"
                                            }`}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="text-sm sm:text-base lg:text-sm font-medium">{item.name}</span>
                                </Link>
                            );
                        })}

                        {/* Dashboard Link (Only visible when logged in) */}
                        {!loading && user && (
                            <Link
                                href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/athlete"}
                                className={`flex items-center gap-3 px-4 py-3 sm:py-4 lg:py-3 rounded-lg border-l-2 transition-all duration-300 group mt-4 lg:mt-2
                  ${pathname.startsWith("/dashboard")
                                        ? "bg-primary/10 border-primary text-white"
                                        : "hover:bg-white/5 border-transparent hover:border-white/20 text-gray-400 hover:text-white"
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined transition-all ${pathname.startsWith("/dashboard")
                                        ? "text-primary drop-shadow-[0_0_5px_rgba(10,255,95,0.8)]"
                                        : "text-inherit group-hover:text-primary/70"
                                        }`}
                                >
                                    dashboard
                                </span>
                                <span className="text-sm sm:text-base lg:text-sm font-medium">
                                    {user.role === "admin" ? "Panel Entrenador" : "Mi Entrenamiento"}
                                </span>
                            </Link>
                        )}

                        {/* Blog CMS Link (Only visible for admins) */}
                        {!loading && user?.role === "admin" && (
                            <Link
                                href="/dashboard/admin/blog"
                                className={`flex items-center gap-3 px-4 py-3 sm:py-4 lg:py-3 rounded-lg border-l-2 transition-all duration-300 group
                  ${pathname.startsWith("/dashboard/admin/blog")
                                        ? "bg-primary/10 border-primary text-white"
                                        : "hover:bg-white/5 border-transparent hover:border-white/20 text-gray-400 hover:text-white"
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined transition-all ${pathname.startsWith("/dashboard/admin/blog")
                                        ? "text-primary drop-shadow-[0_0_5px_rgba(10,255,95,0.8)]"
                                        : "text-inherit group-hover:text-primary/70"
                                        }`}
                                >
                                    edit_document
                                </span>
                                <span className="text-sm sm:text-base lg:text-sm font-medium">
                                    Redactar Blog
                                </span>
                            </Link>
                        )}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="flex flex-col mt-10 lg:mt-auto pt-6 border-t border-white/10 mb-4 lg:mb-0">
                        {!loading && user ? (
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                                >
                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30 group-hover:bg-primary/30 transition-colors">
                                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                                            {user.displayName || "Atleta"}
                                        </span>
                                        <span className="text-xs text-gray-400 truncate">
                                            Ver Perfil
                                        </span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => signOut(auth)}
                                    className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white/5 hover:bg-white/10 transition-all text-gray-300 hover:text-white text-sm font-medium border border-white/10 hover:border-white/20"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    className="w-full flex items-center justify-center rounded-lg h-11 px-4 bg-primary hover:bg-primary-hover active:scale-95 transition-all text-black text-sm font-bold shadow-glow hover:shadow-[0_0_20px_rgba(10,255,95,0.6)]"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="w-full flex items-center justify-center rounded-lg h-11 px-4 bg-transparent hover:bg-white/5 transition-all text-white text-sm font-medium border border-white/20 hover:border-white/40"
                                >
                                    Crear Cuenta
                                </Link>
                            </div>
                        )}

                        <div className="flex justify-center gap-6 mt-6">
                            <a
                                href="#"
                                className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    photo_camera
                                </span>
                            </a>
                            <a
                                href="#"
                                className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    public
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                    style={{ top: '65px' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
