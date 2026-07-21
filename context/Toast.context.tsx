import ToastComponent, { ToastOptions } from "@/components/shared/Toast.component";
import { createContext, useCallback, useRef, useState } from "react";
import { Animated } from "react-native";

interface ToastContextProps {
  showToast: (options: ToastOptions) => void;
}

export const ToastContext = createContext({} as ToastContextProps);

export const ToastProvider = ({ children }: any) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setToast(options);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const duration = options.duration || 2500;
    timeoutRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setToast(null));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <ToastComponent toast={toast} translateY={translateY} opacity={opacity} />
      )}
    </ToastContext.Provider>
  );
};
