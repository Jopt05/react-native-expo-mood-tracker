import { AuthContext } from "@/context/Auth.context";
import { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HeaderComponent() {

  const { authState, logout } = useContext( AuthContext );

  return (
    <View
        className="flex flex-row items-center py-4 bg-[#3a3a59]"
    >
        <Text
            className="text-[#f5f5ff] font-[Montserrat-bold] text-2xl flex-1"
        >
            Mood Tracker
        </Text>
        {
          (authState.isLoggedIn) && (
            <TouchableOpacity
              onPress={ logout }
              className="flex flex-row items-center gap-2"
            >
              <Image
                className="w-10 h-10"
                source={{
                  uri: "https://cdni.iconscout.com/illustration/premium/thumb/male-user-image-illustration-download-in-svg-png-gif-file-formats--person-picture-profile-business-pack-illustrations-6515860.png"
                }}
              >

              </Image>
              <View
                className="w-2 h-2 bg-red-500 ml-auto"
              >

              </View>
            </TouchableOpacity>
          )
        }
    </View>
  );
}
