import HeaderComponent from "@/components/shared/Header.component";
import { AuthProvider } from "@/context/Auth.context";
import { ThemeContext, ThemeProvider } from "@/context/Theme.context";
import { Stack } from "expo-router";
import { useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../../global.css";

const AppState = ({children}: any) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}

// Esto asegura que los contextos estén disponibles
export default function Root() {
  return (
    <AppState>
      <RootLayout />
    </AppState>
  );
}

const RootLayout = () => {

  const safeArea = useSafeAreaInsets();
  const { theme } = useContext(ThemeContext); // Ahora sí está dentro del provider

  return (
    <Stack 
      screenOptions={{
        headerShown: true,
        header(props) {
            return <HeaderComponent />
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
          paddingTop: safeArea.top,
          paddingBottom: safeArea.bottom
        },
        statusBarStyle: (theme.dark) ? 'light' : 'dark',
        statusBarTranslucent: true
      }}
    >
      <Stack.Screen 
        name="home/index"
      />
      <Stack.Screen 
        name="login/index"
      />
      <Stack.Screen 
        name="profile/index"
      />
      <Stack.Screen 
        name="reset-password/index"
      />
      <Stack.Screen 
        name="camera/index"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}