import { AuthContext } from "@/context/Auth.context";
import { Redirect } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

    const { authState } = useContext( AuthContext );

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