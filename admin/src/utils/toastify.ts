import { toast, Flip, type ToastOptions } from "react-toastify";

export type ToastType = "success" | "error" | "info" | "warning";

export const myToast = (message: string, msgType: ToastType) => {
  let config: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Flip,
  };
  toast[msgType](message, config);
};
