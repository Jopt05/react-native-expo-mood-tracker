import { ToastContext } from "@/context/Toast.context";
import { useContext } from "react";

export const useToast = () => {
  const { showToast } = useContext(ToastContext);
  return { showToast };
};
