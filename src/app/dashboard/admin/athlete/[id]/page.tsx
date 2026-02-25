"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { withRoleProtection } from "@/components/withRoleProtection";
import Link from "next/link";

interface HistoryItem {
    event: string;
    pb: string;
}

function AthleteDetailView() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [athlete, setAthlete] = useState<any>(null);

    useEffect(() => {
        async function fetchAthlete() {
            if (!id) return;
            try {
                const docRef = doc(db, "users", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().role === "athlete") {
                    setAthlete(docSnap.data());
                } else {
                    setAthlete(null);
                }
            } catch (error) {
                console.error("Error fetching athlete detail", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAthlete();
    }, [id]);

    if (loading) {
        return (
            <div className="p-10 flex justify-center items-center h-[50vh]">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
            </div>
        );
    }

    if (!athlete) {
        return (
            <div className="p-10 max-w-2xl mx-auto text-center mt-20 bg-surface-dark border border-white/10 rounded-xl py-16">
                <span className="material-symbols-outlined text-border-500 text-6xl mb-4">search_off</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-wide">Atleta no encontrado</h2>
                <p className="text-gray-400 mt-2 mb-8">El perfil que buscas no existe o no tiene rol de atleta.</p>
                <Link href="/dashboard/admin" className="bg-primary/10 text-primary border border-primary/20 px-6 py-3 rounded-lg font-bold hover:bg-primary hover:text-black transition-colors">
                    Volver al Panel
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in-up">

            {/* Navigation Head */}
            <div className="mb-6">
                <Link href="/dashboard/admin" className="text-primary text-sm font-bold flex items-center gap-1 hover:text-white transition-colors w-max">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Volver al Panel
                </Link>
            </div>

            <header className="mb-8 border-b border-primary/20 pb-8 bg-black/40 p-6 rounded-2xl border flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <img
                    src={athlete.photoURL || "https://ui-avatars.com/api/?name=" + (athlete.displayName || athlete.email || "AT") + "&background=0a0a0a&color=0AFF5F"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-2 border-primary shadow-[0_0_20px_rgba(10,255,95,0.3)] object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-black text-white tracking-wide uppercase">
                        {athlete.displayName || "Atleta Sin Nombre"}
                    </h1>
                    <p className="text-primary font-bold mt-1 flex items-center justify-center md:justify-start gap-2">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Atleta Activo Orientado
                    </p>
                    <p className="text-gray-400 mt-3 text-sm max-w-2xl leading-relaxed italic border-l-2 border-white/10 pl-3">
                        "{athlete.bio || "Sin biografía registrada."}"
                    </p>
                </div>
            </header>

            <div className="space-y-8">
                {/* SECTION: Identity & Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Basic Data */}
                    <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                            <span className="material-symbols-outlined text-primary">badge</span>
                            Ficha Médica y Personal
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400 text-sm font-bold uppercase">Cédula</span>
                                <span className="text-white font-medium">{athlete.idCard || "N/A"}</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400 text-sm font-bold uppercase">Edad</span>
                                <span className="text-white font-medium">{athlete.age ? `${athlete.age} años` : "N/A"}</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400 text-sm font-bold uppercase">F. Nacimiento</span>
                                <span className="text-white font-medium">{athlete.dob || "N/A"}</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400 text-sm font-bold uppercase">Categoría FVA</span>
                                <span className="text-primary font-bold">{athlete.fvaCategory || "N/A"}</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400 text-sm font-bold uppercase">Tipo Sangre</span>
                                <span className="text-red-400 font-bold">{athlete.bloodType || "N/A"}</span>
                            </li>
                            <li className="flex justify-between pb-2">
                                <span className="text-gray-400 text-sm font-bold uppercase">Teléfono</span>
                                <span className="text-white font-medium">{athlete.phone || "N/A"}</span>
                            </li>
                        </ul>
                    </section>

                    {/* Sizing Data */}
                    <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                            <span className="material-symbols-outlined text-primary">styler</span>
                            Uniformidad
                        </h2>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-black/40 py-4 rounded-lg border border-white/5 flex flex-col items-center">
                                <span className="material-symbols-outlined text-gray-400 mb-1">styler</span>
                                <span className="text-xs text-gray-500 uppercase font-bold">Camisa</span>
                                <span className="text-xl font-black text-white mt-1">{athlete.shirtSize || "-"}</span>
                            </div>
                            <div className="bg-black/40 py-4 rounded-lg border border-white/5 flex flex-col items-center">
                                <span className="material-symbols-outlined text-gray-400 mb-1">accessibility</span>
                                <span className="text-xs text-gray-500 uppercase font-bold">Pantalón</span>
                                <span className="text-xl font-black text-white mt-1">{athlete.pantsSize || "-"}</span>
                            </div>
                            <div className="bg-black/40 py-4 rounded-lg border border-white/5 flex flex-col items-center">
                                <span className="material-symbols-outlined text-gray-400 mb-1">steps</span>
                                <span className="text-xs text-gray-500 uppercase font-bold">Zapatos</span>
                                <span className="text-xl font-black text-white mt-1">{athlete.shoeSize || "-"}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5">
                            <span className="text-gray-400 text-sm font-bold uppercase block mb-1">Dirección Registrada</span>
                            <span className="text-white text-sm leading-relaxed">{athlete.address || "N/A"}</span>
                        </div>
                    </section>
                </div>

                {/* SECTION: Sports Context */}
                <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                        <span className="material-symbols-outlined text-primary">military_tech</span>
                        Contexto Deportivo
                    </h2>

                    <div className="mb-6">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-3">
                            Especialidades Formales
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {athlete.specialties && athlete.specialties.length > 0 ? (
                                athlete.specialties.map((spec: string) => (
                                    <span key={spec} className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                        {spec}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm italic">Sin especialidades declaradas.</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-3">
                            Récords Personales (PBs) Históricos
                        </span>
                        {athlete.history && athlete.history.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {athlete.history.map((record: HistoryItem, idx: number) => (
                                    <div key={idx} className="bg-black/30 border border-white/5 rounded-lg p-3 flex justify-between items-center">
                                        <span className="text-sm text-gray-300 font-medium">{record.event}</span>
                                        <span className="text-sm font-black text-primary">{record.pb}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-500 text-sm italic">Sin historial de competencias registrado.</span>
                        )}
                    </div>
                </section>
            </div>

        </div>
    );
}

export default withRoleProtection(AthleteDetailView, ["admin"]);
