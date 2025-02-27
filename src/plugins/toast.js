import { useToast } from "vue-toastification";

export default function showToast(type, message) {
    const toast = useToast();

    switch (type) {
        case "success":
            toast.success(message);
            break;
        case "error":
            toast.error(message);
            break;
        case "info":
            toast.info(message);
            break;
        case "warning":
            toast.warning(message);
            break;
        default:
            toast(message);
            break;
    }
}
