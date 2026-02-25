"use client";

import { withRoleProtection } from "@/components/withRoleProtection";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MainBlockExercise {
    id: string;
    description: string;
    sets: number | "";
    reps: number | "";
    restReps: string;
    restSets: string;
}

interface DailyRoutineAdvanced {
    dayOfWeek: string;
    isRestDay: boolean;
    warmupText: string;
    mainBlocks: MainBlockExercise[];
    cooldownText: string;
}

interface TrainingPlan {
    id: string;
    weekStartDate: string;
    days: DailyRoutineAdvanced[];
    createdAt: any;
}

const MOTIVATIONAL_QUOTES = [
    "La disciplina es el puente entre tus metas y tus logros.",
    "No te detengas cuando estés cansado, detente cuando hayas terminado.",
    "El dolor de hoy es la victoria de mañana.",
    "Tu único límite eres tú mismo. Supéralo hoy.",
    "Cada paso cuenta. Confía en el proceso.",
];

function AthleteDashboard() {
    const { user } = useAuth();
    const [quote, setQuote] = useState("");
    const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);

    useEffect(() => {
        // Select random quote on mount
        setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }, []);

    useEffect(() => {
        async function fetchActivePlan() {
            if (!user?.uid) return;
            try {
                // To avoid requiring a composite index in Firestore for (athleteIds + createdAt) immediately,
                // we query by array-contains and sort on the client side.
                const q = query(
                    collection(db, "training_plans"),
                    where("athleteIds", "array-contains", user.uid)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Sort descending by createdAt
                    const sortedDocs = querySnapshot.docs.sort((a, b) => {
                        const dateA = a.data().createdAt?.toMillis() || 0;
                        const dateB = b.data().createdAt?.toMillis() || 0;
                        return dateB - dateA; // newest first
                    });

                    const doc = sortedDocs[0];
                    setActivePlan({ id: doc.id, ...doc.data() } as TrainingPlan);
                } else {
                    setActivePlan(null);
                }
            } catch (error) {
                console.error("Error fetching active plan:", error);
            } finally {
                setLoadingPlan(false);
            }
        }

        if (user?.uid) {
            fetchActivePlan();
        }
    }, [user]);

    // Mock Data for Training Block Progress
    const progressData = [
        { name: "Completado", value: 75, color: "#13ec5b" }, // primary
        { name: "Pendiente", value: 25, color: "#222222" },  // surface-dark
    ];

    // Mock Data for Personal Bests
    const pbData = [
        { distance: "5K", time: "18:45", date: "12 Oct 2025", rank: "Top 15%" },
        { distance: "10K", time: "40:12", date: "05 Nov 2025", rank: "Top 20%" },
        { distance: "21K (Media)", time: "1:28:30", date: "22 Ene 2026", rank: "Top 10%" },
    ];

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-wide uppercase">
                        Mi Entrenamiento
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Hola, {user?.displayName || "Atleta"}. Es un buen día para romper récords.
                    </p>
                </div>
            </header>

            {/* Motivational Card */}
            <div className="bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(10,255,95,0.1)]">
                <div className="absolute -right-10 -top-10 opacity-10">
                    <span className="material-symbols-outlined text-[150px] text-primary">sprint</span>
                </div>
                <div className="relative z-10">
                    <span className="material-symbols-outlined text-primary mb-2 text-3xl">format_quote</span>
                    <h2 className="text-xl md:text-2xl font-bold text-white italic max-w-2xl leading-relaxed">
                        "{quote}"
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Circular Progress Chart */}
                <div className="max-md:order-2 md:col-span-1 bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech text-center flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-white mb-2 w-full text-left">Progreso del Ciclo</h3>
                    <p className="text-xs text-gray-400 mb-6 w-full text-left">Fase Específica (Semana 4/8)</p>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={progressData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {progressData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-white">75%</span>
                            <span className="text-xs text-primary font-bold tracking-widest uppercase">IF: 0.85</span>
                        </div>
                    </div>
                </div>

                {/* Personal Bests Table */}
                <div className="max-md:order-1 md:col-span-2 bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">emoji_events</span>
                            Personal Bests (PBs)
                        </h3>
                        <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-gray-300">
                            Nivel: Avanzado
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-black/40 text-gray-400 border-b border-white/5">
                                <tr>
                                    <th className="px-4 py-3 font-medium rounded-tl-lg">Distancia</th>
                                    <th className="px-4 py-3 font-medium">Tiempo</th>
                                    <th className="px-4 py-3 font-medium">Fecha</th>
                                    <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Ecosistema</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {pbData.map((pb, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4 text-white font-bold">{pb.distance}</td>
                                        <td className="px-4 py-4 text-primary font-bold text-lg">{pb.time}</td>
                                        <td className="px-4 py-4 text-gray-400 text-xs">{pb.date}</td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="bg-white/10 text-white px-2 py-1 rounded text-xs font-bold border border-white/20">
                                                {pb.rank}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Athlete's Active Training Plan */}
            <div className="md:col-span-3 bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
                        Mi Semana de Entrenamiento
                    </h3>
                    {activePlan && (
                        <span className="bg-primary/20 text-primary text-sm font-bold px-3 py-1 rounded-full border border-primary/30">
                            Inicia: {new Date(activePlan.weekStartDate).toLocaleDateString()}
                        </span>
                    )}
                </div>

                {loadingPlan ? (
                    <div className="flex justify-center items-center py-10">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
                    </div>
                ) : activePlan ? (
                    <div className="grid grid-cols-1 gap-6">
                        {activePlan.days.map((day, index) => {
                            if (day.isRestDay) {
                                return (
                                    <div key={index} className="p-4 rounded-xl bg-black/30 border border-white/5 opacity-70 flex items-center justify-between">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">
                                            {day.dayOfWeek}
                                        </h4>
                                        <span className="text-xs font-bold text-gray-600 bg-black/50 px-3 py-1 rounded-lg">REST DAY</span>
                                    </div>
                                )
                            }

                            return (
                                <div key={index} className="p-5 rounded-xl bg-black/60 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-6">

                                    {/* Day Header */}
                                    <div className="md:w-32 flex-shrink-0 flex md:flex-col items-center md:items-start justify-between md:justify-start border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                                        <h4 className="text-xl font-black uppercase tracking-widest text-primary">
                                            {day.dayOfWeek}
                                        </h4>
                                    </div>

                                    {/* Day Content */}
                                    <div className="flex-1 space-y-6">
                                        {/* Warmup */}
                                        {day.warmupText && (
                                            <div>
                                                <h5 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                                                    Calentamiento
                                                </h5>
                                                <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                                                    {day.warmupText}
                                                </p>
                                            </div>
                                        )}

                                        {/* Main Blocks */}
                                        {day.mainBlocks && day.mainBlocks.length > 0 && (
                                            <div>
                                                <h5 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px]">sprint</span>
                                                    Bloque Principal
                                                </h5>
                                                <div className="space-y-3">
                                                    {day.mainBlocks.map((block, bIdx) => (
                                                        <div key={bIdx} className="bg-surface-dark border border-white/5 p-3 rounded-lg flex flex-col md:flex-row gap-4">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-white mb-2">{block.description}</p>

                                                                <div className="flex flex-wrap gap-2">
                                                                    {block.sets && block.reps && (
                                                                        <span className="bg-primary/20 text-primary border border-primary/20 px-2 py-1 rounded text-xs font-bold font-mono">
                                                                            {block.sets} × {block.reps}
                                                                        </span>
                                                                    )}
                                                                    {block.restReps && (
                                                                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                                                                            <span className="material-symbols-outlined text-[12px]">timer</span>
                                                                            Rep: {block.restReps}
                                                                        </span>
                                                                    )}
                                                                    {block.restSets && (
                                                                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                                                                            <span className="material-symbols-outlined text-[12px]">hourglass_empty</span>
                                                                            Serie: {block.restSets}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cooldown */}
                                        {day.cooldownText && (
                                            <div>
                                                <h5 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px]">self_improvement</span>
                                                    Vuelta a la Calma & Core
                                                </h5>
                                                <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                                                    {day.cooldownText}
                                                </p>
                                            </div>
                                        )}

                                        {/* Empty State protection */}
                                        {!day.warmupText && (!day.mainBlocks || day.mainBlocks.length === 0) && !day.cooldownText && (
                                            <p className="text-xs text-gray-500 italic">Día de recuperación activa. Sigue instrucciones adicionales del coach.</p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-white/10 rounded-xl">
                        <span className="material-symbols-outlined text-5xl text-gray-600 mb-3">explore</span>
                        <p className="text-gray-400 font-medium">No tienes un plan de entrenamiento activo asignado.</p>
                        <p className="text-sm text-gray-600 mt-1">Tu entrenador publicará el nuevo bloque pronto.</p>
                    </div>
                )}
            </div>

        </div>
    );
}

// Wrap the component to only allow 'athlete' roles
export default withRoleProtection(AthleteDashboard, ["athlete"]);
