"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { withRoleProtection } from "@/components/withRoleProtection";
import { collection, query, orderBy, getDocs, doc, deleteDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { STAFF_ROLES, hasPermission, Role } from "@/lib/permissions";

interface TrainingPlanSummary {
    id: string;
    weekStartDate: string;
    athleteIds: string[];
    assignedBy: string;
    createdAt: Timestamp;
    // Client-side populated
    assignedByName?: string;
    athleteCount?: number;
}

function ManagePlans() {
    const { user } = useAuth();
    const [plans, setPlans] = useState<TrainingPlanSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Cache for author names to avoid repeatedly fetching same user profile
    const [authorCache, setAuthorCache] = useState<Record<string, string>>({});

    useEffect(() => {
        async function fetchPlans() {
            setLoading(true);
            try {
                // Fetch all plans ordered by creation date
                const q = query(collection(db, "training_plans"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                let fetchedPlans: TrainingPlanSummary[] = [];
                let authorsMap: Record<string, string> = { ...authorCache };

                for (const docSnap of snapshot.docs) {
                    const data = docSnap.data();
                    const authorId = data.assignedBy;
                    let authorName = "Desconocido";

                    // Fetch author name if not cached
                    if (authorId) {
                        if (authorsMap[authorId]) {
                            authorName = authorsMap[authorId];
                        } else {
                            try {
                                const userDoc = await getDoc(doc(db, "users", authorId));
                                if (userDoc.exists()) {
                                    authorName = userDoc.data().displayName || "Entrenador Asignado";
                                    authorsMap[authorId] = authorName;
                                }
                            } catch (e) {
                                console.error("Error fetching author details", e);
                            }
                        }
                    }

                    fetchedPlans.push({
                        id: docSnap.id,
                        weekStartDate: data.weekStartDate || "--",
                        athleteIds: data.athleteIds || [],
                        assignedBy: authorId,
                        createdAt: data.createdAt,
                        assignedByName: authorName,
                        athleteCount: data.athleteIds?.length || 0,
                    });
                }

                setAuthorCache(authorsMap);
                setPlans(fetchedPlans);
            } catch (error) {
                console.error("Error fetching training plans:", error);
                setMessage({ text: "Error al cargar la lista de planes.", type: "error" });
            } finally {
                setLoading(false);
            }
        }

        if (hasPermission(user?.role as Role, 'assign_plans')) {
            fetchPlans();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleDelete = async (planId: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este plan? Esta acción no se puede deshacer.")) {
            return;
        }

        setDeletingId(planId);
        try {
            await deleteDoc(doc(db, "training_plans", planId));
            setPlans(prev => prev.filter(p => p.id !== planId));
            setMessage({ text: "Plan eliminado exitosamente.", type: "success" });
        } catch (error) {
            console.error("Error deleting plan:", error);
            setMessage({ text: "Error al eliminar el plan.", type: "error" });
        } finally {
            setDeletingId(null);
            setTimeout(() => setMessage({ text: "", type: "" }), 4000);
        }
    };

    if (user && !hasPermission(user.role as Role, 'assign_plans')) {
        return (
            <div className="p-10 flex flex-col justify-center items-center h-[50vh] text-center">
                <span className="material-symbols-outlined text-red-500 text-6xl mb-4">gpp_bad</span>
                <h2 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h2>
                <p className="text-gray-400">No tienes permisos para gestionar planes de entrenamiento.</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <Link href="/dashboard/admin" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors text-sm font-bold w-fit">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Volver al Panel
                    </Link>
                    <h1 className="text-3xl font-black text-white tracking-wide uppercase flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl">folder_managed</span>
                        Gestión de Planes
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Visualiza, edita o elimina los microciclos asignados a los atletas.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Link href="/dashboard/admin/plans" className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-lg font-bold transition-colors shadow-glow">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Nuevo Plan
                    </Link>
                </div>
            </header>

            {message.text && (
                <div className={`px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 animate-fade-in ${message.type === 'success' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                        {message.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {message.text}
                </div>
            )}

            <div className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-black/40 text-gray-400">
                            <tr>
                                <th className="px-4 py-3 font-medium rounded-tl-lg">Fecha de Inicio</th>
                                <th className="px-4 py-3 font-medium">Asignado por</th>
                                <th className="px-4 py-3 font-medium">Atletas Involucrados</th>
                                <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-6 text-gray-500"><span className="material-symbols-outlined animate-spin align-middle mr-2">refresh</span>Cargando planes...</td></tr>
                            ) : plans.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-6 text-gray-500">No hay planes de entrenamiento registrados en el sistema.</td></tr>
                            ) : (
                                plans.map(plan => {
                                    const dateStr = plan.weekStartDate ? new Date(plan.weekStartDate + 'T12:00:00Z').toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' }) : "--";
                                    return (
                                        <tr key={plan.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-4 py-4 text-white font-bold capitalize flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                                                {dateStr}
                                            </td>
                                            <td className="px-4 py-3 text-gray-300">
                                                {plan.assignedByName}
                                            </td>
                                            <td className="px-4 py-3 text-gray-300">
                                                <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold border border-white/20">
                                                    {plan.athleteCount} atleta(s)
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/dashboard/admin/plans/${plan.id}`}
                                                        className="text-primary hover:text-white transition-colors p-2 text-xs font-bold bg-primary/10 hover:bg-primary/20 rounded flex items-center justify-center border border-primary/20"
                                                        title="Editar Plan"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(plan.id)}
                                                        disabled={deletingId === plan.id}
                                                        className="text-red-400 hover:text-white transition-colors p-2 text-xs font-bold bg-red-500/10 hover:bg-red-500/80 rounded flex items-center justify-center border border-red-500/20 disabled:opacity-50"
                                                        title="Eliminar Plan"
                                                    >
                                                        {deletingId === plan.id ? (
                                                            <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                                                        ) : (
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default withRoleProtection(ManagePlans, STAFF_ROLES);
