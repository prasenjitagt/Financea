import { toast } from "sonner";


export function showToast(message: string) {
    toast(message, {
        duration: 2000,

        style: {
            borderRadius: "8px",
            background: "#fff",
            color: "#333",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            fontSize: "17px",

        },

    });
}