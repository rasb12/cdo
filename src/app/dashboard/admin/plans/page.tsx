"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { withRoleProtection } from "@/components/withRoleProtection";
import { STAFF_ROLES } from "@/lib/permissions";
import { collection, getDocs, addDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Athlete {
    uid: string;
    displayName: string;
    email: string;
    specialties?: string[];
    trainingLevel?: string;
}

interface MainBlockExercise {
    id: string; // unique ID for React mappings
    description: string;
    sets: number | "";
    reps: number | "";
    restReps: string;
    restSets: string;
}

export interface DailyRoutineAdvanced {
    dayOfWeek: string;
    isRestDay: boolean;
    warmupText: string;
    mainBlocks: MainBlockExercise[];
    cooldownText: string;
}

const WARMUP_TAGS = ["Lubricación articular", "Trote calentamiento 10m", "Estiramiento dinámico", "Técnica de carrera", "Activación muscular"];
const COOLDOWN_TAGS = ["Elongación suave", "Estiramiento estático", "Trote regenerativo", "Pies en alto", "Masaje/Rodillo"];

function CreatePlan() {
    const { user } = useAuth();
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [loadingAthletes, setLoadingAthletes] = useState(true);

    // Form State
    const [weekStartDate, setWeekStartDate] = useState("");
    const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [expandedDay, setExpandedDay] = useState<string | null>("Lunes");

    const initialDays: DailyRoutineAdvanced[] = [
        "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
    ].map(day => ({
        dayOfWeek: day,
        isRestDay: false,
        warmupText: "",
        mainBlocks: [],
        cooldownText: ""
    }));

    const [days, setDays] = useState<DailyRoutineAdvanced[]>(initialDays);

    // Fetch Athletes
    useEffect(() => {
        async function fetchAthletes() {
            try {
                const q = query(collection(db, "users"), where("role", "==", "athlete"));
                const querySnapshot = await getDocs(q);
                const athletesData: Athlete[] = [];
                querySnapshot.forEach((doc) => {
                    athletesData.push({ uid: doc.id, ...doc.data() } as Athlete);
                });
                setAthletes(athletesData);
            } catch (error) {
                console.error("Error fetching athletes:", error);
            } finally {
                setLoadingAthletes(false);
            }
        }
        fetchAthletes();
    }, []);

    // DAY LEVEL HANDLERS
    const toggleRestDay = (dayIndex: number) => {
        const newDays = [...days];
        newDays[dayIndex].isRestDay = !newDays[dayIndex].isRestDay;
        setDays(newDays);
    };

    const handleTextChange = (dayIndex: number, field: "warmupText" | "cooldownText", value: string) => {
        const newDays = [...days];
        newDays[dayIndex][field] = value;
        setDays(newDays);
    };

    const addTagToText = (dayIndex: number, field: "warmupText" | "cooldownText", tag: string) => {
        const newDays = [...days];
        const currentText = newDays[dayIndex][field];
        newDays[dayIndex][field] = currentText ? `${currentText}, ${tag}` : tag;
        setDays(newDays);
    };

    // MAIN BLOCK HANDLERS
    const addExercise = (dayIndex: number) => {
        const newDays = [...days];
        newDays[dayIndex].mainBlocks.push({
            id: Date.now().toString() + Math.random().toString(),
            description: "",
            sets: "",
            reps: "",
            restReps: "",
            restSets: ""
        });
        setDays(newDays);
    };

    const removeExercise = (dayIndex: number, blockId: string) => {
        const newDays = [...days];
        newDays[dayIndex].mainBlocks = newDays[dayIndex].mainBlocks.filter(b => b.id !== blockId);
        setDays(newDays);
    };

    const updateExercise = (dayIndex: number, blockId: string, field: keyof MainBlockExercise, value: string | number) => {
        const newDays = [...days];
        const blockIndex = newDays[dayIndex].mainBlocks.findIndex(b => b.id === blockId);
        if (blockIndex > -1) {
            newDays[dayIndex].mainBlocks[blockIndex] = {
                ...newDays[dayIndex].mainBlocks[blockIndex],
                [field]: value
            };
            setDays(newDays);
        }
    };

    // SUBMIT & ASSIGNMENT LOGIC
    const toggleAthleteSelection = (uid: string) => {
        setSelectedAthleteIds(prev =>
            prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
        );
    };

    const selectAllAthletes = () => {
        if (selectedAthleteIds.length === athletes.length) {
            setSelectedAthleteIds([]);
        } else {
            setSelectedAthleteIds(athletes.map(a => a.uid));
        }
    };

    const selectGroup = (level: string) => {
        const groupAthletes = athletes.filter(a => a.trainingLevel === level).map(a => a.uid);
        if (groupAthletes.length === 0) return; // No action if empty group

        const allGroupInSelected = groupAthletes.every(uid => selectedAthleteIds.includes(uid));

        if (allGroupInSelected) {
            // Remueve a todo el grupo si ya están todos seleccionados
            setSelectedAthleteIds(prev => prev.filter(uid => !groupAthletes.includes(uid)));
        } else {
            // Añade a todos los del grupo a la lista existente
            setSelectedAthleteIds(prev => {
                const combined = new Set([...prev, ...groupAthletes]);
                return Array.from(combined);
            });
        }
    };

    const handleSavePlan = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!weekStartDate) {
            setMessage({ text: "Debes seleccionar una fecha de inicio.", type: "error" });
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (selectedAthleteIds.length === 0) {
            setMessage({ text: "Debes asignar el plan a al menos un atleta.", type: "error" });
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setSaving(true);
        setMessage({ text: "", type: "" });

        try {
            await addDoc(collection(db, "training_plans"), {
                athleteIds: selectedAthleteIds,
                weekStartDate,
                days,
                assignedBy: user?.uid,
                createdAt: Timestamp.now(),
            });

            setMessage({ text: "Plan avanzado asignado exitosamente.", type: "success" });

            // Reset Form (must use a fresh generator to reset completely)
            setWeekStartDate("");
            setSelectedAthleteIds([]);
            setDays([
                "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
            ].map(day => ({
                dayOfWeek: day,
                isRestDay: false,
                warmupText: "",
                mainBlocks: [],
                cooldownText: ""
            })));
            window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (error) {
            console.error("Error saving plan:", error);
            setMessage({ text: "Error al guardar el plan.", type: "error" });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ text: "", type: "" }), 5000);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <Link href="/dashboard/admin/plans/manage" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors text-sm font-bold w-fit">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Ver Planes Asignados
                    </Link>
                    <h1 className="text-3xl font-black text-white tracking-wide uppercase flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl">calendar_month</span>
                        Constructor de Microciclo
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Define los calentamientos, técnica, bloques de repeción y vueltas a la calma.
                    </p>
                </div>

                {message.text && (
                    <div className={`px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 animate-fade-in ${message.type === 'success' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        <span className="material-symbols-outlined text-[20px]">
                            {message.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        {message.text}
                    </div>
                )}
            </header>

            <form onSubmit={handleSavePlan} className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">

                {/* LEFT COLUMN: Routine Builder Accordion */}
                <div className="space-y-6">
                    <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4 mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_document</span>
                                Estructura Diaria
                            </h2>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-bold text-gray-400 uppercase">Inicio de Semana (Lunes):</label>
                                <input
                                    type="date"
                                    value={weekStartDate}
                                    onChange={(e) => setWeekStartDate(e.target.value)}
                                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50 [&::-webkit-calendar-picker-indicator]:filter-invert"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {days.map((day, dIdx) => {
                                const isExpanded = expandedDay === day.dayOfWeek;

                                return (
                                    <div key={day.dayOfWeek} className={`rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-primary/50 bg-black/40 shadow-[0_0_20px_rgba(10,255,95,0.05)]' : 'border-white/10 bg-black/20 hover:border-white/20'
                                        }`}>

                                        {/* ACCORDION HEADER */}
                                        <div
                                            className="p-4 flex items-center justify-between cursor-pointer"
                                            onClick={() => setExpandedDay(isExpanded ? null : day.dayOfWeek)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`material-symbols-outlined transition-transform ${isExpanded ? 'rotate-180 text-primary' : 'text-gray-500'}`}>
                                                    expand_more
                                                </span>
                                                <span className={`font-black uppercase tracking-widest text-lg ${day.isRestDay ? 'text-gray-600 line-through' : (isExpanded ? 'text-white' : 'text-gray-300')}`}>
                                                    {day.dayOfWeek}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); toggleRestDay(dIdx); }}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${day.isRestDay ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {day.isRestDay ? 'DÍA DE DESCANSO' : 'MARCAR DESCANSO'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACCORDION BODY */}
                                        {isExpanded && !day.isRestDay && (
                                            <div className="p-4 border-t border-white/10 space-y-8 animate-fade-in pb-8">

                                                {/* SECTION 1: WARMUP */}
                                                <div className="space-y-3">
                                                    <h3 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                                                        <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                                                        1. Calentamiento (Rutinario)
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {WARMUP_TAGS.map(tag => (
                                                            <button
                                                                type="button"
                                                                key={tag}
                                                                onClick={() => addTagToText(dIdx, "warmupText", tag)}
                                                                className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/10 hover:bg-white/10 transition-colors"
                                                            >
                                                                + {tag}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <textarea
                                                        value={day.warmupText}
                                                        onChange={(e) => handleTextChange(dIdx, "warmupText", e.target.value)}
                                                        placeholder="Calentamiento, técnica, etc..."
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 resize-y min-h-[60px]"
                                                    />
                                                </div>

                                                {/* SECTION 2: MAIN BLOCKS */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                                                            <span className="material-symbols-outlined text-[18px]">sprint</span>
                                                            2. Bloque Principal (Técnico / Específico)
                                                        </h3>
                                                        <button
                                                            type="button"
                                                            onClick={() => addExercise(dIdx)}
                                                            className="text-xs font-bold bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-black transition-colors flex items-center gap-1"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">add</span>
                                                            Añadir Ejercicio
                                                        </button>
                                                    </div>

                                                    {day.mainBlocks.length === 0 ? (
                                                        <p className="text-xs text-gray-500 italic py-2">No hay ejercicios principales añadidos.</p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {day.mainBlocks.map((block, bIdx) => (
                                                                <div key={block.id} className="relative bg-surface-dark border border-white/5 rounded-lg p-3 group">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeExercise(dIdx, block.id)}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full size-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                                                    </button>

                                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                                                        {/* Descripción */}
                                                                        <div className="md:col-span-12">
                                                                            <input
                                                                                type="text"
                                                                                value={block.description}
                                                                                onChange={(e) => updateExercise(dIdx, block.id, "description", e.target.value)}
                                                                                placeholder="Ej: Carrera de 300m planos a ritmo 85%"
                                                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                                                                            />
                                                                        </div>

                                                                        {/* Series x Reps */}
                                                                        <div className="md:col-span-4 flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5">
                                                                            <div className="flex-1">
                                                                                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Series</label>
                                                                                <input
                                                                                    type="number" min="0" value={block.sets}
                                                                                    onChange={(e) => updateExercise(dIdx, block.id, "sets", parseInt(e.target.value) || "")}
                                                                                    className="w-full bg-black/60 border border-white/10 rounded px-2 py-1.5 text-white text-center text-sm focus:border-primary/50"
                                                                                />
                                                                            </div>
                                                                            <span className="text-gray-600 font-bold mt-4">x</span>
                                                                            <div className="flex-1">
                                                                                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Reps</label>
                                                                                <input
                                                                                    type="number" min="0" value={block.reps}
                                                                                    onChange={(e) => updateExercise(dIdx, block.id, "reps", parseInt(e.target.value) || "")}
                                                                                    className="w-full bg-black/60 border border-white/10 rounded px-2 py-1.5 text-white text-center text-sm focus:border-primary/50"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        {/* Descansos (Rest) */}
                                                                        <div className="md:col-span-8 flex items-center gap-3 bg-black/30 p-2 rounded-lg border border-white/5">
                                                                            <div className="flex-1">
                                                                                <label className="block text-[10px] text-cyan-500 uppercase font-bold mb-1 flex items-center gap-1">
                                                                                    <span className="material-symbols-outlined text-[12px]">timer</span>
                                                                                    Descanso / Rep
                                                                                </label>
                                                                                <input
                                                                                    type="text" value={block.restReps} placeholder="Ej: 1 min"
                                                                                    onChange={(e) => updateExercise(dIdx, block.id, "restReps", e.target.value)}
                                                                                    className="w-full bg-black/60 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:border-cyan-500/50"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <label className="block text-[10px] text-cyan-500 uppercase font-bold mb-1 flex items-center gap-1">
                                                                                    <span className="material-symbols-outlined text-[12px]">hourglass_empty</span>
                                                                                    Descanso / Serie
                                                                                </label>
                                                                                <input
                                                                                    type="text" value={block.restSets} placeholder="Ej: 5 min"
                                                                                    onChange={(e) => updateExercise(dIdx, block.id, "restSets", e.target.value)}
                                                                                    className="w-full bg-black/60 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:border-cyan-500/50"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* SECTION 3: COOLDOWN & CORE */}
                                                <div className="space-y-3 pt-4 border-t border-white/5">
                                                    <h3 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                                                        <span className="material-symbols-outlined text-[18px]">self_improvement</span>
                                                        3. Vuelta a la Calma & Abdomen
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {COOLDOWN_TAGS.map(tag => (
                                                            <button
                                                                type="button"
                                                                key={tag}
                                                                onClick={() => addTagToText(dIdx, "cooldownText", tag)}
                                                                className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/10 hover:bg-white/10 transition-colors"
                                                            >
                                                                + {tag}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <textarea
                                                        value={day.cooldownText}
                                                        onChange={(e) => handleTextChange(dIdx, "cooldownText", e.target.value)}
                                                        placeholder="Elongación, Abdominales 3x30, etc..."
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 resize-y min-h-[60px]"
                                                    />
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: Assignment & Submit */}
                <div className="space-y-6">
                    <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech flex flex-col h-full lg:sticky lg:top-8 max-h-[80vh]">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">group_add</span>
                                Asignación
                            </h2>
                            <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full border border-primary/30">
                                {selectedAthleteIds.length} selec.
                            </span>
                        </div>

                        {loadingAthletes ? (
                            <div className="flex-1 flex justify-center items-center py-10">
                                <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
                            </div>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={selectAllAthletes}
                                    className="w-full text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white mb-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    {selectedAthleteIds.length === athletes.length ? "Deseleccionar Todos" : "Seleccionar Escuela Ent."}
                                </button>

                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => selectGroup('Básico')}
                                        className="text-[10px] font-bold uppercase py-2 rounded-lg border border-white/10 text-gray-400 hover:text-primary hover:border-primary/30 transition-colors bg-black/20"
                                        title="Seleccionar grupo Básico"
                                    >
                                        Básico
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => selectGroup('Intermedio')}
                                        className="text-[10px] font-bold uppercase py-2 rounded-lg border border-white/10 text-gray-400 hover:text-primary hover:border-primary/30 transition-colors bg-black/20"
                                        title="Seleccionar grupo Intermedio"
                                    >
                                        Interm.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => selectGroup('Avanzado')}
                                        className="text-[10px] font-bold uppercase py-2 rounded-lg border border-white/10 text-gray-400 hover:text-primary hover:border-primary/30 transition-colors bg-black/20"
                                        title="Seleccionar grupo Avanzado"
                                    >
                                        Avanzado
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                    {athletes.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">No hay atletas registrados aún.</p>
                                    ) : (
                                        athletes.map(athlete => {
                                            const isSelected = selectedAthleteIds.includes(athlete.uid);
                                            return (
                                                <div
                                                    key={athlete.uid}
                                                    onClick={() => toggleAthleteSelection(athlete.uid)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${isSelected
                                                        ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(10,255,95,0.1)]'
                                                        : 'bg-black/30 border-white/5 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className={`size-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-primary border-primary text-black' : 'border-gray-500'}`}>
                                                        {isSelected && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                            {athlete.displayName || "Atleta Sin Nombre"}
                                                        </p>
                                                        {athlete.specialties && athlete.specialties.length > 0 ? (
                                                            <p className="text-[10px] text-gray-500 truncate uppercase mt-0.5">
                                                                {athlete.specialties[0]} {athlete.specialties.length > 1 ? `+${athlete.specialties.length - 1}` : ''}
                                                            </p>
                                                        ) : (
                                                            <p className="text-[10px] text-gray-600 truncate uppercase mt-0.5">Sin Especialidad</p>
                                                        )}
                                                        {athlete.trainingLevel && (
                                                            <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-white/5 border border-white/10 text-primary">
                                                                {athlete.trainingLevel}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </>
                        )}

                        <div className="pt-6 border-t border-white/5 mt-auto">
                            <button
                                type="submit"
                                disabled={saving || athletes.length === 0}
                                className="w-full bg-primary hover:bg-primary-hover text-black py-4 rounded-xl font-black tracking-widest uppercase shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        Emisión Global
                                    </>
                                )}
                            </button>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
}

// Only admins/coaches can access this route
export default withRoleProtection(CreatePlan, STAFF_ROLES);
