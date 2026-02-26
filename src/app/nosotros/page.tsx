"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
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

export default function Nosotros() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loadingStaff, setLoadingStaff] = useState(true);

    useEffect(() => {
        async function fetchTopStaff() {
            try {
                // Fetch staff members
                const q = query(
                    collection(db, "users"),
                    where("role", "in", STAFF_ROLES)
                );

                const querySnapshot = await getDocs(q);
                let staffData: StaffMember[] = [];

                querySnapshot.forEach((doc) => {
                    staffData.push({ uid: doc.id, ...doc.data() } as StaffMember);
                });

                // Prioritize Head Coach and Developers, and slice top 3
                staffData.sort((a, b) => {
                    if (a.role === 'head_coach') return -1;
                    if (b.role === 'head_coach') return 1;
                    if (a.role === 'developer') return -1;
                    if (b.role === 'developer') return 1;
                    return 0;
                });

                setStaff(staffData.slice(0, 3));
            } catch (error) {
                console.error("Error fetching staff:", error);
            } finally {
                setLoadingStaff(false);
            }
        }

        fetchTopStaff();
    }, []);
    return (
        <div className="flex-1 min-h-screen flex flex-col bg-background-dark">
            {/* Hero Section */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCiEzFgfp6jI81RtIPZGDOAOMEljBjFobTGYBfsufk1WKFV_Lm7-vu1oz6FOErkfKEOmmTwQKhilKMNQhzTDpKNAr_wZkD-0WEKEemikjpgdbwLpMf53yt4dtBIIsrdjGFHXpf25sm2oeZYRYonRO98taT5OIU_cRSt_V5RW97u7GpzweAg-XsVd37z7FOlwhBnDjODYf2g2jxFXYmWgGN_f4qgSNKGMN0XdNg6UpR_wcD-1LnPFKwKd1fcoKr4He1K2J-5zOFfVBc")',
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full max-w-4xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/90 text-slate-900 text-xs font-bold mb-3 backdrop-blur-sm shadow-[0_0_15px_rgba(19,236,91,0.3)]">
                        SOBRE NOSOTROS
                    </span>
                    <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tight mb-2 drop-shadow-lg">
                        Pasión por el Atletismo
                    </h1>
                    <p className="text-slate-300 text-lg font-light max-w-xl">
                        Formando campeones dentro y fuera de la pista desde 1998.
                    </p>
                </div>
            </div>

            <div className="px-6 py-12 lg:px-16 lg:py-16 max-w-7xl mx-auto w-full">
                {/* Timeline Section */}
                <section className="mb-20">
                    <h2 className="text-white text-3xl font-bold mb-10 border-l-4 border-primary pl-4">
                        Nuestra Historia
                    </h2>
                    <div className="grid grid-cols-[auto_1fr] gap-x-6 relative">
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-700"></div>

                        {/* Event 1 */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-10 rounded-full bg-surface-dark border-2 border-primary flex items-center justify-center shadow-[0_0_10px_rgba(19,236,91,0.2)]">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    flag
                                </span>
                            </div>
                        </div>
                        <div className="pb-12 pt-1">
                            <div className="bg-surface-dark p-6 rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 hover:border-primary/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-white">Los Orígenes de una Pasión</h3>
                                    <span className="text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm w-fit uppercase">
                                        1998
                                    </span>
                                </div>
                                <p className="text-slate-400">
                                    La iniciativa nace de la mano del entrenador Ramón Salazar, quien tras 42 años de trayectoria deportiva y de consolidar una escuela en su nombre con una pista construida por él mismo en Las Barrancas (Nueva Esparta), decide expandir su legado.
                                </p>
                            </div>
                        </div>

                        {/* Event 2 */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-10 rounded-full bg-surface-dark border-2 border-primary flex items-center justify-center shadow-[0_0_10px_rgba(19,236,91,0.2)]">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    school
                                </span>
                            </div>
                        </div>
                        <div className="pb-12 pt-1">
                            <div className="bg-surface-dark p-6 rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 hover:border-primary/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-white">
                                        Fundación y Reestructuración
                                    </h3>
                                    <span className="text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm w-fit uppercase">
                                        Evolución
                                    </span>
                                </div>
                                <p className="text-slate-400">
                                    Al trasladar su domicilio al estado Anzoátegui, el Entrenador Salazar funda la escuela inicialmente denominada "Los Olímpicos", la cual a través de un proceso de reingeniería adopta su emblemático nombre: Escuela de Atletismo Corredores de Oriente.
                                </p>
                            </div>
                        </div>

                        {/* Event 3 */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-10 rounded-full bg-surface-dark border-2 border-primary flex items-center justify-center shadow-[0_0_10px_rgba(19,236,91,0.2)]">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    emoji_events
                                </span>
                            </div>
                        </div>
                        <div className="pt-1">
                            <div className="bg-surface-dark p-6 rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 hover:border-primary/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-white">
                                        Sede Actual y Alto Rendimiento
                                    </h3>
                                    <span className="text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm w-fit uppercase">
                                        Presente
                                    </span>
                                </div>
                                <p className="text-slate-400">
                                    Ubicados en el Estadio Salvador de la Plaza del Complejo Polideportivo Simón Bolívar, masificamos el atletismo atendiendo a más de80 atletas anualmente. De ellos, el 80% de los más jóvenes son selección regional, el 60% del total son selección estadal y el 20% son selección nacional.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Misión y Visión */}
                <section className="mb-20 grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-surface-dark to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group border border-slate-700/50 shadow-lg">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-[120px] text-white">
                                rocket_launch
                            </span>
                        </div>
                        <div className="relative z-10">
                            <div className="size-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-primary text-2xl">
                                    target
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Nuestra Misión</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Formar atletas íntegros a través de la disciplina deportiva,
                                fomentando valores de perseverancia, trabajo en equipo y
                                excelencia personal para impactar positivamente en su
                                comunidad.
                            </p>
                        </div>
                    </div>
                    <div className="bg-surface-dark border border-slate-700/50 rounded-2xl p-8 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-[120px] text-white">
                                visibility
                            </span>
                        </div>
                        <div className="relative z-10">
                            <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center mb-6 border border-slate-700">
                                <span className="material-symbols-outlined text-primary text-2xl">
                                    light_mode
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Nuestra Visión</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Ser la escuela de atletismo de referencia en el oriente del
                                país, reconocida por la calidad técnica de nuestros entrenadores y
                                el desarrollo humano de nuestros deportistas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Equipo */}
                <section className="mb-20 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-white text-3xl font-bold border-l-4 border-primary pl-4 mb-2">
                                Conoce al Equipo
                            </h2>
                            <p className="text-slate-400 pl-5">
                                Profesionales dedicados a tu máximo rendimiento.
                            </p>
                        </div>
                        <Link href="/nosotros/equipo" className="text-primary font-bold hover:text-white transition-colors flex items-center gap-1 group w-max">
                            Ver todo el staff{" "}
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                arrow_forward
                            </span>
                        </Link>
                    </div>

                    {loadingStaff ? (
                        <div className="flex justify-center items-center py-10">
                            <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
                        </div>
                    ) : staff.length === 0 ? (
                        <div className="text-center py-10 bg-surface-dark rounded-xl border border-white/5">
                            <p className="text-gray-400">El equipo técnico se está conformando.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {staff.map((member) => (
                                <div key={member.uid} className="group bg-surface-dark rounded-xl overflow-hidden shadow-lg border border-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                                    <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative">
                                        <img
                                            alt={member.displayName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                            src={member.photoURL || `https://ui-avatars.com/api/?name=${member.displayName || "Staff"}&background=0a0a0a&color=0AFF5F`}
                                        />
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent p-4">
                                            <p className="text-primary text-[10px] font-black tracking-widest uppercase">
                                                {ROLE_TRANSLATIONS[member.role] || member.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                                            {member.displayName || "Usuario Sin Nombre"}
                                        </h3>
                                        <p className="text-sm text-slate-400 mb-4 line-clamp-1 italic">
                                            {member.bio && member.bio.length > 0 ? `"${member.bio}"` : ""}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {member.specialties && member.specialties.length > 0 ? (
                                                member.specialties.map(spec => (
                                                    <span key={spec} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700 font-bold uppercase text-[10px]">
                                                        {spec}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="px-2 py-1 bg-slate-800 text-slate-500 text-xs rounded-md border border-slate-700 font-bold uppercase text-[10px] italic">
                                                    Staff Activo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA */}
                <section className="rounded-2xl bg-gradient-to-br from-surface-dark to-surface-darker border border-slate-800 p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC3KPjhKFB_5RbJchnt87GMAHrxJDNnbm6OLURJKWqQYnavORNA2LpWANNDFcyS5qNCmMbQuw0wmHUDjLjLSG967-ygYMVKBovjyZV9EbzTrzpttPG6fXKbS1uW5UitmKW_igK3frloXniTn4RMG2yG4VCxQDMbPK72RC7GcQWvZy30g0qWuzIqDiHt8KURd7QwDBghWv1clF5gy0tMBZeakh1eZAxRieV90KtvahZGbeVDnaCA33ZcCplhVrSV1xU-XWxEiskwOM")',
                        }}
                    ></div>
                    <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
                        <div className="size-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(10,255,95,0.4)] animate-pulse">
                            <span className="material-symbols-outlined text-black font-bold text-3xl text-center">chat</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            ¿Listo para comenzar?
                        </h2>
                        <p className="text-slate-400 text-lg mb-8">
                            Únete a la familia de Corredores de Oriente hoy mismo. Escríbenos
                            directamente y agenda tu clase de prueba.
                        </p>
                        <Link href="/register" className="bg-primary hover:bg-[#20bd5a] text-black font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-primary/30 transform transition hover:-translate-y-1 flex items-center gap-2">
                            <span>Regístrate Ahora</span>
                            <span className="material-symbols-outlined">how_to_reg</span>
                        </Link>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="mt-auto py-8 px-6 border-t border-slate-800 text-center bg-background-dark">
                <p className="text-slate-500 text-sm">
                    © 2024 Corredores de Oriente. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
}
