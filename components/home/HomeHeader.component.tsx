import { AuthContext } from "@/context/Auth.context";
import { ThemeContext } from "@/context/Theme.context";
import { useContext } from "react";
import { Text } from "react-native";

export default function HomeHeaderComponent() {
  const {theme} = useContext(ThemeContext);
  const {authState} = useContext(AuthContext);

  const currentDate = new Date();

  return (
    <>
      <Text
        className="text-center text-3xl mt-10 mb-7 font-[Montserrat-bold]"
        style={{
          color: theme.colors.primary,
        }}
      >
        Hello, {authState.userData?.name || "User"}!
      </Text>
      <Text
        className="text-center text-4xl font-[Montserrat-bold]"
        style={{
          color: theme.colors.primary,
        }}
      >
        How are you feeling today?
      </Text>
      <Text className="text-center text-xl text-[#716f85] font-[Montserrat-thin] mt-8">
        {currentDate.toDateString()}
      </Text>
    </>
  );
}
