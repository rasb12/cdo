"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withRoleProtection(WrappedComponent: React.ComponentType, allowedRoles: ("admin" | "athlete")[]) {
    return function ProtectedRoute(props: any) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading) {
                if (!user) {
                    // Not logged in
                    router.push("/login"); // Redirect to login
                } else if (!allowedRoles.includes(user.role)) {
                    // Logged in but unauthorized for this route
                    if (user.role === "admin") {
                        router.push("/dashboard/admin");
                    } else {
                        router.push("/dashboard/athlete");
                    }
                }
            }
        }, [user, loading, router]);

        // Show loading state while checking auth
        if (loading || !user || !allowedRoles.includes(user.role)) {
            return (
                <div className="flex-1 min-h-screen flex items-center justify-center bg-background-dark">
                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
}
