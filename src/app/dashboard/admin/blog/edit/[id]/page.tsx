"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { withRoleProtection } from "@/components/withRoleProtection";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";

const BLOG_CATEGORIES = [
    "Entrenamiento",
    "Nutrición",
    "Equipamiento",
    "Recomendaciones",
    "Recuperación",
    "Noticias"
];

function AdminEditBlogCMS() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
    const [imageURL, setImageURL] = useState("");
    const [content, setContent] = useState("");

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Cargar los datos del post existente
    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            try {
                const docRef = doc(db, "blog_posts", postId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title || "");
                    setCategory(data.category || BLOG_CATEGORIES[0]);
                    setImageURL(data.imageURL || "");
                    setContent(data.content || "");
                } else {
                    setMessage({ text: "El post original no fue encontrado.", type: "error" });
                }
            } catch (error) {
                console.error("Error fetching post data:", error);
                setMessage({ text: "Error conectando con la base de datos.", type: "error" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim() || !imageURL.trim()) {
            setMessage({ text: "El título, la imagen y el contenido son obligatorios.", type: "error" });
            return;
        }

        setIsSaving(true);
        setMessage({ text: "", type: "" });

        try {
            // Re-generar slug en caso de que hayan cambiado el título
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            const docRef = doc(db, "blog_posts", postId);

            await updateDoc(docRef, {
                title,
                slug,
                category,
                imageURL,
                content
            });

            setMessage({ text: "¡Post actualizado exitosamente!", type: "success" });

            setTimeout(() => {
                router.push(`/blog/${slug}`);
            }, 1500);

        } catch (error: any) {
            console.error("Error updating post:", error);
            setMessage({ text: `Error al actualizar: ${error.message}`, type: "error" });
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full p-20">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in-up">
            <header className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-wide uppercase flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl">edit</span>
                        Editar Artículo
                    </h1>
                    <p className="text-gray-400 mt-1">Estás modificando un artículo previamente publicado.</p>
                </div>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider bg-surface-dark border border-white/10 px-4 py-2 rounded-lg hover:border-white/30"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Regresar
                </button>
            </header>

            {message.text && (
                <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 animate-fade-in ${message.type === 'success' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                        {message.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario Principal */}
                <form onSubmit={handleUpdate} className="lg:col-span-2 space-y-6">
                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 shadow-2xl space-y-5">

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Título del Artículo</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium text-lg placeholder-gray-600"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Categoría</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                >
                                    {BLOG_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">URL de la Portada</label>
                                <input
                                    type="url"
                                    required
                                    value={imageURL}
                                    onChange={(e) => setImageURL(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm placeholder-gray-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Desarrollo del Contenido</label>
                            <textarea
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={12}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-y font-mono text-sm leading-relaxed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-4 bg-primary text-black font-black uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(10,255,95,0.2)]"
                        >
                            {isSaving ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    Guardando Cambios...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">save</span>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Vista Previa en Vivo (Side panel) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            Vista Previa
                        </h3>

                        <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Hero Preview */}
                            <div
                                className="h-48 w-full bg-gray-900 relative flex items-end p-4 border-b border-white/10"
                                style={{
                                    backgroundImage: `url(${imageURL || 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                <div className="relative z-10 w-full">
                                    <span className="bg-primary text-black text-xs font-black uppercase px-2 py-1 rounded inline-block mb-2">
                                        {category}
                                    </span>
                                    <h4 className="text-white font-black leading-tight line-clamp-2">
                                        {title || "Título"}
                                    </h4>
                                </div>
                            </div>

                            {/* Content Preview */}
                            <div className="p-4">
                                <p className="text-gray-400 text-sm line-clamp-5 leading-relaxed break-words whitespace-pre-wrap">
                                    {content || "Escribe el contenido de tu artículo aquí..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRoleProtection(AdminEditBlogCMS, ["admin"]);
