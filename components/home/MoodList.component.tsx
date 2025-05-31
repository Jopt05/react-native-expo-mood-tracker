import { GetMoodsResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { moodToImage, sleepToText } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalComponentProps {
    visible: boolean;
    onClose: () => void;
}

export default function MoodListComponent(props: ModalComponentProps) {

    const [moodsList, setMoodsList] = useState<Mood[]>([]);
    const [pagingData, setPagingData] = useState({
        isLoading: true,
        page: 1,
        total: 0
    })
    
    const getMoods = async() => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if( !token ) return;
            const { data } = await moodTrackedApi.get<GetMoodsResponse>(`/moods?page=1`, { headers: { Authorization: `Bearer ${token}`} });
            setMoodsList(data.payload.mood);
            setPagingData({
                isLoading: false,
                page: data.payload.page,
                total: data.payload.total
            })
        } catch (error) {
            console.log('Ocurrió un error al obtener moods')
            console.log(error)
        }
    }

    const getMoreMoods = async(page = 1) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if( !token ) return;
            const { data } = await moodTrackedApi.get<GetMoodsResponse>(`/moods?page=${page}`, { headers: { Authorization: `Bearer ${token}`} });
            setMoodsList([...moodsList, ...data.payload.mood]);
            setPagingData({
                ...pagingData,
                isLoading: false,
                page: data.payload.page
            })
        } catch (error) {
            console.log('Ocurrió un error al obtener moods')
            console.log(error)
        }
    }

    const handleEndReached = () => {
        if( moodsList.length >= pagingData.total ) return;
        setPagingData({
            ...pagingData,
            isLoading: true,
            page: pagingData.page + 1
        });
        getMoreMoods(pagingData.page + 1)
    }

    useEffect(() => {
        if( !props.visible ) return; 
        getMoods()
    }, [props.visible])
    

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={props.onClose}
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
                    onPress={() => props.onClose()}
                ></TouchableOpacity>
                <View
                    style={{
                        width: '90%',
                        maxHeight: 450
                    }}
                    className="flex flex-col bg-[#44446f] rounded-xl py-4 px-4 z-30"
                >
                    <Text
                        className="text-[#f5f5ff] font-[Montserrat-bold] text-3xl text-center"
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
                                (pagingData.isLoading) && (
                                    <ActivityIndicator 
                                        className="flex justify-center mt-2"
                                        size="large"
                                    />
                                ),
                                (!pagingData.isLoading && moodsList.length == pagingData.total) && (
                                    <Text
                                        className="text-[#f5f5ff] font-[Montserrat-regular] text-center mt-2"
                                    >
                                        No more moods to show
                                    </Text>
                                )
                        )}  
                        renderItem={({item}) => {
                                return (
                                    <View
                                        className="flex flex-col px-4 py-4 mt-2 bg-[#3a3a59]"
                                    >
                                        <Text
                                            className="text-[#f5f5ff] font-[Montserrat-regular] text-lg"
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
                                                    color="#f5f5ff"
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
                                                    color="#f5f5ff"
                                                />
                                                <Text
                                                    className="text-[#f5f5ff] font-[Montserrat-regular] text-lg"
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
                                                    color="#f5f5ff"
                                                />
                                                <Text
                                                    className="flex text-right text-[#f5f5ff] font-[Montserrat-regular] text-sm"
                                                    style={{
                                                        width: '60%',
                                                        marginLeft: 'auto'
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