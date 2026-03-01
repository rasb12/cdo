"use client";

import { withRoleProtection } from "@/components/withRoleProtection";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CldUploadWidget } from "next-cloudinary";

// --- Interfaces ---
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

interface TrainingLog {
    id: string;
    athleteId: string;
    planId: string;
    dayIndex: number;
    durationSeconds: number;
    photoUrl: string | null;
    completedAt: any;
}

interface PersonalBest {
    id?: string;
    athleteId: string;
    discipline: string;
    type: 'time' | 'distance' | 'points';
    value: number;
    date: any;
    competitionName?: string;
    status: 'pending' | 'approved' | 'rejected';
}

// --- Constants ---
const MOTIVATIONAL_QUOTES = [
    "La disciplina es el puente entre tus metas y tus logros.",
    "No te detengas cuando estés cansado, detente cuando hayas terminado.",
    "El dolor de hoy es la victoria de mañana.",
    "Tu único límite eres tú mismo. Supéralo hoy.",
    "Cada paso cuenta. Confía en el proceso.",
];

const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatMetric = (type: string, value: number) => {
    if (type === 'time') {
        if (value < 60) return `${value.toFixed(2)}s`;
        const mins = Math.floor(value / 60);
        const secs = (value % 60).toFixed(value % 1 !== 0 ? 2 : 0);
        return mins > 59 ? formatTime(value) : `${mins}:${secs.padStart(value % 1 !== 0 ? 5 : 2, '0')}`;
    }
    if (type === 'distance') return `${value.toFixed(2)} m`;
    if (type === 'points') return `${value} pts`;
    return `${value}`;
};

// --- Subcomponents ---

