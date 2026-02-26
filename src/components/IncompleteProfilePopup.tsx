"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export function IncompleteProfilePopup() {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [dismissedInSession, setDismissedInSession] = useState(false);

    useEffect(() => {
        // Prevent showing on server
        if (typeof window === "undefined") return;

        // If user explicitly dismissed it during this session, keep it hidden until next reload or after a delay
        if (dismissedInSession) return;

        // Condition to show: Not loading, User is an athlete, Profile is completely NOT filled, and NOT currently on the profile page
        if (!loading && user && user.role === "athlete" && !user.isProfileComplete && pathname !== "/profile") {
            // Add a small delay for better UX (so it doesn't pop instantly covering the screen immediately on navigation)
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [user, loading, pathname, dismissedInSession]);

    if (!isVisible) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        setDismissedInSession(true);
        // We do not save this in localStorage because we WANT it to be nagging (reiteradas ocasiones)
        // Whenever they reload or revisit, the `dismissedInSession` resets to false, prompting again.
        // We could also set a small timer to re-prompt them within the same session if needed,
        // but re-prompting on next page reload or navigation is usually sufficient.
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface-dark border border-primary/30 rounded-2xl w-[90%] max-w-md shadow-[0_0_40px_rgba(10,255,95,0.15)] overflow-hidden relative transform transition-all scale-100">
                {/* Decorative glowing top ring */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>

                <div className="p-6 sm:p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <span className="material-symbols-outlined text-4xl text-red-500 animate-pulse">
                            warning
                        </span>
                    </div>

                    <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-2">
                        ¡Atención Corredor!
                    </h2>
                    <h3 className="text-lg font-bold text-primary mb-4">
                        Datos del Perfil Incompletos
                    </h3>

                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Es <strong className="text-gray-200">obligatorio</strong> completar tu perfil con toda la información requerida (cédula, tipo de sangre, contacto, etc.) para poder formalizar tus inscripciones en futuras competencias de la escuela.
                    </p>

                    <div className="w-full flex flex-col gap-3">
                        <Link
                            href="/profile"
                            onClick={() => setIsVisible(false)}
                            className="w-full bg-primary hover:bg-primary-hover text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-glow flex justify-center items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-xl">person_edit</span>
                            Completar Perfil Ahora
                        </Link>

                        <button
                            onClick={handleDismiss}
                            className="w-full bg-transparent border border-white/10 hover:border-white/30 text-gray-400 hover:text-white px-6 py-3 rounded-xl font-bold transition-all text-sm"
                        >
                            Lo haré más tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
