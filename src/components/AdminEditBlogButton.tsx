"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminEditBlogButton({ postId }: { postId: string }) {
    const { user, loading } = useAuth();

    // Only render for admins
    if (loading || user?.role !== "admin") return null;

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up">
            <Link
                href={`/dashboard/admin/blog/edit/${postId}`}
                className="flex items-center gap-2 bg-white text-black font-black uppercase tracking-widest px-6 py-4 rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform hover:bg-gray-200"
            >
                <span className="material-symbols-outlined">edit_document</span>
                Editar Artículo
            </Link>
        </div>
    );
}
