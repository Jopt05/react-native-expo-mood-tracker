import { GetMoodsResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { ThemeContext } from "@/context/Theme.context";
import { moodToImage, sleepToText } from "@/utils/mood";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalComponentProps {
    visible: boolean;
    onClose: () => void;
}

export default function MoodListComponent(props: ModalComponentProps) {

    const { theme } = useContext( ThemeContext );

    const [moodsList, setMoodsList] = useState<Mood[]>([]);
    const [pagingData, setPagingData] = useState({
        isLoading: true,
        page: 1,
        total: 0
    })

    useEffect(() => {
        if( !props.visible ) return; 
        getMoods()
    }, [props.visible])
    
    const getMoods = async(page = 1) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if( !token ) return;
            const { data } = await moodTrackedApi.get<GetMoodsResponse>(`/moods?page=${page}`, { headers: { Authorization: `Bearer ${token}`} });
            setMoodsList([...moodsList, ...data.payload.mood]);
            setPagingData({
                isLoading: false,
                page: data.payload.page,
                total: data.payload.total
            })
        } catch (error) {
            console.log('Ocurrió un error al obtener moods')
            console.log(error)
            setPagingData({
                ...pagingData,
                isLoading: false
            })
        }
    }

    const handleEndReached = async() => {
        if( pagingData.isLoading ) return
        if( moodsList.length >= pagingData.total ) return;
        setPagingData({
            ...pagingData,
            isLoading: true,
            page: pagingData.page + 1
        });
        await getMoods(pagingData.page + 1)
    }

    const handleClose = async() => {
        setMoodsList([]);
        setPagingData({
            isLoading: true,
            page: 1,
            total: 0
        })
        props.onClose();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => handleClose()}
        >
            <View
                className="flex flex-1 relative justify-center items-center z-20"
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: 20
                    }}
                    onPress={() => handleClose()}
                ></TouchableOpacity>
                <View
                    style={{
                        width: '90%',
                        maxHeight: 450,
                        backgroundColor: theme.colors.background
                    }}
                    className="flex flex-col rounded-xl py-4 px-4 z-30"
                >
                    <Text
                        className="font-[Montserrat-bold] text-3xl text-center"
                        style={{
                            color: theme.colors.primary
                        }}
                    >
                        Your previous check ins
                    </Text>
                    <FlatList 
                        data={ moodsList }
                        onEndReached={ () => {
                            handleEndReached()
                        }}
                        onEndReachedThreshold={ 0.5 }
                        ListFooterComponent={() => (
                                <>
                                {
                                    (pagingData.isLoading) && (
                                        <ActivityIndicator 
                                            className="mt-2"
                                            size="large"
                                        />
                                    )
                                }
                                {
                                    (!pagingData.isLoading && moodsList.length == pagingData.total) && (
                                    <Text
                                        className="font-[Montserrat-regular] text-center mt-2"
                                        style={{
                                            color: theme.colors.primary
                                        }}
                                    >
                                        No more moods to show
                                    </Text>
                                )
                                }
                                </>
                        )}  
                        renderItem={({item}) => {
                                return (
                                    <View
                                        className="flex flex-col px-4 py-4 mt-2"
                                        style={{
                                            backgroundColor: theme.colors.card,
                                            borderRadius: 10
                                        }}
                                    >
                                        <Text
                                            className="font-[Montserrat-regular] text-lg"
                                            style={{
                                                color: theme.colors.primary
                                            }}
                                        >
                                            { new Date(item.createdAt).toDateString() }
                                        </Text>
                                        <View
                                            className="flex flex-col justify-center mt-3"
                                        >
                                            <View
                                                className="flex flex-row justify-between items-center mt-2"
                                            >
                                                <Ionicons 
                                                    name="happy-outline"
                                                    size={25}
                                                    color={theme.colors.text}
                                                />
                                                <Image 
                                                    className="w-10 h-10"
                                                    source={moodToImage(item.mood)}
                                                />
                                            </View>
                                            <View
                                                className="flex flex-row justify-between items-center mt-4"
                                            >
                                                <Ionicons 
                                                    name="bed-outline"
                                                    size={25}
                                                    color={theme.colors.text}
                                                />
                                                <Text
                                                    className="font-[Montserrat-regular] text-lg"
                                                    style={{
                                                        color: theme.colors.primary
                                                    }}
                                                >
                                                    { sleepToText(item.sleep) } hours
                                                </Text>
                                            </View>
                                            <View
                                                className="flex flex-row items-center mt-4"
                                            >
                                                <Ionicons 
                                                    name="cloud-outline"
                                                    size={25}
                                                    color={theme.colors.text}
                                                />
                                                <Text
                                                    className="flex text-right font-[Montserrat-regular] text-sm"
                                                    style={{
                                                        width: '60%',
                                                        marginLeft: 'auto',
                                                        color: theme.colors.primary
                                                    }}
                                                >
                                                    { item.reflection || 'No reflection this day' }
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        </Modal>
    )
}