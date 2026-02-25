import { getDocs, query, collection, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminEditBlogButton from "@/components/AdminEditBlogButton";

// Definimos la estructura del Post
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    category: string;
    imageURL: string;
    content: string;
    authorName: string;
    createdAt: any;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch individual post from Firestore
    let post: BlogPost | null = null;
    let relatedPosts: BlogPost[] = [];

    try {
        const q = query(collection(db, "blog_posts"), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            post = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as BlogPost;
        } else {
            return notFound();
        }

        // Fetch up to 3 related posts (same category, excluding current)
        const relatedQ = query(collection(db, "blog_posts"), where("category", "==", post.category), limit(4));
        const relatedSnapshot = await getDocs(relatedQ);
        relatedPosts = relatedSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
            .filter(p => p.id !== post?.id)
            .slice(0, 3); // Take 3 effectively

    } catch (error) {
        console.error("Error fetching blog post:", error);
        return notFound();
    }

    if (!post) {
        return notFound();
    }

    // Format Date
    const formattedDate = post.createdAt?.toDate ? new Intl.DateTimeFormat('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(post.createdAt.toDate()) : "Publicado recientemente";

    return (
        <div className="min-h-screen bg-background-dark pb-16 animate-fade-in">
            <AdminEditBlogButton postId={post.id} />
            {/* HERO SECTION */}
            <header
                className="relative w-full h-[60vh] min-h-[400px] flex items-end justify-center px-4 py-16"
                style={{
                    backgroundImage: `url(${post.imageURL})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay oscuro para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>

                <div className="relative z-10 max-w-4xl w-full mx-auto text-center">
                    {/* Categoría (Badge arriba) */}
                    <div className="mb-4 inline-block">
                        <span className="bg-primary px-4 py-1 text-black text-sm font-black uppercase tracking-widest rounded shadow-[0_0_15px_rgba(10,255,95,0.4)]">
                            {post.category}
                        </span>
                    </div>

                    {/* Título en el Centro */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center justify-center gap-4 text-gray-300 font-medium">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">edit_note</span>
                            {post.authorName}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                            {formattedDate}
                        </span>
                    </div>
                </div>
            </header>

            {/* CONTENT AREA */}
            <main className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
                <article className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-a:text-primary prose-img:rounded-xl md:prose-lg max-w-none break-words whitespace-pre-wrap">
                    {post.content}
                </article>
            </main>

            {/* RELATED POSTS BANNER */}
            {relatedPosts.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5">
                    <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
                        Artículos Relacionados
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((related) => (
                            <Link href={`/blog/${related.slug}`} key={related.id} className="group relative rounded-2xl overflow-hidden h-64 shadow-2xl block border border-white/5 hover:border-primary/50 transition-colors">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${related.imageURL})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent"></div>
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <span className="text-primary text-xs font-black tracking-widest uppercase mb-1">{related.category}</span>
                                    <h4 className="text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">{related.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA FOOTER (Inscripción en la escuela) */}
            <section className="max-w-4xl mx-auto px-6 mt-16">
                <div className="bg-surface-dark border border-primary/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_30px_rgba(10,255,95,0.05)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide mb-4 relative z-10">
                        ¿Listo para dominar <span className="text-primary">tu ritmo?</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                        Únete a la Escuela de Atletismo Corredores de Oriente. Planes personalizados, entrenadores profesionales y una comunidad enfocada en alcanzar el máximo nivel deportivo.
                    </p>

                    <Link href="/register" className="inline-flex items-center gap-2 bg-primary text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(10,255,95,0.3)] relative z-10">
                        Inscríbete hoy
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
