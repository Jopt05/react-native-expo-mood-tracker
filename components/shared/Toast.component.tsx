import { ThemeContext } from "@/context/Theme.context";
import { useContext } from "react";
import { Animated, Text, View } from "react-native";

export interface ToastOptions {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

interface ToastComponentProps {
  toast: ToastOptions;
  translateY: Animated.Value;
  opacity: Animated.Value;
}

export default function ToastComponent({ toast, translateY, opacity }: ToastComponentProps) {
  const { theme } = useContext(ThemeContext);

  const getAccentColor = () => {
    switch (toast.type) {
      case "success": return theme.colors.notification;
      case "error": return "#ff6b6b";
      case "info": return "#87c9fc";
      default: return theme.colors.notification;
    }
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 60,
        left: 20,
        right: 20,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderLeftWidth: 4,
          borderLeftColor: getAccentColor(),
          borderRadius: 10,
          paddingVertical: 14,
          paddingHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <Text
          className="font-[Montserrat-regular] text-base"
          style={{ color: theme.colors.primary }}
        >
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  );
}
