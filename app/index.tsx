import { useFonts } from "expo-font";
import { Redirect } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [loaded, error] = useFonts({
    'Montserrat-black': require('../assets/fonts/Montserrat-Black.ttf'),
    'Montserrat-bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-thin': require('../assets/fonts/Montserrat-Thin.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Redirect href="/home" />
  );
}
