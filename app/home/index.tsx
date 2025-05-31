import { GetMoodsResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import ModalFormComponent from "@/components/home/MoodForm.component";
import MoodListComponent from "@/components/home/MoodList.component";
import ProtectedRoute from "@/components/shared/ProtectedRoute.component";
import { AuthContext } from "@/context/Auth.context";
import { moodToImage, moodToText, sleepToText } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {

    const { authState } = useContext( AuthContext );

    const [moodData, setMoodData] = useState<{moods: Mood[], isLoading: boolean}>({
        moods: [],
        isLoading: false
    });
    const [todaysMood, setTodaysMood] = useState<Mood>();
    const [averageMood, setAverageMood] = useState<string>();
    const [averageSleepSchedule, setAverageSleepSchedule] = useState<string>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMoodsModalOpen, setIsMoodsModalOpen] = useState(false);
    const [isRefreshing, setisRefreshing] = useState(false);

    useEffect(() => {
        if( !authState.isLoggedIn ) return; 
        getMoods()
    }, [])

    useEffect(() => {
        if( isRefreshing ) {
            setisRefreshing(false);
        }
    }, [moodData])

    const currentDate = new Date();

    const getMoods = async() => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if( !token ) return; 
            const { data } = await moodTrackedApi.get<GetMoodsResponse>('/moods', { headers: { Authorization: `Bearer ${token}` }});
            setMoodData({
                moods: data.payload.mood,
                isLoading: false
            })
            getTodaysMood(data.payload.mood);
            getMostRepeatedMood(data.payload.mood)
            getMostRepeatedSleep(data.payload.mood)
        } catch (error) {
            console.log('Error al obtener moods')
            console.log(error)
            setMoodData({
                moods: [],
                isLoading: false
            })
        }
    }

    const getTodaysMood = (moodList: Mood[]) => {
        const currentDate = new Date().toLocaleDateString();
        const todaysMood = moodList.find( m => new Date(m.createdAt).toLocaleDateString() == currentDate );
        if( todaysMood ) {
            setTodaysMood(todaysMood);
            return
        }
    }

    const getMostRepeatedMood = (moodList: Mood[]) => {
        if( moodList.length === 0 ) return;
        const moodCount = moodList.reduce((acc: any, mood: Mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
        }, {});
        const mostRepeatedMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);
        setAverageMood(mostRepeatedMood);
    }

    const getMostRepeatedSleep = (moodList: Mood[]) => {
        if( moodList.length === 0 ) return;
        const sleepCount = moodList.reduce((acc: any, mood: Mood) => {
        acc[mood.sleep] = (acc[mood.sleep] || 0) + 1;
        return acc;
        }, {});
        const mostRepeatedSleep = Object.keys(sleepCount).reduce((a, b) => sleepCount[a] > sleepCount[b] ? a : b);
        setAverageSleepSchedule(mostRepeatedSleep);
    }

    const handleCreateMood = (mood: Mood) => {
        setMoodData({
            moods: [mood, ...moodData.moods],
            isLoading: false
        })
    }

    const handleRefresh = () => {
        setisRefreshing(true);
        getMoods();
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
                onCreate={handleCreateMood}
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
                                    className="text-[#f5f5ff] font-[Montserrat-regular] text-sm"
                                >
                                    "Lorem ipsum dolor sit amet consectetur adipisicing"
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
                        (Last { moodData.moods.length } check-ins)
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
                            Predominant mood from the past { moodData.moods.length } check-ins
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
                        (Last { moodData.moods.length } check-ins)
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
                            Predominant sleep schedule from the past { moodData.moods.length } check-ins
                        </Text>
                    </View>
                </View>
            </View>
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
