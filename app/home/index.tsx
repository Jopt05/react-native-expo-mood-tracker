import { Mood } from "@/apis/mood-tracker/interfaces";
import ChartComponent from "@/components/home/Chart.component";
import ModalFormComponent from "@/components/home/MoodForm.component";
import MoodListComponent from "@/components/home/MoodList.component";
import ProtectedRoute from "@/components/shared/ProtectedRoute.component";
import { AuthContext } from "@/context/Auth.context";
import { useAdvice } from "@/hooks/useAdvice.hook";
import { useMood } from "@/hooks/useMood.hook";
import { moodToImage, moodToText, sleepToText } from "@/utils/mood";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {

    const { authState, validateAuth } = useContext( AuthContext );

    const { 
        moodsList, 
        todaysMood, 
        averageMood, 
        averageSleepSchedule, 
        getMoods, 
        createMood 
    } = useMood();

    const { getAdvice, advice } = useAdvice();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMoodsModalOpen, setIsMoodsModalOpen] = useState(false);
    const [isRefreshing, setisRefreshing] = useState(false);

    useEffect(() => {
        if( authState.userData ) return; 
        validateAuth();
        getMoods()
        getAdvice();
    }, [authState.isLoggedIn])

    const currentDate = new Date();

    const handleCreateMood = (mood: Mood) => {
        createMood(mood);
    }

    const handleRefresh = async() => {
        setisRefreshing(true);
        await getMoods();
        setisRefreshing(false);
    }
    

  return (
    <ProtectedRoute>
        <ScrollView
            refreshControl={
                <RefreshControl 
                    onRefresh={ handleRefresh }
                    refreshing={ isRefreshing }
                />
            }
        >
            <ModalFormComponent 
                onClose={() => setIsModalOpen(!isModalOpen)}
                visible={isModalOpen}
                onCreate={(newMood) => handleCreateMood(newMood)}
            />
            <MoodListComponent 
                onClose={() => setIsMoodsModalOpen(!isMoodsModalOpen)}
                visible={isMoodsModalOpen}
            />
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
            {
                (!todaysMood) && (
                    <>
                        <View
                            className="flex flex-row justify-center mt-14"
                        >
                            <TouchableOpacity
                                className="bg-[#505194] py-6 px-12 rounded-md"
                                onPress={() => setIsModalOpen(true)}
                            >
                                <Text
                                    className="text-[#f5f5ff] font-[Montserrat-bold] text-xl"
                                >
                                    Log today's mood
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )
            }
            {
                (todaysMood) && (
                    <>
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
                                    { moodToText(todaysMood.mood) }
                                </Text>
                                <Text
                                    className="text-[#f5f5ff] font-[Montserrat-regular] text-sm mt-6"
                                >
                                    "{advice}"
                                </Text>
                            </View>
                            <View
                                className="flex flex-row flex-1 items-end justify-end"
                            >
                                <Image
                                    className=""
                                    source={ moodToImage(todaysMood.mood) }
                                />
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
                                { sleepToText(todaysMood.sleep) } hours
                            </Text>
                        </View>
                        <View
                            className="flex flex-col py-4 px-4 mt-4 bg-[#44446f] rounded-xl"
                        >
                            <View
                                className="flex flex-row items-center gap-4"
                            >
                                <Ionicons name="cloud-outline" color="#f5f5ff" size={20} />
                                <Text
                                    className="text-[#f5f5ff] font-[Montserrat-regular] text-xl"
                                >
                                    Reflection
                                </Text>
                            </View>
                            <Text
                                className="text-[#f5f5ff] font-[Montserrat-regular] text-sm mt-8"
                            >
                                { todaysMood.reflection || "No reflection this day" }
                            </Text>
                        </View>
                    </>
                )
            }
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
                        (Last { moodsList.length } check-ins)
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => setIsMoodsModalOpen(true)}   
                    className="flex flex-col py-8 px-5 bg-[#6e6e99] mt-2 rounded-xl"
                >
                    <View
                        className="flex flex-row items-center"
                    >
                        <Text
                            className="flex-1 text-2xl text-[#f5f5ff] font-[Montserrat-bold] mb-4"
                        >
                            { moodToText(averageMood || '') }
                        </Text>
                        <Ionicons 
                            name="information-circle-outline"
                            color="#f5f5ff"
                            size={20}
                        />
                    </View>
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
                            Predominant mood from the past { moodsList.length } check-ins
                        </Text>
                    </View>
                </TouchableOpacity>
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
                        (Last { moodsList.length } check-ins)
                    </Text>
                </View>
                <View   
                    className="flex flex-col py-8 px-5 bg-[#6e6e99] mt-2 rounded-xl"
                >
                    <Text
                        className="text-2xl text-[#f5f5ff] font-[Montserrat-bold] mb-4"
                    >
                        { sleepToText(averageSleepSchedule || '') } hours
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
                            Predominant sleep schedule from the past { moodsList.length } check-ins
                        </Text>
                    </View>
                </View>
            </View>
            {
                (!isModalOpen && !isMoodsModalOpen) && (
                    <ChartComponent 
                        data={ moodsList }
                    />
                )
            }
            <View
                className="flex flex-row justify-center my-8"
            >
                <Text
                    className="text-[#f5f5ff] font-[Montserrat-thin] text-sm"
                >
                    Developed by Jesús Puentes
                </Text>
            </View>
        </ScrollView>
    </ProtectedRoute>
  );
}