function DayCard({ planId, day, dayIndex, existingLog, onLogSaved, athleteId }: {
    planId: string;
    day: DailyRoutineAdvanced;
    dayIndex: number;
    existingLog?: TrainingLog;
    onLogSaved: (log: TrainingLog) => void;
    athleteId: string;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // in seconds
    const [showUpload, setShowUpload] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Timer effect
    useEffect(() => {
        let interval: any;
        if (isTraining) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTraining]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const logData = {
                athleteId,
                planId,
                dayIndex,
                durationSeconds: elapsedTime,
                photoUrl,
                completedAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, "training_logs"), logData);
            onLogSaved({ id: docRef.id, ...logData, completedAt: new Date() } as TrainingLog);
        } catch (error) {
            console.error("Error saving log:", error);
            alert("Hubo un error al guardar el entrenamiento.");
        }
        setIsSaving(false);
    };

    if (day.isRestDay) {
        return (
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 opacity-70 flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">
                    {day.dayOfWeek}
                </h4>
                <span className="text-xs font-bold text-gray-600 bg-black/50 px-3 py-1 rounded-lg">REST DAY</span>
            </div>
        );
    }

    return (
        <div className={`p-5 rounded-xl border shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all ${existingLog ? 'bg-primary/5 border-primary/30' : 'bg-black/60 border-white/10'}`}>
            {/* Header */}
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
                <h4 className={`text-xl font-black uppercase tracking-widest ${existingLog ? 'text-primary' : 'text-white'}`}>
                    {day.dayOfWeek}
                </h4>
                <div className="flex items-center gap-3">
                    {existingLog ? (
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Completado ({formatTime(existingLog.durationSeconds)})
                        </span>
                    ) : (
                        isTraining && (
                            <span className="text-primary font-mono font-bold animate-pulse">{formatTime(elapsedTime)}</span>
                        )
                    )}
                    <span className={`material-symbols-outlined text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </div>
            </div>

            {/* Contents */}
            {isExpanded && (
                <div className="mt-6 flex flex-col md:flex-row gap-6 border-t border-white/10 pt-6 animate-fade-in-up">
                    {/* Routine Detail */}
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

                    {/* Action Sidebar */}
                    {!existingLog ? (
                        <div className="md:w-64 bg-surface-dark p-4 rounded-xl flex flex-col gap-4 border border-white/5 h-fit shadow-inner">
                            <div className="text-center">
                                <h4 className="font-bold text-white mb-1">Entrenamiento</h4>
                                <div className="text-4xl font-mono text-primary font-black my-2 tracking-wider">{formatTime(elapsedTime)}</div>
                            </div>

                            {!isTraining && elapsedTime === 0 && !showUpload && (
                                <button onClick={() => setIsTraining(true)} className="w-full bg-primary text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all font-mono">
                                    <span className="material-symbols-outlined">play_arrow</span> INICIAR
                                </button>
                            )}

                            {isTraining && (
                                <button onClick={() => { setIsTraining(false); setShowUpload(true); }} className="w-full bg-red-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-all font-mono hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                    <span className="material-symbols-outlined">stop</span> FINALIZAR
                                </button>
                            )}

                            {(!isTraining && showUpload) && (
                                <div className="space-y-4 pt-4 border-t border-white/10 animate-fade-in-up">
                                    {photoUrl ? (
                                        <div className="relative rounded-lg overflow-hidden group">
                                            <img src={photoUrl} alt="Evidencia" className="w-full h-32 object-cover border border-white/10" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <button onClick={() => setPhotoUrl(null)} className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors">
                                                    <span className="material-symbols-outlined text-white text-sm">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <CldUploadWidget
                                            uploadPreset="cdo-athlete-pics"
                                            onSuccess={(result: any) => {
                                                if (result.info && typeof result.info === 'object' && result.info.secure_url) {
                                                    setPhotoUrl(result.info.secure_url);
                                                }
                                            }}
                                        >
                                            {({ open }) => (
                                                <button onClick={(e) => { e.preventDefault(); open(); }} className="w-full bg-white/10 border border-white/20 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all text-sm group">
                                                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">add_a_photo</span> Subir Foto
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    )}

                                    <button onClick={handleSave} disabled={isSaving} className="w-full bg-primary text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
                                        {isSaving ? <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
                                        Guardar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (

                        <div className="md:w-64 bg-surface-dark p-4 rounded-xl flex flex-col gap-4 border border-white/5 h-fit shadow-inner">
                            <h4 className="font-bold text-gray-400 border-b border-white/10 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">how_to_reg</span> Resumen Sesión
                            </h4>
                            <div className="flex items-center gap-2 text-white">
                                <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
                                <span className="font-mono font-bold text-lg">{formatTime(existingLog.durationSeconds)}</span>
                            </div>
                            {existingLog.photoUrl && (
                                <a href={existingLog.photoUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 group relative rounded-lg overflow-hidden border border-white/10">
                                    <img src={existingLog.photoUrl} alt="Evidencia" className="w-full h-32 object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                                        <span className="material-symbols-outlined text-white">zoom_in</span>
                                    </div>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function MicrocycleCard({ plan, isLatest, logs, athleteId, onLogSaved }: {
    plan: TrainingPlan;
    isLatest: boolean;
    logs: TrainingLog[];
    athleteId: string;
    onLogSaved: (log: TrainingLog) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(isLatest);

    // Calculate progress for this cycle
    const totalActiveDays = plan.days.filter(d => !d.isRestDay).length;
    const completedDays = plan.days.filter((d, idx) => {
        return logs.some(l => l.planId === plan.id && l.dayIndex === idx);
    }).length;
    const progress = totalActiveDays === 0 ? 0 : Math.round((completedDays / totalActiveDays) * 100);

    return (
        <div className="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-tech mb-6 transition-all">
            <div
                className="p-6 flex justify-between items-center cursor-pointer hover:bg-white/5"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
                        {isLatest ? "Semana Actual" : `Microciclo - ${new Date(plan.weekStartDate).toLocaleDateString()}`}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{completedDays} de {totalActiveDays} días activos completados ({progress}%)</p>
                </div>
                <div className="flex flex-col items-center">
                    <span className={`material-symbols-outlined text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </div>
            </div>

            {/* Progress Bar under header */}
            <div className="w-full bg-white/5 h-1">
                <div className="bg-primary h-1 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            {isExpanded && (
                <div className="p-6 space-y-4 bg-black/20">
                    {plan.days.map((day, idx) => (
                        <DayCard
                            key={idx}
                            planId={plan.id}
                            day={day}
                            dayIndex={idx}
                            athleteId={athleteId}
                            existingLog={logs.find(l => l.planId === plan.id && l.dayIndex === idx)}
                            onLogSaved={onLogSaved}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Main Page Component ---

function AthleteDashboard() {
    const { user } = useAuth();
    const [quote, setQuote] = useState("");
    const [plans, setPlans] = useState<TrainingPlan[]>([]);
    const [logs, setLogs] = useState<TrainingLog[]>([]);
    const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (!user?.uid) return;
            try {
                // Fetch up to 5 actual plans the athlete is included in
                const plansQ = query(
                    collection(db, "training_plans"),
                    where("athleteIds", "array-contains", user.uid)
                );
                const plansSnapshot = await getDocs(plansQ);
                const fetchedPlans = plansSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as TrainingPlan))
                    .sort((a, b) => {
                        const dateA = a.createdAt?.toMillis() || 0;
                        const dateB = b.createdAt?.toMillis() || 0;
                        return dateB - dateA;
                    });

                setPlans(fetchedPlans);

                // Fetch logs
                const logsQ = query(
                    collection(db, "training_logs"),
                    where("athleteId", "==", user.uid)
                );
                const logsSnapshot = await getDocs(logsQ);
                const fetchedLogs = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingLog));
                setLogs(fetchedLogs);

                // Fetch personal bests
                const pbQ = query(
                    collection(db, "personal_bests"),
                    where("athleteId", "==", user.uid)
                );
                const pbSnapshot = await getDocs(pbQ);
                let fetchedPBs = pbSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PersonalBest));

                if (fetchedPBs.length === 0) {
                    fetchedPBs = [
                        { athleteId: user.uid, discipline: "100m Planos", type: 'time', value: 10.51, date: { seconds: new Date("2025-10-12").getTime() / 1000 }, status: 'approved' },
                        { athleteId: user.uid, discipline: "Salto de Longitud", type: 'distance', value: 8.12, date: { seconds: new Date("2025-11-05").getTime() / 1000 }, status: 'approved' },
                        { athleteId: user.uid, discipline: "Decatlón", type: 'points', value: 8120, date: { seconds: new Date("2026-01-22").getTime() / 1000 }, status: 'pending' }
                    ];
                }

                setPersonalBests(fetchedPBs);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoadingData(false);
            }
        }

        fetchData();
    }, [user]);

    // Calculate Active Progress
    const activePlan = plans[0];
    const activeTotalDays = activePlan ? activePlan.days.filter((d) => !d.isRestDay).length : 0;
    const activeCompletedDays = activePlan ? logs.filter((l) => l.planId === activePlan.id).length : 0;
    const activeProgress = activeTotalDays > 0 ? Math.round((activeCompletedDays / activeTotalDays) * 100) : 0;

    const progressData = [
        { name: "Completado", value: activeProgress, color: "#13ec5b" }, // primary
        { name: "Pendiente", value: 100 - activeProgress, color: "#222222" },  // surface-dark
    ];

    const handleLogSaved = (newLog: TrainingLog) => {
        setLogs(prev => [...prev, newLog]);
    };

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-wide uppercase">
                        Mi Entrenamiento
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Hola, <span className="text-white font-bold">{user?.displayName || "Atleta"}</span>. Es un buen día para romper récords.
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
                    <h3 className="text-lg font-bold text-white mb-2 w-full text-left">Progreso de la Semana</h3>
                    <p className="text-xs text-gray-400 mb-6 w-full text-left">
                        {activePlan ? `${activeCompletedDays} de ${activeTotalDays} días` : 'Buscando plan...'}
                    </p>
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
                            <span className="text-3xl font-black text-white">{activeProgress}%</span>
                            <span className="text-xs text-primary font-bold tracking-widest uppercase mt-1">IF: 0.85</span>
                        </div>
                    </div>
                </div>

                {/* Personal Bests Table */}
                <div className="max-md:order-1 md:col-span-2 bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">emoji_events</span>
                            Mis marcas
                        </h3>
                        <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-gray-300">
                            Récords Oficiales
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-black/40 text-gray-400 border-b border-white/5">
                                <tr>
                                    <th className="px-4 py-3 font-medium rounded-tl-lg">Disciplina</th>
                                    <th className="px-4 py-3 font-medium">Marca</th>
                                    <th className="px-4 py-3 font-medium">Fecha</th>
                                    <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Estatus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {personalBests.map((pb, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4 text-white font-bold">{pb.discipline}</td>
                                        <td className="px-4 py-4 text-primary font-bold text-lg">{formatMetric(pb.type, pb.value)}</td>
                                        <td className="px-4 py-4 text-gray-400 text-xs">{pb.date?.seconds ? new Date(pb.date.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-4 py-4 text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${pb.status === 'approved' ? 'bg-primary/10 text-primary border-primary/20' : pb.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                {pb.status === 'approved' ? 'Validado' : pb.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {personalBests.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">Aún no hay marcas registradas.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Training Plans List */}
            <div className="space-y-6 pt-4">
                <h3 className="text-2xl font-black text-white tracking-wide uppercase border-b border-white/10 pb-4">
                    Plan de Entrenamiento
                </h3>

                {loadingData ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="material-symbols-outlined animate-spin text-primary text-5xl">refresh</span>
                    </div>
                ) : plans.length > 0 ? (
                    <div>
                        {plans.map((plan, index) => (
                            <MicrocycleCard
                                key={plan.id}
                                plan={plan}
                                isLatest={index === 0}
                                logs={logs}
                                athleteId={user!.uid}
                                onLogSaved={handleLogSaved}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-surface-dark border border-white/10 rounded-xl p-12 text-center flex flex-col items-center shadow-tech">
                        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 animate-pulse">explore</span>
                        <h4 className="text-xl font-bold text-white mb-2">Aún no hay asignaciones</h4>
                        <p className="text-gray-400 max-w-md"> Tu entrenador publicará el nuevo bloque pronto. Revisa los mensajes o contacta al club.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withRoleProtection(AthleteDashboard, ["athlete"]);
