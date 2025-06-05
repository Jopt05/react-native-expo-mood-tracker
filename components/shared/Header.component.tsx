import { AuthContext } from "@/context/Auth.context";
import { ThemeContext } from "@/context/Theme.context";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { Image, Platform, Text, ToastAndroid, TouchableOpacity, View } from "react-native";

export default function HeaderComponent() {

  const { authState, logout, requestResetPassword } = useContext( AuthContext );
  const { theme, setDarkTheme, setLightTheme }  = useContext( ThemeContext );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetPassword = async() => {
    if (!authState.userData) return;
    const resetSuccessful = await requestResetPassword(authState.userData.email);
    if( Platform.OS === 'android' && resetSuccessful ) {
      ToastAndroid.show('Password was successfully reset', ToastAndroid.SHORT)
    }
    setIsModalOpen(false);
  }

  const handleChangeTheme = async() => {
    if( theme.dark ) {
      await setLightTheme();
    } else {
      await setDarkTheme();
    }
  }

  return (
    <View
        className="flex flex-row items-center py-4 gap-2"
        style={{
            backgroundColor: theme.colors.background
        }}
    >
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
                  onPress={() => logout()}
                >
                  <Text
                    className="font-[Montserrat-regular] text-xl text-center py-1"
                    style={{
                      color: theme.colors.primary
                    }}
                  >
                    Logout
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleResetPassword()}
                >
                  <Text
                    className="font-[Montserrat-regular] text-xl text-center py-1"
                    style={{
                      color: theme.colors.primary
                    }}
                  >
                    Reset password
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
                className="w-10 h-10"
                source={{
                  uri: "https://cdni.iconscout.com/illustration/premium/thumb/male-user-image-illustration-download-in-svg-png-gif-file-formats--person-picture-profile-business-pack-illustrations-6515860.png"
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
