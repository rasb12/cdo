"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { withRoleProtection } from "@/components/withRoleProtection";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { CldUploadWidget } from "next-cloudinary";

interface HistoryItem {
    event: string;
    pb: string;
}

// Helper to calculate FVA Category based on age
function calculateFVACategory(age: number): string {
    if (age <= 11) return "Pre-Infantil (U12)";
    if (age <= 13) return "Infantil (U14)";
    if (age <= 15) return "Menor (U16)";
    if (age <= 17) return "Juvenil B (U18)";
    if (age <= 19) return "Juvenil A (U20)";
    if (age <= 22) return "Sub-23 (U23)";
    if (age >= 35) return "Máster";
    return "Adulto (Libre)";
}

// Helper to calculate Age from YYYY-MM-DD
function calculateAge(dobString: string): number | null {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function Profile() {
    const { user } = useAuth();

    // Shared Fields
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // Athlete Fields (Comprehensive)
    const [idCard, setIdCard] = useState(""); // Cédula
    const [dob, setDob] = useState(""); // Fecha de Nacimiento
    const [bloodType, setBloodType] = useState("");

    // Sizing
    const [shirtSize, setShirtSize] = useState("");
    const [pantsSize, setPantsSize] = useState("");
    const [shoeSize, setShoeSize] = useState("");

    // Computed
    const [computedAge, setComputedAge] = useState<number | null>(null);
    const [fvaCategory, setFvaCategory] = useState<string>("");

    // Athletic Data
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Admin Fields
    const [profession, setProfession] = useState("");
    const [certifications, setCertifications] = useState("");

    // UI State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [photoUrl, setPhotoUrl] = useState("");

    const availableSpecialties = [
        // Velocidad y Vallas
        "100m", "200m", "400m", "800m", "1500m", "110m Vallas", "400m Vallas",
        // Fondo y Ruta
        "5K", "10K", "21K (Media Maratón)", "42K (Maratón)", "Trail Running", "Marcha Atlética",
        // Saltos
        "Salto de Longitud", "Triple Salto", "Salto de Altura", "Salto con Pértiga",
        // Lanzamientos
        "Lanzamiento de Peso", "Lanzamiento de Disco", "Lanzamiento de Jabalina", "Lanzamiento de Martillo",
        // Combinadas
        "Pentatlón", "Heptatlón", "Decatlón"
    ];

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    // Auto-compute Age and Category whenever DOB changes
    useEffect(() => {
        if (dob) {
            const age = calculateAge(dob);
            setComputedAge(age);
            if (age !== null) {
                setFvaCategory(calculateFVACategory(age));
            } else {
                setFvaCategory("");
            }
        } else {
            setComputedAge(null);
            setFvaCategory("");
        }
    }, [dob]);

    // Fetch User Document on Load
    useEffect(() => {
        async function fetchProfileData() {
            if (!user?.uid) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDisplayName(data.displayName || user.displayName || "");
                    setPhotoUrl(data.photoURL || user.photoURL || "");
                    setBio(data.bio || "");
                    setPhone(data.phone || "");
                    setAddress(data.address || "");

                    if (user.role === "athlete") {
                        setIdCard(data.idCard || "");
                        setDob(data.dob || "");
                        setBloodType(data.bloodType || "");
                        setShirtSize(data.shirtSize || "");
                        setPantsSize(data.pantsSize || "");
                        setShoeSize(data.shoeSize || "");

                        setSpecialties(data.specialties || []);
                        setHistory(data.history || []);
                    } else if (user.role === "admin") {
                        setProfession(data.profession || "");
                        setCertifications(data.certifications || "");
                        setSpecialties(data.specialties || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfileData();
    }, [user]);


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.uid) return;

        setSaving(true);
        setMessage({ text: "", type: "" });

        try {
            const docRef = doc(db, "users", user.uid);
            const updatePayload: any = {
                displayName,
                photoURL: photoUrl,
                bio,
                phone,
                address
            };

            if (user.role === "athlete") {
                updatePayload.idCard = idCard;
                updatePayload.dob = dob;
                updatePayload.bloodType = bloodType;
                updatePayload.shirtSize = shirtSize;
                updatePayload.pantsSize = pantsSize;
                updatePayload.shoeSize = shoeSize;
                updatePayload.specialties = specialties;
                updatePayload.history = history;
                // Save computed data so other views (like admin) can see it directly
                updatePayload.age = computedAge;
                updatePayload.fvaCategory = fvaCategory;
            } else if (user.role === "admin") {
                updatePayload.profession = profession;
                updatePayload.certifications = certifications;
                updatePayload.specialties = specialties;
            }

            await updateDoc(docRef, updatePayload);
            setMessage({ text: "Perfil actualizado exitosamente.", type: "success" });
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("Error updating profile", error);
            setMessage({ text: "Error al actualizar el perfil.", type: "error" });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ text: "", type: "" }), 4000);
        }
    };

    const toggleSpecialty = (spec: string) => {
        setSpecialties((prev) =>
            prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
        );
    };

    // HISTORY HANDLERS (for athletes)
    const addHistoryItem = () => {
        setHistory([...history, { event: "", pb: "" }]);
    };

    const updateHistoryItem = (index: number, field: keyof HistoryItem, value: string) => {
        const newHistory = [...history];
        newHistory[index][field] = value;
        setHistory(newHistory);
    };

    const removeHistoryItem = (index: number) => {
        const newHistory = [...history];
        newHistory.splice(index, 1);
        setHistory(newHistory);
    };

    const handleImageUpload = async (result: any) => {
        if (result?.event === "success" && result.info?.secure_url) {
            const newUrl = result.info.secure_url;
            setPhotoUrl(newUrl);

            // Update Firebase Auth profile immediately
            if (auth.currentUser) {
                try {
                    await updateProfile(auth.currentUser, {
                        photoURL: newUrl
                    });

                    // Also update Firestore to keep it synced
                    const docRef = doc(db, "users", user!.uid);
                    await updateDoc(docRef, { photoURL: newUrl } as any, { merge: true } as any);

                    setMessage({ text: "Foto de perfil actualizada", type: "success" });
                } catch (error) {
                    console.error("Error updating photo in Firebase:", error);
                    setMessage({ text: "Error al guardar la foto de perfil", type: "error" });
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="p-10 flex justify-center items-center h-[50vh]">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in-up">
            <header className="mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <img
                            src={photoUrl || "https://ui-avatars.com/api/?name=" + (displayName || (user as any)?.email || "User") + "&background=0a0a0a&color=0AFF5F"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(10,255,95,0.4)] object-cover"
                        />
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "cdo-profile-pics"}
                            onSuccess={handleImageUpload}
                            options={{
                                multiple: false,
                                maxFiles: 1,
                                cropping: true,
                                croppingAspectRatio: 1,
                                showSkipCropButton: false,
                                sources: ['local', 'camera'],
                                clientAllowedFormats: ['image'],
                                maxImageFileSize: 5000000, // 5MB limit
                                language: "es",
                                text: {
                                    es: {
                                        or: "O",
                                        menu: {
                                            files: "Mis Archivos",
                                            camera: "Cámara"
                                        },
                                        local: {
                                            browse: "Buscar Imagen",
                                            dd_title_single: "Arrastra y suelta tu foto aquí"
                                        }
                                    }
                                }
                            }}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white/90"
                                >
                                    <span className="material-symbols-outlined text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">add_a_photo</span>
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-wide uppercase">
                            Configurar Perfil
                        </h1>
                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">
                                {user?.role === 'admin' ? 'shield_person' : 'directions_run'}
                            </span>
                            Rol actual: <strong className="text-white capitalize">{user?.role === 'admin' ? 'Entrenador' : 'Atleta'}</strong>
                        </p>
                    </div>
                </div>

                {message.text && (
                    <div className={`mt-6 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 animate-fade-in ${message.type === 'success' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        <span className="material-symbols-outlined text-[20px]">
                            {message.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        {message.text}
                    </div>
                )}
            </header>

            <form onSubmit={handleSave} className="space-y-8">

                {/* SECTION: Shared Identity Fields */}
                <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                        <span className="material-symbols-outlined text-primary">person</span>
                        Identidad Básica
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Nombre Completo</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="Tu nombre y apellido"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Correo de Acceso (No editable)</label>
                            <input
                                type="text"
                                value={(user as any)?.email || ""}
                                disabled
                                className="w-full bg-black/20 border border-white/5 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION: Contact Data (Shared) */}
                <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                        <span className="material-symbols-outlined text-primary">contact_phone</span>
                        Datos de Contacto
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Nro. Telefónico</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="+58 412 1234567"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Dirección Físíca</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="Ciudad, Estado, Municipio"
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION: ATHLETE ONLY - Demographics & Computed */}
                {user?.role === 'athlete' && (
                    <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                            <span className="material-symbols-outlined text-primary">badge</span>
                            Ficha Personal (Atleta)
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Cédula de Identidad</label>
                                <input
                                    type="text"
                                    value={idCard}
                                    onChange={(e) => setIdCard(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="V-12345678"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 [&::-webkit-calendar-picker-indicator]:filter-invert transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Tipo de Sangre</label>
                                <select
                                    value={bloodType}
                                    onChange={(e) => setBloodType(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                >
                                    <option value="" disabled>Seleccionar...</option>
                                    {bloodTypes.map(bt => (
                                        <option key={bt} value={bt}>{bt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Computed Statistics Display */}
                        {dob && (
                            <div className="bg-black/40 border border-primary/20 p-4 rounded-lg flex items-center gap-6 mt-4 animate-fade-in">
                                <div>
                                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Edad Calculada (Automática)</span>
                                    <span className="text-2xl font-black text-white">{computedAge} <span className="text-sm text-gray-500 font-normal">años</span></span>
                                </div>
                                <div className="h-10 w-px bg-white/10"></div>
                                <div>
                                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Categoría FVA Asignada</span>
                                    <span className="text-lg font-bold text-primary">{fvaCategory}</span>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* SECTION: ATHLETE ONLY - Uniform Sizing */}
                {user?.role === 'athlete' && (
                    <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                            <span className="material-symbols-outlined text-primary">styler</span>
                            Tallas y Uniformidad
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Talla de Camisa</label>
                                <select value={shirtSize} onChange={(e) => setShirtSize(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                                    <option value="" disabled>Ej: M, L...</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Talla de Pantalón</label>
                                <input type="text" value={pantsSize} onChange={(e) => setPantsSize(e.target.value)} placeholder="Ej: M o 32" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Talla de Zapatos</label>
                                <input type="text" value={shoeSize} onChange={(e) => setShoeSize(e.target.value)} placeholder="Ej: 42 (EUR) / 9 (US)" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" />
                            </div>
                        </div>
                    </section>
                )}

                <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                        <span className="material-symbols-outlined text-primary">assignment</span>
                        Biografía Extendida
                    </h2>
                    <div className="space-y-2">
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors h-24 resize-none"
                            placeholder={user?.role === 'admin' ? "Describe tu filosofía de entrenamiento..." : "Cuéntanos sobre tus objetivos o por qué corres..."}
                        ></textarea>
                    </div>
                </section>

                {/* SECTION: Role Specific Technical Fields */}
                <section className="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-tech space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                        <span className="material-symbols-outlined text-primary">
                            {user?.role === 'admin' ? 'workspace_premium' : 'military_tech'}
                        </span>
                        Datos Técnicos / Deportivos
                    </h2>

                    {/* Admin Only: Profession & Certifications */}
                    {user?.role === 'admin' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b border-white/5 pb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Profesión Actual</label>
                                <input
                                    type="text"
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="Ej: Lic. en Educación Física"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Certificaciones V.O2 / Otras</label>
                                <input
                                    type="text"
                                    value={certifications}
                                    onChange={(e) => setCertifications(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="Ej: V.DO2 Distance Coach"
                                />
                            </div>
                        </div>
                    )}

                    {/* Shared: Specialties Tags */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">
                            {user?.role === 'admin' ? 'Especialidades como Entrenador' : 'Pruebas / Especialidades del Atleta'}
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {availableSpecialties.map((spec) => {
                                const isSelected = specialties.includes(spec);
                                return (
                                    <button
                                        type="button"
                                        key={spec}
                                        onClick={() => toggleSpecialty(spec)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isSelected
                                            ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(10,255,95,0.3)]'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                            }`}
                                    >
                                        {spec}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Athlete Only: Competitions History */}
                    {user?.role === 'athlete' && (
                        <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block">
                                    Historial de Competencias & PBs
                                </label>
                                <button
                                    type="button"
                                    onClick={addHistoryItem}
                                    className="text-xs font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors border border-primary/20"
                                >
                                    + Añadir Registro
                                </button>
                            </div>

                            {history.length === 0 ? (
                                <p className="text-sm text-gray-600 italic">No has registrado ninguna competencia aún.</p>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((item, index) => (
                                        <div key={index} className="flex flex-col md:flex-row items-center gap-3">
                                            <div className="flex-1 w-full bg-black/30 border border-white/10 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={item.event}
                                                    onChange={(e) => updateHistoryItem(index, "event", e.target.value)}
                                                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50"
                                                    placeholder="Evento (Ej: Maratón Caracas 2023)"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.pb}
                                                    onChange={(e) => updateHistoryItem(index, "pb", e.target.value)}
                                                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-primary font-bold text-sm focus:outline-none focus:border-primary/50"
                                                    placeholder="Marca (Ej: 03:15:40)"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeHistoryItem(index)}
                                                className="shrink-0 size-10 rounded border border-red-500/30 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center font-bold"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <div className="pt-4 sticky bottom-6 z-10">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary hover:bg-primary-hover text-black px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <><span className="material-symbols-outlined animate-spin">refresh</span> Guardando Cambios...</>
                        ) : (
                            <><span className="material-symbols-outlined">save</span> Guardar Perfil Completo</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default withRoleProtection(Profile, ["athlete", "admin"]);
