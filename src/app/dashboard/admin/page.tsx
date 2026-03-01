"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { withRoleProtection } from "@/components/withRoleProtection";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { STAFF_ROLES, hasPermission } from "@/lib/permissions";

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
    const [pendingPBs, setPendingPBs] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Athletes
                const q = query(collection(db, "users"), where("role", "==", "athlete"));
                const querySnapshot = await getDocs(q);
                const fetched: any[] = [];
                querySnapshot.forEach((doc) => {
                    fetched.push({ id: doc.id, ...doc.data() });
                });
                setAthletes(fetched);

                // Fetch Pending PBs
                const pbQ = query(collection(db, "personal_bests"), where("status", "==", "pending"));
                const pbSnap = await getDocs(pbQ);
                const pbs: any[] = [];
                pbSnap.forEach(doc => {
                    pbs.push({ id: doc.id, ...doc.data() });
                });
                setPendingPBs(pbs);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoadingAthletes(false);
            }
        }
        fetchData();
    }, []);

    const stats = [
        { label: "Atletas Activos", value: loadingAthletes ? "..." : athletes.length.toString(), trend: "Total", icon: "groups" },
        { label: "TSS Promedio", value: "425", trend: "-12", icon: "monitor_heart" },
        { label: "Atletas en Riesgo", value: pendingPBs.length > 0 ? pendingPBs.length.toString() : "0", trend: pendingPBs.length > 0 ? "Aprobaciones" : "0", icon: pendingPBs.length > 0 ? "assignment_late" : "check_circle", color: pendingPBs.length > 0 ? "text-yellow-500" : "text-primary" },
        { label: "Próximo Evento", value: "14 d", trend: "Maratón", icon: "event" },
    ];

    // Group pending PBs by athlete
    const athletesWithPendingPBs = Array.from(new Set(pendingPBs.map(pb => pb.athleteId)))
        .map(athleteId => {
            const athlete = athletes.find(a => a.id === athleteId);
            const count = pendingPBs.filter(pb => pb.athleteId === athleteId).length;
            return {
                id: athleteId,
                name: athlete ? (athlete.displayName || athlete.email) : "Atleta Desconocido",
                count
            };
        });

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
                    {hasPermission(user?.role as any, 'assign_plans') && (
                        <Link href="/dashboard/admin/plans/manage" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg font-bold transition-colors">
                            <span className="material-symbols-outlined text-[20px]">folder_managed</span>
                            <span className="hidden sm:inline">Gestionar Planes</span>
                            <span className="sm:hidden">Gestionar</span>
                        </Link>
                    )}
                    {hasPermission(user?.role as any, 'assign_plans') ? (
                        <Link href="/dashboard/admin/plans" className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-lg font-bold transition-colors shadow-glow">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Nuevo Plan
                        </Link>
                    ) : (
                        <button disabled className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-500 px-4 py-2 rounded-lg font-bold cursor-not-allowed">
                            <span className="material-symbols-outlined text-[20px]">lock</span>
                            Sin Permiso (Planes)
                        </button>
                    )}
                </div>
            </header>

            {/* Pending PBs Alert Notification */}
            {athletesWithPendingPBs.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 shadow-[0_0_15px_rgba(234,179,8,0.15)] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-yellow-500 text-3xl shrink-0">notification_important</span>
                        <div>
                            <h3 className="text-lg font-bold text-yellow-400">Atención Requerida: Marcas por Aprobar</h3>
                            <p className="text-sm text-gray-300 mt-1">
                                Tienes {pendingPBs.length} {pendingPBs.length === 1 ? 'marca' : 'marcas'} esperando validación de {athletesWithPendingPBs.length} {athletesWithPendingPBs.length === 1 ? 'atleta' : 'atletas'}.
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {athletesWithPendingPBs.map(a => (
                                    <Link key={a.id} href={`/dashboard/admin/athlete/${a.id}`} className="bg-black/40 hover:bg-black/60 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5">
                                        {a.name}
                                        <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded-full text-[10px]">{a.count}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                    athletes.map((athlete) => {
                                        const pendingForThisAthlete = pendingPBs.filter(pb => pb.athleteId === athlete.id).length;
                                        return (
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
                                                    {pendingForThisAthlete > 0 ? (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                                                            <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                                                            PBs ({pendingForThisAthlete})
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-green-400">
                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                            Activo
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link href={`/dashboard/admin/athlete/${athlete.id}`} className="text-primary hover:text-white transition-colors p-1 flex items-center justify-end gap-1 text-xs font-bold bg-primary/10 hover:bg-primary/20 rounded px-2">
                                                        Ver Perfil
                                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

// Wrap the component to only allow staff roles
export default withRoleProtection(AdminDashboard, STAFF_ROLES);
