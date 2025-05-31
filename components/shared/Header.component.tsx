import { AuthContext } from "@/context/Auth.context";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HeaderComponent() {

  const { authState, logout } = useContext( AuthContext );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View
        className="flex flex-row items-center py-4 bg-[#3a3a59]"
    >
        <Text
            className="text-[#f5f5ff] font-[Montserrat-bold] text-2xl flex-1"
        >
            Mood Tracker
        </Text>
        <View
        >
          {
            (isModalOpen) && (    
              <View
                className="absolute top-5 right-0 bg-[#44446f] py-2 px-4 rounded-lg z-20"
              >
                <TouchableOpacity
                  onPress={() => logout()}
                >
                  <Text
                    className="text-[#f5f5ff] font-[Montserrat-regular] text-xl"
                  >
                    Logout
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
                color={'#f5f5ff'}
              />
            </TouchableOpacity>
          )
        }
    </View>
  );
}
