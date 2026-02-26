"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { STAFF_ROLES, ROLE_TRANSLATIONS, Role } from "@/lib/permissions";

interface StaffMember {
    uid: string;
    displayName: string;
    photoURL?: string;
    role: Role;
    bio?: string;
    specialties?: string[];
}

export default function EquipoStaff() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStaff() {
            try {
                // To fetch all staff roles without limitations we use 'in' operator
                const q = query(
                    collection(db, "users"),
                    where("role", "in", STAFF_ROLES)
                );

                const querySnapshot = await getDocs(q);
                let staffData: StaffMember[] = [];

                querySnapshot.forEach((doc) => {
                    staffData.push({ uid: doc.id, ...doc.data() } as StaffMember);
                });

                // Soft-sort to prioritize Head Coaches and Developers at the top
                staffData.sort((a, b) => {
                    if (a.role === 'head_coach') return -1;
                    if (b.role === 'head_coach') return 1;
                    if (a.role === 'developer') return -1;
                    if (b.role === 'developer') return 1;
                    return 0;
                });

                setStaff(staffData);
            } catch (error) {
                console.error("Error fetching staff:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStaff();
    }, []);

    return (
        <div className="flex-1 min-h-screen flex flex-col bg-background-dark pt-20">
            {/* Header Section */}
            <div className="px-6 py-12 lg:px-16 max-w-7xl mx-auto w-full text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold mb-4 tracking-widest uppercase">
                    Mentes Maestras
                </span>
                <h1 className="text-white text-4xl lg:text-5xl font-black tracking-tight mb-4 uppercase">
                    Cuerpo <span className="text-primary">Técnico</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto mb-8">
                    Conoce a los entrenadores, preparadores y especialistas comprometidos con exprimir tu máximo potencial.
                </p>
                <Link href="/nosotros" className="text-primary text-sm font-bold flex items-center justify-center gap-1 hover:text-white transition-colors w-max mx-auto mb-10">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Volver a Nosotros
                </Link>
            </div>

            {/* Staff Grid */}
            <div className="px-6 pb-20 lg:px-16 max-w-7xl mx-auto w-full">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
                    </div>
                ) : staff.length === 0 ? (
                    <div className="text-center py-20 bg-surface-dark rounded-2xl border border-white/5">
                        <span className="material-symbols-outlined text-border-500 text-5xl mb-4">group_off</span>
                        <h3 className="text-xl font-bold text-white mb-2">No se encontró personal</h3>
                        <p className="text-gray-400">Actualmente no hay usuarios registrados con roles administrativos o técnicos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {staff.map((member) => (
                            <div key={member.uid} className="group bg-surface-dark rounded-xl overflow-hidden shadow-lg border border-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                                <div className="aspect-square bg-slate-900 border-b border-slate-800 relative overflow-hidden">
                                    <img
                                        src={member.photoURL || `https://ui-avatars.com/api/?name=${member.displayName || "Staff"}&background=0a0a0a&color=0AFF5F&size=200`}
                                        alt={member.displayName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur border border-white/10 text-white text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded">
                                        {ROLE_TRANSLATIONS[member.role] || member.role}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                                        {member.displayName || "Usuario Sin Nombre"}
                                    </h3>

                                    <p className="text-sm text-primary font-bold mb-3 uppercase tracking-wide text-[10px]">
                                        {member.bio && member.bio.length > 0 ? member.bio : "Especialista"}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {member.specialties && member.specialties.length > 0 ? (
                                            member.specialties.map(spec => (
                                                <span key={spec} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded border border-slate-700">
                                                    {spec}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded border border-slate-700 italic">
                                                Staff Activo
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-auto py-8 px-6 border-t border-slate-800 text-center bg-background-dark">
                <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} Corredores de Oriente. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
}
