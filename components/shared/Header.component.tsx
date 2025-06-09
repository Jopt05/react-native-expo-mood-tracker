import { AuthContext } from "@/context/Auth.context";
import { ThemeContext } from "@/context/Theme.context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HeaderComponent() {

  const { authState } = useContext( AuthContext );
  const { theme, setDarkTheme, setLightTheme }  = useContext( ThemeContext );
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <View
        >
          <TouchableOpacity
            onPress={handleChangeTheme}
          >
            <Ionicons 
              name={ !theme.dark ? 'moon-outline' : "sunny-outline" }
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        <View
        >
          {
            (isModalOpen) && (    
              <View
                className="flex absolute top-5 right-0 py-2 px-4 rounded-lg z-20"
                style={{
                  backgroundColor: theme.colors.card
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    router.push('/profile');
                  }}
                >
                  <Text
                    className="font-[Montserrat-regular] text-xl text-center py-1"
                    style={{
                      color: theme.colors.primary
                    }}
                  >
                    Your profile
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }
        </View>
        {
          (authState.isLoggedIn) && (
            <TouchableOpacity
              className="flex flex-row items-center gap-2 relative"
              onPress={() => setIsModalOpen(!isModalOpen)}
            >
              <Image
                className="w-10 h-10 rounded-full"
                source={{
                  uri: (authState?.userData?.photoUrl)
                    ? authState.userData.photoUrl
                    : "https://cdni.iconscout.com/illustration/premium/thumb/male-user-image-illustration-download-in-svg-png-gif-file-formats--person-picture-profile-business-pack-illustrations-6515860.png"
                }}
              >

              </Image>
              <Ionicons 
                name="chevron-down"
                size={12}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )
        }
    </View>
  );
}
