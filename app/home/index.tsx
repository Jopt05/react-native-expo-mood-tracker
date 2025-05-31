import { AuthContext } from "@/context/Auth.context";
import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useContext, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {

    const { authState, getCurrentUser } = useContext( AuthContext );

    if( !authState.isLoggedIn ) return <Redirect href="/login" />

    const currentDate = new Date();

    useEffect(() => {
        getCurrentUser()
    }, [])

  return (
    <ScrollView
    >
        <Text
            className="text-center text-3xl mt-10 mb-7 text-[#f5f5ff] font-[Montserrat-bold]"
        >
            Hello, { authState.userData?.name || 'User' }!
        </Text>
        <Text
            className="text-center text-4xl text-[#f5f5ff] font-[Montserrat-bold]"
        >
            How are you feeling today?
        </Text>
        <Text
            className="text-center text-xl text-[#d1cfe0] font-[Montserrat-thin] mt-8"
        >
            { currentDate.toDateString() }
        </Text>
        <View
            className="flex flex-row justify-center mt-14"
        >
            <TouchableOpacity
                className="bg-[#505194] py-6 px-12 rounded-md"
            >
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-bold] text-xl"
                >
                    Log today's mood
                </Text>
            </TouchableOpacity>
        </View>
        <View
            className="flex flex-row py-4 px-4 mt-20 bg-[#44446f] rounded-xl"
        >
            <View
                style={{
                    minHeight: 150
                }}
                className="flex flex-col flex-1"
            >
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-regular] text-xl mb-2"
                >
                    I'm feeling
                </Text>
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-bold] text-3xl flex-1"
                >
                    Very happy
                </Text>
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-regular] text-sm"
                >
                    "Lorem ipsum dolor sit amet consectetur adipisicing"
                </Text>
            </View>
            <View
                className="bg-red-400 flex flex-row flex-1"
            >

            </View>
        </View>
        <View
            className="flex flex-col py-4 px-4 mt-4 bg-[#44446f] rounded-xl"
        >
            <View
                className="flex flex-row items-center gap-4"
            >
                <Ionicons name="bed-outline" color="#f5f5ff" size={20} />
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-regular] text-xl"
                >
                    Sleep
                </Text>
            </View>
            <Text
                className="text-[#f5f5ff] font-[Montserrat-bold] text-3xl mt-2"
            >
                +9 hours
            </Text>
        </View>
        <View
            className="flex flex-col py-4 px-4 mt-4 bg-[#44446f] rounded-xl"
        >
            <View
                className="flex flex-row items-center gap-2"
            >
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-bold] text-xl"
                >
                    Average mood
                </Text>
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-regular] text-sm"
                >
                    (Last 5 check-ins)
                </Text>
            </View>
            <View   
                className="flex flex-col py-8 px-5 bg-[#6e6e99] mt-2 rounded-xl"
            >
                <Text
                    className="text-2xl text-[#f5f5ff] font-[Montserrat-bold] mb-4"
                >
                    Very happy
                </Text>
                <View
                    className="flex flex-row items-center gap-2"
                >
                    <Ionicons 
                        name="arrow-forward-outline" 
                        color="#f5f5ff"
                        size={10}
                    />
                    <Text
                        className="text-[#f5f5ff] font-[Montserrat-regular] text-sm text-wrap"
                    >
                        Predominant mood from the past N check-ins
                    </Text>
                </View>
            </View>
            <View
                className="flex flex-row items-center gap-2 mt-5"
            >
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-bold] text-xl"
                >
                    Average sleep
                </Text>
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-regular] text-sm"
                >
                    (Last 5 check-ins)
                </Text>
            </View>
            <View   
                className="flex flex-col py-8 px-5 bg-[#6e6e99] mt-2 rounded-xl"
            >
                <Text
                    className="text-2xl text-[#f5f5ff] font-[Montserrat-bold] mb-4"
                >
                    Very happy
                </Text>
                <View
                    className="flex flex-row items-center gap-2"
                >
                    <Ionicons 
                        name="arrow-forward-outline" 
                        color="#f5f5ff"
                        size={10}
                    />
                    <Text
                        className="text-[#f5f5ff] font-[Montserrat-regular] text-sm text-wrap"
                    >
                        Predominant mood from the past N check-ins
                    </Text>
                </View>
            </View>
        </View>
    </ScrollView>
  );
}
