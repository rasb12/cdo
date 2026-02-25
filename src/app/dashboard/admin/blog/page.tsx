"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { withRoleProtection } from "@/components/withRoleProtection";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CldUploadWidget } from "next-cloudinary";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// React Quill required dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const BLOG_CATEGORIES = [
    "Entrenamiento",
    "Nutrición",
    "Equipamiento",
    "Recomendaciones",
    "Recuperación",
    "Noticias"
];

function AdminBlogCMS() {
    const { user } = useAuth();

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
    const [imageURL, setImageURL] = useState("");
    const [content, setContent] = useState("");

    // UI State
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim() || !imageURL.trim()) {
            setMessage({ text: "El título, la imagen y el contenido son obligatorios.", type: "error" });
            return;
        }

        setIsSaving(true);
        setMessage({ text: "", type: "" });

        try {
            // Generate a simple url-friendly slug from the title
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            const postData = {
                title,
                slug,
                category,
                imageURL,
                content,
                authorId: user?.uid,
                authorName: user?.displayName || "Administrador",
                createdAt: serverTimestamp(),
                status: "published"
            };

            await addDoc(collection(db, "blog_posts"), postData);

            setMessage({ text: "¡Post publicado exitosamente!", type: "success" });

            // Reset form
            setTitle("");
            setImageURL("");
            setContent("");
            setCategory(BLOG_CATEGORIES[0]);

            setTimeout(() => setMessage({ text: "", type: "" }), 4000);

        } catch (error: any) {
            console.error("Error publishing post:", error);
            setMessage({ text: `Error al publicar: ${error.message}`, type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in-up">
            <header className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-wide uppercase flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl">edit_document</span>
                        Editor de Blog
                    </h1>
                    <p className="text-gray-400 mt-1">Crea y publica nuevos artículos para la comunidad.</p>
                </div>
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
                <form onSubmit={handlePublish} className="lg:col-span-2 space-y-6">
                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 shadow-2xl space-y-5">

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Título del Artículo</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium text-lg placeholder-gray-600"
                                placeholder="Ej: Los beneficios del Fartlek en tu entrenamiento..."
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

                            <div className="flex flex-col gap-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Portada (Hero Image)</label>
                                {imageURL ? (
                                    <div className="relative w-full h-32 rounded-xl overflow-hidden group border border-white/10">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${imageURL})` }}
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => setImageURL("")}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <CldUploadWidget
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_BLOG || "cdo-hero-blog"}
                                        onSuccess={(result: any) => {
                                            if (result?.info?.secure_url) {
                                                setImageURL(result.info.secure_url);
                                            }
                                        }}
                                        options={{
                                            multiple: false,
                                            maxFiles: 1,
                                            sources: ['local', 'url'],
                                            clientAllowedFormats: ['image'],
                                            maxImageFileSize: 10000000, // 10MB limit
                                            language: "es"
                                        }}
                                    >
                                        {({ open }) => (
                                            <button
                                                type="button"
                                                onClick={() => open()}
                                                className="w-full h-32 bg-background-dark border-2 border-dashed border-white/20 hover:border-primary/50 text-gray-400 hover:text-white rounded-xl flex flex-col items-center justify-center transition-colors gap-2 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                                                <span className="text-sm font-medium">Subir Imagen de Portada</span>
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Desarrollo del Contenido</label>
                            <div className="bg-white text-black rounded-xl overflow-hidden [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-base [&_.ql-editor]:font-sans [&_.ql-editor_p]:mb-4">
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link'],
                                            ['clean']
                                        ],
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-right">{content.length} caracteres</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-4 bg-primary text-black font-black uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    Publicando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">send</span>
                                    Publicar Artículo
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
                            Vista Previa Rápida
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
                                        {title || "Título del Artículo de Prueba"}
                                    </h4>
                                </div>
                            </div>

                            {/* Content Preview */}
                            <div className="p-4 bg-white/5">
                                <div
                                    className="text-gray-300 text-sm leading-relaxed max-h-48 overflow-y-auto prose prose-sm prose-invert"
                                    dangerouslySetInnerHTML={{ __html: content || "<p>El contenido de tu artículo comenzará a aparecer aquí de forma enriquecida...</p>" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRoleProtection(AdminBlogCMS, ["admin"]);
