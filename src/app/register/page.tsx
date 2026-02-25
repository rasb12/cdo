"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    if (authLoading) return null; // Avoid flicker

    if (user) {
        router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard/athlete");
        return null;
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            return setError("Las contraseñas no coinciden.");
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update display name
            await updateProfile(userCredential.user, {
                displayName: name,
            });

            // Create user document in Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: userCredential.user.email,
                displayName: name,
                role: "athlete",
                createdAt: new Date().toISOString(),
            });

            // Effect at top will handle routing
        } catch (err: any) {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                setError("Este correo ya está registrado.");
            } else if (err.code === "auth/weak-password") {
                setError("La contraseña debe tener al menos 6 caracteres.");
            } else {
                setError("Error al crear la cuenta. Por favor, intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen flex items-center justify-center bg-background-dark p-6">
            <div className="w-full max-w-md bg-surface-dark p-8 md:p-10 rounded-2xl border border-white/10 shadow-tech">
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-16 shadow-[0_0_10px_rgba(10,255,95,0.2)] border border-primary/20 mb-4"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgbXWr2pDxXaQ2RzPHwBG8MJ_-Nt5HXjvaO_0YAc1ji2OCOkgWpHHL1P3jmhi82ir8AYaQ_IIc9YxifiLXm8523XWqdjVQFImwfSrxUJnxQDqEjBPSM7sZC7IFDFTkrFT7DLJKVjzqeHl97Y3JAlkjPX2IcIT238FE3RtTvw1ZwlXFfkDjpqZPbjvKub7rTXkhM8J2Jtc14NyJAqXs-47XpeF73ucErAdf0PuY-BJF14hrPl45rDBrtJNJJO49aLIUb-wD1sNutFU")',
                        }}
                    />
                    <h1 className="text-3xl font-black text-white text-center tracking-wide">
                        CREAR CUENTA
                    </h1>
                    <p className="text-gray-400 mt-2 text-center text-sm">
                        Únete a nuestra Escuela de Atletismo
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={async () => {
                        try {
                            setLoading(true);
                            setError("");
                            const provider = new GoogleAuthProvider();
                            const result = await signInWithPopup(auth, provider);

                            // Check and create Firestore document
                            const userDocRef = doc(db, "users", result.user.uid);
                            await setDoc(userDocRef, {
                                email: result.user.email,
                                displayName: result.user.displayName,
                                role: "athlete",
                                createdAt: new Date().toISOString(),
                            }, { merge: true }); // Use merge so existing docs aren't overwritten blindly

                            router.push("/");
                        } catch (err: any) {
                            console.error(err);
                            setError("Error al registrarse con Google.");
                            setLoading(false);
                        }
                    }}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 rounded-lg h-12 bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors mb-6 shadow-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Regístrate con Google
                </button>

                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative z-10 bg-surface-dark px-4 text-xs text-gray-400 uppercase tracking-widest">
                        O regístrate con correo
                    </div>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                            Nombre Completo
                        </label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                placeholder="Tu nombre"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                            Correo Electrónico
                        </label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                placeholder="tu@correo.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                            Contraseña
                        </label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                            Confirmar Contraseña
                        </label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                            </span>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 flex items-center justify-center rounded-lg h-12 bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed text-black text-sm font-bold tracking-wide transition-all shadow-glow hover:shadow-[0_0_20px_rgba(10,255,95,0.6)]"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                        ) : (
                            "Crear Cuenta"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-gray-400 text-sm">
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:text-white font-bold transition-colors"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
