import { GetMoodsResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { ThemeContext } from "@/context/Theme.context";
import { moodToImage, sleepToText } from "@/utils/mood";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";
import DatePickerComponent from "./Datepicker.component";


interface ModalComponentProps {
    visible: boolean;
    onClose: () => void;
}

export default function MoodListComponent(props: ModalComponentProps) {

    const { theme } = useContext( ThemeContext );

    const scrollViewElement = useRef<ScrollView>(null);
    const flatListElement = useRef<FlatList>(null);

    const [moodsList, setMoodsList] = useState<Mood[]>([]);
    const [pagingData, setPagingData] = useState({
        isLoading: false,
        page: 1,
        total: 0
    });
    const [selectedMood, setSelectedMood] = useState<Mood>();
    const [flatListWidth, setFlatListWidth] = useState(0);
    const [monthYearState, setMonthYearState] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });

    useEffect(() => {
        if( !props.visible ) return; 
        getMoods()
    }, [props.visible])

    useEffect(() => {
      console.log(monthYearState)
    }, [monthYearState])
    
    
    const getMoods = async(page = 1) => {
        setPagingData({
            ...pagingData,
            isLoading: true
        });
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

    const handleClose = async() => {
        setMoodsList([]);
        setPagingData({
            isLoading: true,
            page: 1,
            total: 0
        })
        setSelectedMood(undefined);
        props.onClose();
    }

    const handleScrollAnimationEnd = () => {
        if( !flatListElement.current ) return;
        flatListElement.current?.scrollToIndex({
            index: 1,
            animated: true
        })
    }

    const handleScroll = ( event: NativeSyntheticEvent<NativeScrollEvent> ) => {
        let direction = "";
        const { contentOffset, layoutMeasurement } = event.nativeEvent;
        const currentIndex = Math.floor(contentOffset.x / layoutMeasurement.width);
        
        direction = ( currentIndex === 0 ) ? 'right' : 'left';
        if( direction === 'right' ) {
            decreaseMonth();
        } else {
            increaseMonth();
        }
    }

    const increaseMonth = () => {
        if( monthYearState.month === 11 ) {
            setMonthYearState({
                ...monthYearState,
                month: 0,
                year: monthYearState.year + 1
            })
            return;
        }
        setMonthYearState({
            ...monthYearState,
            month: monthYearState.month + 1
        })
    }

    const decreaseMonth = () => {
        if( monthYearState.month === 0 ) {
            setMonthYearState({
                month: 11,
                year: monthYearState.year - 1
            })
            return;
        }
        setMonthYearState({
            ...monthYearState,
            month: monthYearState.month - 1
        })
    }

    const handleDateChange = (date: DateType) => {
        if( !date ) {
            setSelectedMood(undefined)
            return;
        };
        const plainDate = new Date(date.toString()).setHours(0, 0, 0, 0);
        const mood = moodsList.find(mood => new Date(mood.createdAt).setHours(0, 0, 0, 0) === plainDate);
        setSelectedMood(mood);
        setTimeout(() => {
            if( scrollViewElement.current ) {
                scrollViewElement.current.scrollToEnd({ animated: true });
            }
        }, 100);
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
                        position: 'relative',
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
                    {
                        (pagingData.isLoading) ? (
                            <ActivityIndicator 
                                className="flex mt-20"
                                size={40}
                            />
                        ) : (
                            <FlatList 
                                ref={flatListElement}
                                data={[0, 1, 2]} 
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                onLayout={(event) => {
                                    const { width } = event.nativeEvent.layout;
                                    setFlatListWidth(width);
                                }}
                                // initialScrollIndex={1}
                                pagingEnabled
                                onScrollEndDrag={handleScrollAnimationEnd}
                                onScroll={handleScroll} 
                                onScrollToIndexFailed={info => {
                                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                                    wait.then(() => {
                                    flatListElement.current?.scrollToIndex({ index: 1, animated: true });
                                    });
                                }}
                                scrollEventThrottle={500}
                                renderItem={({index}) => {
                                    if( index === 1 ) {
                                        return (
                                            <DatePickerComponent 
                                                parentWidth={flatListWidth}
                                                onDateChange={(date) => handleDateChange(date)}
                                                moodList={ moodsList }
                                                currentMonth={ monthYearState.month }
                                                currentYear={ monthYearState.year }
                                            />
                                        )
                                    }
                                    return (
                                        <View 
                                            className="flex-1"
                                            style={{
                                                width: flatListWidth
                                            }}
                                        >
                                        </View>
                                    )
                                }}
                            />
                        )

                    }
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