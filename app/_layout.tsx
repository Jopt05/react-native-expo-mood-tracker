import { Slot } from "expo-router";
import "../global.css";

// Esto asegura que los contextos estén disponibles
export default function Root() {
  return (
    <Slot />
  );
}