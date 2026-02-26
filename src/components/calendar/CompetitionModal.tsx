"use client";

import { useState } from "react";
import { Competition } from "@/types/competition";
import { addDoc, updateDoc, doc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CompetitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingCompetition: Competition | null;
    onSuccess: (updatedOrNewText: string) => void;
}

const DISTANCE_OPTIONS = ["1K", "2K", "3K", "5K", "10K", "15K", "21K", "42K", "Ultra", "Relevos", "Trail"];

export default function CompetitionModal({ isOpen, onClose, editingCompetition, onSuccess }: CompetitionModalProps) {
    const [name, setName] = useState(editingCompetition?.name || "");
    const [date, setDate] = useState(editingCompetition?.date || "");
    const [location, setLocation] = useState(editingCompetition?.location || "");
    const [distances, setDistances] = useState<string[]>(editingCompetition?.distances || []);
    const [registrationUrl, setRegistrationUrl] = useState(editingCompetition?.registrationUrl || "");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const toggleDistance = (d: string) => {
        setDistances(prev =>
            prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name || !date || !location || distances.length === 0) {
            setError("Por favor completa los campos obligatorios y selecciona al menos una distancia.");
            return;
        }

        setSaving(true);
        try {
            const competitionData = {
                name,
                date,
                location,
                distances,
                registrationUrl,
                updatedAt: Timestamp.now()
            };

            if (editingCompetition?.id) {
                // Update
                const docRef = doc(db, "competitions", editingCompetition.id);
                await updateDoc(docRef, competitionData);
                onSuccess("Competencia actualizada correctamente.");
            } else {
                // Create
                await addDoc(collection(db, "competitions"), {
                    ...competitionData,
                    createdAt: Timestamp.now()
                });
                onSuccess("Competencia añadida correctamente.");
            }
            onClose();
        } catch (err: any) {
            console.error("Error saving competition:", err);
            setError("Ocurrió un error al guardar. Inténtalo de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface-dark w-full max-w-lg rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">

                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                            {editingCompetition ? 'edit_calendar' : 'event_available'}
                        </span>
                        {editingCompetition ? 'Editar Competencia' : 'Añadir Competencia'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nombre del Evento *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Media Maratón de Valencia"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Fecha *</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 [&::-webkit-calendar-picker-indicator]:filter-invert"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ubicación *</label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Ej: Caracas, DF"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Distancias *</label>
                        <div className="flex flex-wrap gap-2">
                            {DISTANCE_OPTIONS.map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => toggleDistance(d)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${distances.includes(d)
                                            ? 'bg-primary text-black border-primary'
                                            : 'bg-black/30 text-gray-400 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Link de Registro / Info (Opcional)</label>
                        <input
                            type="url"
                            value={registrationUrl}
                            onChange={(e) => setRegistrationUrl(e.target.value)}
                            placeholder="Ej: https://tucarrera.com"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-primary hover:bg-primary-hover text-black py-3 rounded-lg font-black uppercase tracking-widest shadow-glow transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <><span className="material-symbols-outlined animate-spin align-middle">refresh</span> Guardando</>
                            ) : (
                                'Guardar'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
