import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Competition } from "@/types/competition";

const seedData: Omit<Competition, "id" | "createdAt">[] = [
    {
        name: "OPTICOLOR 10K",
        date: "2025-02-02",
        location: "Maracaibo, Zulia",
        distances: ["10K"],
    },
    {
        name: "Carrera 10K Ciudad de Punto Fijo",
        date: "2025-03-09",
        location: "Punto Fijo, Falcón",
        distances: ["10K"],
    },
    {
        name: "Carrera NARANJA",
        date: "2025-03-22",
        location: "Universidad Metropolitana, Caracas",
        distances: ["5K", "10K"],
    },
    {
        name: "GOTrail Todasana",
        date: "2025-03-28",
        location: "Playa Todasana, La Guaira",
        distances: ["7K", "13K", "26K"],
    },
    {
        name: "COBECA 10K",
        date: "2025-03-30",
        location: "Maracaibo, Zulia",
        distances: ["10K"],
    },
    {
        name: "Super Super Pollo 5K",
        date: "2025-04-12",
        location: "San Antonio de Los Altos, Miranda",
        distances: ["5K"],
    },
    {
        name: "MEDIA MARATÓN DE VALENCIA (10ma edición)",
        date: "2025-05-25",
        location: "Valencia, Carabobo",
        distances: ["10K", "21K"],
    },
    {
        name: "Gatorade Caracas Rock 10K",
        date: "2025-10-05",
        location: "Caracas, Distrito Capital",
        distances: ["10K"],
    },
    {
        name: "Carrera Caminata Chinita",
        date: "2025-11-30",
        location: "Maracaibo, Zulia",
        distances: ["10K"],
    }
];

export default async function seedCompetitions() {
    try {
        const batchPromises = seedData.map(comp =>
            addDoc(collection(db, "competitions"), {
                ...comp,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            })
        );
        await Promise.all(batchPromises);
        console.log("Competitions seeded successfully!");
    } catch (error) {
        console.error("Error seeding competitions:", error);
    }
}
