import { toast, ToastOptions, ToastContainer } from "react-toastify";


type ToastType = "success" | "error" | "warn" | "info";

const defaultOptions: ToastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    closeButton: false,
    icon: false,
    className: "text-white text-xs py-2 px-2 min-h-[40px] w-[200px] justify-center rounded-md",
};

const typeClasses: Record<ToastType, string> = {
    success: "bg-green-500",
    error: "bg-red-500",
    warn: "bg-yellow-400",
    info: "bg-blue-500",
};

export const notify = (message: string, type: ToastType = "info") => {
    toast(message, {
        ...defaultOptions,
        className: `${defaultOptions.className} ${typeClasses[type]}`,
    });
};

// This is optional: add this once at root of your app
export const ToastWrapper = () => <ToastContainer />;