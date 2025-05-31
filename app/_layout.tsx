import HeaderComponent from "@/components/shared/Header.component";
import { AuthProvider } from "@/context/Auth.context";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {

  const safeArea = useSafeAreaInsets();

  return (
    <AppState>
      <Stack 
        screenOptions={{
          headerShown: true,
          header(props) {
              return <HeaderComponent />
          },
          contentStyle: {
            paddingHorizontal: 25,
            backgroundColor: "#3a3a59",
            paddingTop: safeArea.top,
            paddingBottom: safeArea.bottom
          },
          statusBarStyle: "dark",
          statusBarTranslucent: true
        }}
      />
    </AppState>
  );
}

const AppState = ({children}: any) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}