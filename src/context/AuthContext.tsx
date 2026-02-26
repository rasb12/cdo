"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Role, STAFF_ROLES } from "@/lib/permissions";

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    role: Role;
    isProfileComplete?: boolean;
}

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    let role: Role = "athlete";
                    let isProfileComplete = false;

                    if (userDocSnap.exists()) {
                        const data = userDocSnap.data();
                        role = (data.role as Role) || "athlete";

                        if (STAFF_ROLES.includes(role)) {
                            isProfileComplete = true;
                        } else {
                            // Athlete requirement check
                            isProfileComplete = !!(
                                data.displayName &&
                                data.phone &&
                                data.idCard &&
                                data.dob &&
                                data.bloodType &&
                                data.shirtSize
                            );
                        }
                    }

                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                        role,
                        isProfileComplete,
                    });
                } catch (error) {
                    console.error("Failed to fetch user role:", error);
                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                        role: "athlete", // Safe fallback
                        isProfileComplete: false,
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
