import { Mood } from "@/apis/mood-tracker/interfaces";
import ChartComponent from "@/components/home/Chart.component";
import ModalFormComponent from "@/components/home/MoodForm.component";
import MoodListComponent from "@/components/home/MoodList.component";
import ProtectedRoute from "@/components/shared/ProtectedRoute.component";
import { AuthContext } from "@/context/Auth.context";
import { ThemeContext } from "@/context/Theme.context";
import { useAdvice } from "@/hooks/useAdvice.hook";
import { useMood } from "@/hooks/useMood.hook";
import { moodToImage, moodToText, sleepToText } from "@/utils/mood";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {

    const { authState, getUserInfo } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );

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
        if( !authState.userData && !authState.isLoadingAuthState ) {
            getUserInfo();
        }
        getMoods();
        getAdvice();
    }, [])

    const currentDate = new Date();

    const handleCreateMood = (mood: Mood) => {
        createMood(mood);
        getAdvice();
    }

    const handleRefresh = async() => {
        setisRefreshing(true);
        await getMoods();
        await getAdvice();
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
            style={{
                paddingHorizontal: 25
            }}
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
                className="text-center text-3xl mt-10 mb-7 font-[Montserrat-bold]"
                style={{
                    color: theme.colors.primary
                }}
            >
                Hello, { authState.userData?.name || 'User' }!
            </Text>
            <Text
                className="text-center text-4xl font-[Montserrat-bold]"
                style={{
                    color: theme.colors.primary
                }}
            >
                How are you feeling today?
            </Text>
            <Text
                className="text-center text-xl text-[#716f85] font-[Montserrat-thin] mt-8"
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
                                className="py-6 px-12 rounded-md"
                                style={{
                                    backgroundColor: theme.colors.notification
                                }}
                                onPress={() => setIsModalOpen(true)}
                            >
                                <Text
                                    className=" font-[Montserrat-bold] text-xl"
                                    style={{
                                        color: (theme.dark) ? theme.colors.primary : 'white'
                                    }}
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
                            className="flex flex-row py-4 px-4 mt-20 rounded-xl"
                            style={{
                                backgroundColor: theme.colors.card
                            }}
                        >
                            <View
                                style={{
                                    minHeight: 150
                                }}
                                className="flex flex-col flex-1"
                            >
                                <Text
                                    className="font-[Montserrat-regular] text-xl mb-2"
                                    style={{
                                        color: theme.colors.text
                                    }}
                                >
                                    I'm feeling
                                </Text>
                                <Text
                                    className="font-[Montserrat-bold] text-3xl flex-1"
                                    style={{
                                        color: theme.colors.primary
                                    }}
                                >
                                    { moodToText(todaysMood.mood) }
                                </Text>
                                <Text
                                    className="font-[Montserrat-regular] text-sm mt-6"
                                    style={{
                                        color: theme.colors.primary
                                    }}
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
                            className="flex flex-col py-4 px-4 mt-4 rounded-xl"
                            style={{
                                backgroundColor: theme.colors.card
                            }}
                        >
                            <View
                                className="flex flex-row items-center gap-4"
                            >
                                <Ionicons name="bed-outline" color={theme.colors.primary} size={20} />
                                <Text
                                    className=" font-[Montserrat-regular] text-xl"
                                    style={{
                                        color: theme.colors.primary
                                    }}
                                >
                                    Sleep
                                </Text>
                            </View>
                            <Text
                                className=" font-[Montserrat-bold] text-3xl mt-2"
                                style={{
                                    color: theme.colors.primary
                                }}
                            >
                                { sleepToText(todaysMood.sleep) } hours
                            </Text>
                        </View>
                        <View
                            className="flex flex-col py-4 px-4 mt-4 rounded-xl"
                            style={{
                                backgroundColor: theme.colors.card
                            }}
                        >
                            <View
                                className="flex flex-row items-center gap-4"
                            >
                                <Ionicons name="cloud-outline" color={ theme.colors.primary } size={20} />
                                <Text
                                    className=" font-[Montserrat-regular] text-xl"
                                    style={{
                                        color: theme.colors.primary
                                    }}
                                >
                                    Reflection
                                </Text>
                            </View>
                            <Text
                                className=" font-[Montserrat-regular] text-sm mt-8"
                                style={{
                                    color: theme.colors.text
                                }}
                            >
                                { todaysMood.reflection || "No reflection this day" }
                            </Text>
                        </View>
                    </>
                )
            }
            {
                (moodsList.length != 0) && (
                    <View
                        className="flex flex-col py-4 px-4 mt-4 rounded-xl"
                        style={{
                            backgroundColor: theme.colors.card
                        }}
                    >
                        <View
                            className="flex flex-row items-center gap-2"
                        >
                            <Text
                                className=" font-[Montserrat-bold] text-xl"
                                style={{
                                    color: theme.colors.primary
                                }}
                            >
                                Average mood
                            </Text>
                            <Text
                                className=" font-[Montserrat-regular] text-sm"
                                style={{
                                    color: theme.colors.text
                                }}
                            >
                                (Last { moodsList.length } check-ins)
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setIsMoodsModalOpen(true)}   
                            className="flex flex-col py-8 px-5 mt-2 rounded-xl"
                            style={{
                                backgroundColor: (theme.dark) ? '#6e6e99' : '#89ccff'
                            }}
                        >
                            <View
                                className="flex flex-row items-center"
                            >
                                <Text
                                    className="flex-1 text-2xl  font-[Montserrat-bold] mb-4"
                                    style={{
                                        color: theme.colors.primary
                                    }}
                                >
                                    { moodToText(averageMood || '') }
                                </Text>
                                <Ionicons 
                                    name="information-circle-outline"
                                    color={theme.colors.primary}
                                    size={20}
                                />
                            </View>
                            <View
                                className="flex flex-row items-center gap-2"
                            >
                                <Ionicons 
                                    name="arrow-forward-outline" 
                                    color={theme.colors.primary}
                                    size={10}
                                />
                                <Text
                                    className=" font-[Montserrat-regular] text-sm text-wrap"
                                    style={{
                                        color: theme.colors.primary
                                    }}
                                >
                                    Predominant mood from the past { moodsList.length } check-ins
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View
                            className="flex flex-row items-center gap-2 mt-5"
                        >
                            <Text
                                className=" font-[Montserrat-bold] text-xl"
                                style={{
                                    color: theme.colors.primary
                                }}
                            >
                                Average sleep
                            </Text>
                            <Text
                                className=" font-[Montserrat-regular] text-sm"
                                style={{
                                    color: theme.colors.text
                                }}
                            >
                                (Last { moodsList.length } check-ins)
                            </Text>
                        </View>
                        <View   
                            className="flex flex-col py-8 px-5 bg-[#6e6e99] mt-2 rounded-xl"
                            style={{
                                backgroundColor: (theme.dark) ? '#6e6e99' : '#4865db'
                            }}
                        >
                            <Text
                                className="text-2xl  font-[Montserrat-bold] mb-4"
                                style={{
                                    color: (theme.dark ? theme.colors.primary : 'white')
                                }}
                            >
                                { sleepToText(averageSleepSchedule || '') } hours
                            </Text>
                            <View
                                className="flex flex-row items-center gap-2"
                            >
                                <Ionicons 
                                    name="arrow-forward-outline" 
                                    color={(theme.dark ? theme.colors.primary : 'white')}
                                    size={10}
                                />
                                <Text
                                    className=" font-[Montserrat-regular] text-sm text-wrap"
                                    style={{
                                        color: (theme.dark ? theme.colors.primary : 'white')
                                    }}
                                >
                                    Predominant sleep schedule from the past { moodsList.length } check-ins
                                </Text>
                            </View>
                        </View>
                    </View>
                )
            }
            {
                (!isModalOpen && !isMoodsModalOpen && moodsList.length > 0) && (
                    <ChartComponent 
                        data={ moodsList }
                    />
                )
            }
            <View
                className="flex flex-row justify-center my-8"
            >
                <Text
                    className=" font-[Montserrat-thin] text-sm"
                    style={{
                        color: theme.colors.primary
                    }}
                >
                    Developed by Jesús Puentes
                </Text>
            </View>
        </ScrollView>
    </ProtectedRoute>
  );
}
