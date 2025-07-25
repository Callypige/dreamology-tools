'use client';
import { useRouter } from "next/navigation";
import { HiOutlineTrash } from "react-icons/hi";

interface RemoveBtnProps {
  id: string;
  onDeleted?: () => void; 
}

export default function RemoveBtn({ id, onDeleted } : RemoveBtnProps) {
    const router = useRouter();
    
    const removeDream = async () => {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer ce rêve ?");
        
        if (confirmed) {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Corrigé le port
                const request = await fetch(`${baseUrl}/api/dreams?id=${id}`, { 
                    method: "DELETE",
                    credentials: "include", 
                });

                if (request.ok) {
                    // Appeler le callback si fourni, sinon refresh
                    if (onDeleted) {
                        onDeleted();
                    } else {
                        router.refresh();
                    }
                } else {
                    throw new Error(`HTTP error, failed to delete dream. Status: ${request.status}`);
                }
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert("Erreur lors de la suppression du rêve");
            }
        }
    }

    return (
        <button 
            onClick={removeDream} 
            className="text-red-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-400/10"
            title="Supprimer ce rêve"
        >
            <HiOutlineTrash size={24} />
        </button>
    )
}