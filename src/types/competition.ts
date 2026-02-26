import { Timestamp } from "firebase/firestore";

export interface Competition {
    id?: string;
    name: string;
    date: string; // Format: YYYY-MM-DD
    location: string;
    distances: string[]; // e.g. ["5K", "10K", "21K"]
    registrationUrl?: string; // Optional link to registration
    createdAt?: Timestamp;
}
