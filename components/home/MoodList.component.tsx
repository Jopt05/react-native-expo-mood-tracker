import { GetMoodsResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { ThemeContext } from "@/context/Theme.context";
import { moodToImage, sleepToText } from "@/utils/mood";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useRef, useState } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import DayfaceComponent from "./Dayface.component";


interface ModalComponentProps {
    visible: boolean;
    onClose: () => void;
}

export default function MoodListComponent(props: ModalComponentProps) {

    const { theme } = useContext( ThemeContext );

    const scrollViewElement = useRef<ScrollView>(null);

    const [moodsList, setMoodsList] = useState<Mood[]>([]);
    const [pagingData, setPagingData] = useState({
        isLoading: false,
        page: 1,
        total: 0
    });
    const defaultStyles = useDefaultStyles();
    const [selected, setSelected] = useState<DateType>();
    const [selectedMood, setSelectedMood] = useState<Mood>();

    useEffect(() => {
        if( !props.visible ) return; 
        getMoods()
    }, [props.visible])

    useEffect(() => {
        if( !selected ) return;
        const plainDate = new Date(selected.toString()).setHours(0, 0, 0, 0);
        const mood = moodsList.find(mood => new Date(mood.createdAt).setHours(0, 0, 0, 0) === plainDate);
        setSelectedMood(mood);
        setTimeout(() => {
            if( scrollViewElement.current ) {
                scrollViewElement.current.scrollToEnd({ animated: true })
            }
        }, 100);
    }, [selected])
    
    
    const getMoods = async(page = 1) => {
        if( page != 1 ) return console.log('Cargando más moods')
        try {
            const token = await AsyncStorage.getItem('authToken');
            if( !token ) return;
            const { data } = await moodTrackedApi.get<GetMoodsResponse>(`/moods?page=${page}&limit=100`, { headers: { Authorization: `Bearer ${token}`} });
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
        setSelectedMood(undefined);
        setSelected(undefined);
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
                <ScrollView
                    style={{
                        width: '90%',
                        maxHeight: 450,
                        backgroundColor: theme.colors.background,
                    }}
                    className="flex flex-col rounded-xl py-4 px-4 z-30"
                    ref={scrollViewElement}
                >
                    <Text
                        className="font-[Montserrat-bold] text-3xl text-center mb-2"
                        style={{
                            color: theme.colors.primary
                        }}
                    >
                        Your previous check ins
                    </Text>
                    <DateTimePicker
                        mode="single"
                        date={selected}
                        onChange={({ date }) =>  {
                            if( !date ) return setSelectedMood(undefined);
                            setSelected(date);
                        }}
                        components={{
                            Day(day) {
                                const plainDate = new Date(day.date).setHours(0, 0, 0, 0);
                                const matchingMood = moodsList.find(mood => new Date(mood.createdAt).setHours(0, 0, 0, 0) === plainDate);
                                return <DayfaceComponent day={day} matchingMood={matchingMood} />
                            },
                        }}
                        disabledDates={(date) => {
                            const plainDate = new Date(date as Date).setHours(0, 0, 0, 0);
                            const matchingMood = moodsList.find(mood => new Date(mood.createdAt).setHours(0, 0, 0, 0) === plainDate);
                            return !matchingMood;
                        }}
                        styles={{
                            ...defaultStyles,
                            day_label: {
                                color: theme.colors.primary
                            },
                            month_label: {
                                color: theme.colors.primary
                            },
                            year_label: {
                                color: theme.colors.primary
                            },
                            selected: {
                                backgroundColor: theme.colors.card
                            },
                            weekday_label: {
                                color: theme.colors.text
                            },
                            month_selector_label: {
                                color: theme.colors.primary
                            },
                            year_selector_label: {
                                color: theme.colors.primary
                            },
                            selected_month: {
                                backgroundColor: theme.colors.card
                            },
                            selected_year: {
                                backgroundColor: theme.colors.card
                            },
                            today: {
                                backgroundColor: 'transparent'
                            }
                        }}
                    />
                    {
                        (selectedMood) && (
                            <View
                                className="flex flex-col px-4 py-4"
                                style={{
                                    backgroundColor: theme.colors.card,
                                    borderRadius: 10,
                                    ...(selectedMood ? { marginBottom: 40 } : {})
                                }}
                            >
                                <Text
                                    className="font-[Montserrat-regular] text-lg"
                                    style={{
                                        color: theme.colors.primary
                                    }}
                                >
                                    { new Date(selectedMood.createdAt).toDateString() }
                                </Text>
                                <View
                                    className="flex flex-col justify-center mt-3"
                                >
                                    <View
                                        className="flex flex-row justify-between selectedMoods-center mt-2"
                                    >
                                        <Ionicons 
                                            name="happy-outline"
                                            size={25}
                                            color={theme.colors.text}
                                        />
                                        <Image
                                            className="w-10 h-10"
                                            source={moodToImage(selectedMood.mood)}
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
                                            { sleepToText(selectedMood.sleep) } hours
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
                                            { selectedMood.reflection || 'No reflection this day' }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        </Modal>
    )
}