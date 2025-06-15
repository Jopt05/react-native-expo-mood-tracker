import { AuthContext } from "@/context/Auth.context";
import { Redirect } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { ActivityIndicator, AppState, View } from "react-native";


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

  const { authState, getUserInfo } = useContext( AuthContext );
  const appState = useRef(AppState.currentState);

  useEffect(() => {
     const subscription = AppState.addEventListener("change", nextAppState => {
      console.log("App State changed to", nextAppState);
      appState.current = nextAppState;
      if( nextAppState == 'active' ) {
        getUserInfo();
      }
      console.log(authState)
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (authState.isLoadingAuthState) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if ( !authState.isLoggedIn ) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}