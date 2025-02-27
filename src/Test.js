import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { postData } from "./services/api"; 
import Progress from "./components/progress";

const socket = io("http://localhost:3002");

export default function VmCreator() {
    const [progress, setProgress] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleProgress = (message) => {
            setProgress(message);

            // Si "Configuration terminée" est reçu, cacher après 3 secondes
            if (message.toLowerCase().includes("configuration terminée")) {
                setTimeout(() => setProgress(""), 1000);
            }
        };

        socket.on("progress", handleProgress);

        return () => {
            socket.off("progress", handleProgress);
        };
    }, []);

    const handleCreateVm = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await postData("api/test", { os: "Ubuntu", user: "testUser" }, null, null, { "socket-id": socket.id });
        } catch (error) {
            console.error("Erreur lors de la création de la VM", error);
            setError("Erreur lors de la création de la VM : " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="vm-creator">
            <button onClick={handleCreateVm} disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer une VM"}
            </button>
            {error && <p className="error-message">{error}</p>}
            {progress && <Progress progress={progress} />} 
        </div>
    );
}
