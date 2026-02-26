"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "./[slug]/page";

const CATEGORIES = [
    "Todos",
    "Noticias",
    "Entrenamiento",
    "Nutrición",
    "Equipamiento",
    "Recomendaciones",
    "Recuperación"
];

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    useEffect(() => {
        const q = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
            setPosts(fetchedPosts);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching real-time blog posts:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Local client-side filtering
    const filteredPosts = selectedCategory === "Todos"
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    const allPosts = filteredPosts;

    return (
        <div className="flex-1 flex flex-col h-full bg-background-dark sm:p-6 lg:p-10 pb-16 lg:pb-24 animate-fade-in-up">
            <div className="mb-8 flex flex-col gap-2 p-4">
                <h1 className="text-4xl font-black tracking-tight text-white uppercase">
                    Noticias y Consejos
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl font-light border-l-2 border-primary pl-4 ml-1">
                    Tips de expertos sobre entrenamiento, nutrición y recuperación de
                    nuestros entrenadores para ayudarte a alcanzar tu mejor nivel.
                </p>
            </div>

            {/* LIVE FILTERS */}
            <div className="flex flex-wrap items-center gap-3 mt-2 pt-2 pb-4 mb-8 px-4 lg:px-0">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-all ${selectedCategory === cat
                            ? 'bg-primary text-black shadow-[0_0_15px_rgba(10,255,95,0.4)]'
                            : 'bg-surface-dark border border-white/10 text-gray-300 hover:border-primary/50 hover:text-primary'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border border-white/10 rounded-2xl bg-surface-dark border-dashed mx-4 lg:mx-0">
                    <span className="material-symbols-outlined text-gray-500 text-6xl mb-4 text-primary opacity-50">article</span>
                    <h3 className="text-xl font-bold text-white mb-2">Aún no hay publicaciones en {selectedCategory}</h3>
                    <p className="text-gray-400">Vuelve pronto para leer nuestros últimos consejos.</p>
                </div>
            ) : (
                <>
                    {/* POSTS GRID */}
                    {allPosts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 px-4 lg:px-0">
                            {allPosts.map((post, index) => (
                                <Link href={`/blog/${post.slug}`} key={post.id} className="flex flex-col bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border border-white/5 hover:border-primary/50">
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{
                                                backgroundImage: `url(${post.imageURL})`,
                                            }}
                                        ></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {index === 0 && (
                                                <span className="bg-primary text-black text-xs font-black px-3 py-1 rounded uppercase tracking-widest shadow-[0_0_15px_rgba(10,255,95,0.4)] z-10 w-fit flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                                                    LO MÁS RECIENTE
                                                </span>
                                            )}
                                            <span className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-xs font-black text-primary uppercase tracking-widest w-fit">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 p-6">
                                        <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                            {post.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-500 text-[18px]">edit_note</span>
                                                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                                                    {post.authorName}
                                                </span>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">
                                                arrow_outward
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* CTA FOOTER (Inscripción en la escuela) */}
            <section className="max-w-4xl mx-auto px-6 mt-16 mb-24 lg:mb-32 w-full pb-12">
                <div className="bg-surface-dark border border-primary/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_30px_rgba(10,255,95,0.05)] w-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide mb-4 relative z-10 leading-tight">
                        ¿Listo para dominar <span className="text-primary">tu ritmo?</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                        Únete a la Escuela de Atletismo Corredores de Oriente. Planes personalizados, entrenadores profesionales y una comunidad enfocada en alcanzar el máximo nivel deportivo.
                    </p>

                    <Link href="/register" className="inline-flex items-center gap-2 bg-primary text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(10,255,95,0.3)] relative z-10 w-full sm:w-auto justify-center">
                        Inscríbete
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
