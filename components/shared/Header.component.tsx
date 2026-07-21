import { AuthContext } from "@/context/Auth.context";
import { ThemeContext } from "@/context/Theme.context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HeaderComponent() {

  const { authState } = useContext( AuthContext );
  const { theme, setDarkTheme, setLightTheme }  = useContext( ThemeContext );
  const router = useRouter();

  const handleChangeTheme = async() => {
    if( theme.dark ) {
      await setLightTheme();
    } else {
      await setDarkTheme();
    }
  }

  return (
    <View
        className="flex flex-row items-center py-4 gap-2 px-[25]"
        style={{
            backgroundColor: theme.colors.background
        }}
    >
        {
          (router.canGoBack()) && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-2"
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )
        }
        <Text
            className="font-[Montserrat-bold] text-2xl flex-1"
            style={{
                color: theme.colors.primary
            }}
        >
            Mood Tracker
        </Text>
        <TouchableOpacity
          onPress={handleChangeTheme}
        >
          <Ionicons 
            name={ !theme.dark ? 'moon-outline' : "sunny-outline" }
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        {
          (authState.isLoggedIn) && (
            <TouchableOpacity
              className="flex flex-row items-center"
              onPress={() => router.push('/profile')}
            >
              <View
                className="rounded-full p-[2px]"
                style={{
                  borderWidth: 2,
                  borderColor: theme.colors.notification,
                }}
              >
                <Image
                  className="w-9 h-9 rounded-full"
                  source={{
                    uri: (authState?.userData?.photoUrl)
                      ? authState.userData.photoUrl
                      : "https://cdni.iconscout.com/illustration/premium/thumb/male-user-image-illustration-download-in-svg-png-gif-file-formats--person-picture-profile-business-pack-illustrations-6515860.png"
                  }}
                />
              </View>
            </TouchableOpacity>
          )
        }
    </View>
  );
}
