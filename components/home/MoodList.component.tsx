import { GetMoodsResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { ThemeContext } from "@/context/Theme.context";
import { moodToImage, sleepToText } from "@/utils/mood";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useRef, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
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
    const [displayedMonth, setDisplayedMonth] = useState<number>(new Date().getMonth() + 1);
    const [displayedYear, setDisplayedYear] = useState<number>(new Date().getFullYear());
    const [showSwipeHint, setShowSwipeHint] = useState(true);

    const SWIPE_THRESHOLD = 50;
    const SLIDE_DISTANCE = 300;
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const hintOpacity = useSharedValue(1);

    const animatedCalendarStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
    }));

    const animatedHintStyle = useAnimatedStyle(() => ({
        opacity: hintOpacity.value,
    }));

    const hideSwipeHint = () => {
        if (showSwipeHint) {
            setShowSwipeHint(false);
            hintOpacity.value = withTiming(0, { duration: 300 });
        }
    };

    const animateMonthChange = (direction: 'left' | 'right') => {
        hideSwipeHint();
        const exitTo = direction === 'left' ? -SLIDE_DISTANCE : SLIDE_DISTANCE;
        const enterFrom = direction === 'left' ? SLIDE_DISTANCE : -SLIDE_DISTANCE;

        // Slide out
        translateX.value = withTiming(exitTo, { duration: 150 });
        opacity.value = withTiming(0, { duration: 150 }, () => {
            // Change month
            if (direction === 'left') {
                runOnJS(goToNextMonth)();
            } else {
                runOnJS(goToPrevMonth)();
            }
            // Reset position to enter from opposite side
            translateX.value = enterFrom;
            // Slide in
            translateX.value = withTiming(0, { duration: 200 });
            opacity.value = withTiming(1, { duration: 200 });
        });
    };

    const goToNextMonth = () => {
        setDisplayedMonth((prev) => {
            if (prev === 12) {
                setDisplayedYear((y) => y + 1);
                return 1;
            }
            return prev + 1;
        });
    };

    const goToPrevMonth = () => {
        setDisplayedMonth((prev) => {
            if (prev === 1) {
                setDisplayedYear((y) => y - 1);
                return 12;
            }
            return prev - 1;
        });
    };

    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-SWIPE_THRESHOLD, SWIPE_THRESHOLD])
        .failOffsetY([-20, 20])
        .onEnd((event) => {
            'worklet';
            if (event.translationX < -SWIPE_THRESHOLD) {
                runOnJS(animateMonthChange)('left');
            } else if (event.translationX > SWIPE_THRESHOLD) {
                runOnJS(animateMonthChange)('right');
            }
        });

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
            <GestureHandlerRootView style={{ flex: 1 }}>
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
                    <GestureDetector gesture={swipeGesture}>
                        <Animated.View style={[{ overflow: 'hidden' }, animatedCalendarStyle]}>
                            <DateTimePicker
                                mode="single"
                                date={selected}
                                month={displayedMonth}
                                year={displayedYear}
                                onMonthChange={(month) => setDisplayedMonth(month)}
                                onYearChange={(year) => setDisplayedYear(year)}
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
                                    },
                                    button_prev: {
                                        backgroundColor: theme.colors.card,
                                        borderRadius: 10,
                                        color: 'red'
                                    },
                                    button_next: {
                                        backgroundColor: theme.colors.card,
                                        borderRadius: 10,
                                        color: 'red'
                                    },
                                    button_next_image: {
                                        tintColor: theme.colors.primary
                                    },
                                    button_prev_image: {
                                        tintColor: theme.colors.primary
                                    }
                                }}
                            />
                        </Animated.View>
                    </GestureDetector>
                    {showSwipeHint && (
                        <Animated.View style={[{ alignItems: 'center', marginTop: 4, marginBottom: 4 }, animatedHintStyle]}>
                            <Text
                                className="font-[Montserrat-light] text-xs"
                                style={{ color: theme.colors.text, opacity: 0.6 }}
                            >
                                ← Swipe left or right to navigate →
                            </Text>
                        </Animated.View>
                    )}
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
            </GestureHandlerRootView>
        </Modal>
    )
}