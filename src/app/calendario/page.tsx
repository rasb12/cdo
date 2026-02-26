"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Competition } from "@/types/competition";
import { hasPermission, Role } from "@/lib/permissions";
import CompetitionModal from "@/components/calendar/CompetitionModal";
import Link from "next/link";
import seedCompetitions from "@/scripts/seedCompetitions";

export default function Calendario() {
    const { user, loading } = useAuth();
    const canManage = hasPermission(user?.role as Role, 'manage_calendar');
    const isDeveloper = user?.role === 'developer';

    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [fetching, setFetching] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingComp, setEditingComp] = useState<Competition | null>(null);
    const [toastMessage, setToastMessage] = useState({ text: "", type: "" });

    const fetchCompetitions = async () => {
        setFetching(true);
        try {
            const q = query(collection(db, "competitions"), orderBy("date", "asc"));
            const snapshot = await getDocs(q);
            const data: Competition[] = [];
            snapshot.forEach(d => {
                data.push({ id: d.id, ...d.data() } as Competition);
            });
            setCompetitions(data);
        } catch (error) {
            console.error("Error fetching competitions:", error);
            showToast("Error al cargar las competencias.", "error");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const showToast = (text: string, type: "success" | "error") => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage({ text: "", type: "" }), 4000);
    };

    const handleDelete = async (comp: Competition) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar la competencia "${comp.name}"?`)) return;

        try {
            await deleteDoc(doc(db, "competitions", comp.id!));
            setCompetitions(prev => prev.filter(c => c.id !== comp.id));
            showToast("Competencia eliminada exitosamente.", "success");
        } catch (error) {
            console.error("Error deleting competition:", error);
            showToast("Error al eliminar la competencia.", "error");
        }
    };

    const handleOpenModal = (comp?: Competition) => {
        if (comp) setEditingComp(comp);
        else setEditingComp(null);
        setIsModalOpen(true);
    };

    const handleModalSuccess = (msg: string) => {
        showToast(msg, "success");
        fetchCompetitions();
    };

    // Separate future and past races
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const upcoming = competitions.filter(c => c.date >= today);
    const past = competitions.filter(c => c.date < today).reverse();

    const CompetitionCard = ({ comp }: { comp: Competition }) => {
        const dateObj = new Date(comp.date + "T12:00:00Z");
        const isPast = comp.date < today;

        return (
            <div className={`relative bg-surface-dark border rounded-2xl p-6 transition-all group overflow-hidden ${isPast ? 'border-white/5 opacity-70' : 'border-white/10 hover:border-primary/50 shadow-tech'}`}>
                {/* Admin Overlay Actions */}
                {canManage && (
                    <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2 bg-black/80 px-2 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm z-10">
                        <button
                            onClick={() => handleOpenModal(comp)}
                            className="p-1 hover:text-primary transition-colors tooltip"
                            title="Editar Evento"
                        >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                            onClick={() => handleDelete(comp)}
                            className="p-1 hover:text-red-400 text-gray-400 transition-colors tooltip"
                            title="Eliminar Evento"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center shrink-0 bg-black/40 border border-white/5 rounded-xl w-24 h-24">
                        <span className={`text-3xl font-black ${isPast ? 'text-gray-500' : 'text-primary'}`}>
                            {dateObj.getDate()}
                        </span>
                        <span className="text-xs uppercase font-bold tracking-widest text-gray-400">
                            {dateObj.toLocaleString('es-ES', { month: 'short' })}
                        </span>
                        <span className="text-[10px] text-gray-600 mt-1">{dateObj.getFullYear()}</span>
                    </div>

                    {/* Content Block */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-xl font-bold ${isPast ? 'text-gray-300' : 'text-white'}`}>
                            {comp.name}
                        </h3>
                        <div className="flex items-start md:items-center gap-2 mt-2 text-sm text-gray-400">
                            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5 md:mt-0">location_on</span>
                            <span className="leading-tight">{comp.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {comp.distances.map(d => (
                                <span key={d} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/5 border border-white/10 text-gray-300">
                                    {d}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Registration CTA (if available) */}
                    {comp.registrationUrl && !isPast && (
                        <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                            <a
                                href={comp.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors border border-white/20"
                            >
                                Registrarse
                            </a>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">

                {/* Header section */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-8 animate-fade-in-up">
                    <div className="max-w-2xl w-full">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2 sm:gap-4 leading-none">
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="material-symbols-outlined text-primary text-4xl md:text-6xl">event</span>
                                <span>Calendario</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>de</span>
                                <span className="text-primary">Competencias</span>
                            </div>
                        </h1>
                        <p className="text-gray-400 mt-4 text-base md:text-lg">
                            Descubre los próximos maratones y competencias en Venezuela. Prepárate con nuestros planes de entrenamiento y alcanza tus metas.
                        </p>
                    </div>

                    {canManage && (
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
                            {isDeveloper && upcoming.length === 0 && past.length === 0 && (
                                <button
                                    onClick={async () => {
                                        setFetching(true);
                                        await seedCompetitions();
                                        await fetchCompetitions();
                                        showToast("Datos semilla insertados correctamente.", "success");
                                    }}
                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all w-full sm:w-auto"
                                >
                                    <span className="material-symbols-outlined text-[20px]">database</span>
                                    Cargar Data Inicial
                                </button>
                            )}
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-glow w-full sm:w-auto"
                            >
                                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                                Añadir Evento
                            </button>
                        </div>
                    )}
                </header>

                {toastMessage.text && (
                    <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-fade-in shadow-2xl ${toastMessage.type === 'success' ? 'bg-[#0A2010] text-[#0AFF5F] border border-[#0AFF5F]/30' : 'bg-[#300A0A] text-[#FF4C4C] border border-[#FF4C4C]/30'}`}>
                        <span className="material-symbols-outlined text-[24px]">
                            {toastMessage.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        {toastMessage.text}
                    </div>
                )}

                {fetching ? (
                    <div className="py-20 flex flex-col items-center justify-center text-primary animate-pulse">
                        <span className="material-symbols-outlined text-5xl mb-4 animate-spin">refresh</span>
                        <p className="font-bold tracking-widest uppercase">Cargando Calendario...</p>
                    </div>
                ) : (
                    <div className="space-y-16 animate-fade-in-up delay-100">
                        {/* Upcoming Races */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                Próximas Competencias
                            </h2>

                            {upcoming.length === 0 ? (
                                <div className="text-center py-12 bg-surface-dark border border-white/5 rounded-2xl">
                                    <span className="material-symbols-outlined text-gray-500 text-5xl mb-3">calendar_month</span>
                                    <p className="text-gray-400 font-bold">No hay próximas competencias registradas por ahora.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {upcoming.map(comp => (
                                        <CompetitionCard key={comp.id} comp={comp} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Past Races */}
                        {past.length > 0 && (
                            <section className="space-y-6 pt-8 border-t border-white/5">
                                <h2 className="text-xl font-black text-gray-500 uppercase flex items-center gap-3">
                                    <span className="w-6 h-1 bg-gray-600 rounded-full"></span>
                                    Eventos Pasados
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                                    {past.slice(0, 10).map(comp => (
                                        <CompetitionCard key={comp.id} comp={comp} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

            {/* Admin Modal */}
            <CompetitionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingCompetition={editingComp}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
}
