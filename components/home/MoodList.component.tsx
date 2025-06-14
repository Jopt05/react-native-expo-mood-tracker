import { GetMoodsResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { ThemeContext } from "@/context/Theme.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Modal, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";
import DatePickerComponent from "./Datepicker.component";
import MoodInformation from "./MoodInformation.component";


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
        isLoading: true,
        page: 1,
        total: 0
    });
    const [selectedMood, setSelectedMood] = useState<Mood>();
    const [flatListWidth, setFlatListWidth] = useState(0);
    const [monthYearState, setMonthYearState] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if( !props.visible ) return; 
        getMoods()
        setIsFirstRender(true);
    }, [props.visible])
    
    const getMoods = async(page = 1) => {
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
        setIsFirstRender(false);
        if( isFirstRender ) return;
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
                year: monthYearState.year + 1,
                month: 0,
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
                year: monthYearState.year - 1,
                month: 11,
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
                                    flatListElement.current?.scrollToIndex({
                                        index: 1
                                    })
                                    setFlatListWidth(width);
                                }}
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
                            <MoodInformation 
                                selectedMood={selectedMood}
                            />
                        )
                    }
                </ScrollView>
            </View>
        </Modal>
    )
}

