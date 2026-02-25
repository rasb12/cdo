"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { withRoleProtection } from "@/components/withRoleProtection";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function AdminDashboard() {
    const { user } = useAuth();

    // Mock data for Balanced Scorecard (Radar Chart)
    const bscData = [
        { subject: 'Financiera', A: 85, fullMark: 100 },
        { subject: 'Procesos Internos', A: 70, fullMark: 100 },
        { subject: 'Crecimiento', A: 90, fullMark: 100 },
        { subject: 'Satisfacción', A: 95, fullMark: 100 },
    ];

    const [athletes, setAthletes] = useState<any[]>([]);
    const [loadingAthletes, setLoadingAthletes] = useState(true);

    useEffect(() => {
        async function fetchAthletes() {
            try {
                const q = query(collection(db, "users"), where("role", "==", "athlete"));
                const querySnapshot = await getDocs(q);
                const fetched: any[] = [];
                querySnapshot.forEach((doc) => {
                    fetched.push({ id: doc.id, ...doc.data() });
                });
                setAthletes(fetched);
            } catch (error) {
                console.error("Error fetching athletes:", error);
            } finally {
                setLoadingAthletes(false);
            }
        }
        fetchAthletes();
    }, []);

    const stats = [
        { label: "Atletas Activos", value: loadingAthletes ? "..." : athletes.length.toString(), trend: "Total", icon: "groups" },
        { label: "TSS Promedio", value: "425", trend: "-12", icon: "monitor_heart" },
        { label: "Atletas en Riesgo", value: "2", trend: "0", icon: "warning", color: "text-red-500" },
        { label: "Próximo Evento", value: "14 d", trend: "Maratón", icon: "event" },
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-wide uppercase">
                        Portal de Entrenamiento
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Bienvenido Entrenador, {user?.displayName || "Admin"}. Modo de Alta Densidad Activo.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/admin/plans" className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-lg font-bold transition-colors shadow-glow">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Nuevo Plan
                    </Link>
                </div>
            </header>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-surface-dark border border-white/10 rounded-xl p-5 flex items-center gap-4 shadow-tech hover:border-primary/50 transition-colors group">
                        <div className="h-12 w-12 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <span className={`material-symbols-outlined ${stat.color || 'text-primary'}`}>
                                {stat.icon}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                                <span className="text-xs text-gray-500">{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Balanced Scorecard (Radar) */}
                <div className="lg:col-span-1 bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">pie_chart</span>
                        Análisis de Brechas (BSC)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={bscData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Radar name="Escuela" dataKey="A" stroke="#13ec5b" fill="#13ec5b" fillOpacity={0.3} />
                                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333' }} itemStyle={{ color: '#13ec5b' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Athlete Management Table */}
                <div className="lg:col-span-2 bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                        Control de Atletas y Carga (TSS)
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-black/40 text-gray-400">
                                <tr>
                                    <th className="px-4 py-3 font-medium rounded-tl-lg">Atleta</th>
                                    <th className="px-4 py-3 font-medium">VDOT Base</th>
                                    <th className="px-4 py-3 font-medium">TSS 7d</th>
                                    <th className="px-4 py-3 font-medium">Estado</th>
                                    <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loadingAthletes ? (
                                    <tr><td colSpan={5} className="text-center py-6 text-gray-500">Cargando base de datos...</td></tr>
                                ) : athletes.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-6 text-gray-500">No hay atletas registrados.</td></tr>
                                ) : (
                                    athletes.map((athlete) => (
                                        <tr key={athlete.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-white font-medium flex items-center gap-3">
                                                <img
                                                    src={athlete.photoURL || `https://ui-avatars.com/api/?name=${athlete.displayName || athlete.email || 'AT'}&background=0a0a0a&color=0AFF5F`}
                                                    alt="Avatar"
                                                    className="w-8 h-8 rounded-full border border-primary/50 object-cover"
                                                />
                                                {athlete.displayName || athlete.email || "Sin Nombre"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold border border-primary/30">
                                                    {athlete.vdot || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-300">--</td>
                                            <td className="px-4 py-3">
                                                <span className="flex items-center gap-1 text-xs font-bold text-green-400">
                                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                    Activo
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={`/dashboard/admin/athlete/${athlete.id}`} className="text-primary hover:text-white transition-colors p-1 flex items-center justify-end gap-1 text-xs font-bold bg-primary/10 hover:bg-primary/20 rounded px-2">
                                                    Ver Perfil
                                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

// Wrap the component to only allow 'admin' roles
export default withRoleProtection(AdminDashboard, ["admin"]);
