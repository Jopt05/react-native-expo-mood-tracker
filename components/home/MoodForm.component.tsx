import { CreateMoodResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { useForm } from "@/hooks/useForm.hook";
import { getItemFromAsyncStorage } from "@/utils/asyncstorage";
import { useState } from "react";
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

interface ModalComponentProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (mood: Mood) => void;
}

const FIRST_STEP_ANSWERS = [
    { key: 'VERY_HAPPY', value: 'Very happy' },
    { key: 'HAPPY', value: 'Happy' },
    { key: 'NEUTRAL', value: 'Neutral' },
    { key: 'SAD', value: 'Sad' },
    { key: 'VERY_SAD', value: 'Very sad' },
];

const SECOND_STEP_ANSWERS = [
    { key: 'NINE', value: '+9' },
    { key: 'SEVEN_EIGHT', value: '6-8' },
    { key: 'FIVE_SIX', value: '5-6' },
    { key: 'THREE_FOUR', value: '3-4' },
    { key: 'ZERO_TWO', value: '0-2' },
];

const STEP_TEXTS = [
    'How was your mood today?',
    'How much sleep did you get last night?',
    'Any thoughts for today?'
]

export default function ModalFormComponent(props: ModalComponentProps) {

    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { mood, sleep, reflection, onChange } = useForm({
        mood: '',
        sleep: '',
        reflection: ''
    });
    const [hasError, setHasError] = useState(false);

    const handleContinue = () => {
        if( (currentStep == 0 && !mood) || (currentStep == 1 && !sleep) ) {
            setHasError(true);
            return
        };
        setHasError(false);
        if( currentStep == 2 ) {
            handleCreateMood();
            return;
        } 
        setCurrentStep(currentStep + 1);
    }

    const handleCreateMood = async() => {
        try {
            setIsLoading(true);
            const token = await getItemFromAsyncStorage('authToken');
            if( !token ) return; 
            const { data } = await moodTrackedApi.post<CreateMoodResponse>('/moods', {mood, sleep, reflection}, { headers: { Authorization: `Bearer ${token}`} });
            if( data ) {
                setCurrentStep(0);
                setIsLoading(false);
                props.onClose()
                props.onCreate(data.payload);
                return;
            };
        } catch (error) {
            console.log('Ocurrió un error al crear mood');
            console.log(error);
            return
        }
    }

    const handleClose = async() => {
        setCurrentStep(0);
        setHasError(false);
        onChange('', 'mood');
        onChange('', 'sleep');
        onChange('', 'reflection');
        props.onClose();
    }

    return(
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
                        zIndex: 10
                    }}
                    onPress={() => handleClose()}   
                ></TouchableOpacity>
                <View
                    style={{
                        width: '90%',
                    }}
                    className="flex flex-col bg-[#44446f] rounded-xl py-4 px-4 z-20"
                >
                    <Text
                        className="text-[#f5f5ff] font-[Montserrat-bold] text-3xl text-center"
                    >
                        Log your mood
                    </Text>
                    <View
                        className="flex flex-row gap-4 mt-6"
                    >
                        <View
                            className="flex flex-1 h-1"
                            style={{
                                backgroundColor: (currentStep === 0) ? '#20214f' : '#ffff'
                            }}
                        ></View>
                        <View
                            className="flex flex-1 h-1"
                            style={{
                                backgroundColor: (currentStep === 1) ? '#20214f' : '#ffff'
                            }}
                        ></View>
                        <View
                            className="flex flex-1 h-1"
                            style={{
                                backgroundColor: (currentStep === 2) ? '#20214f' : '#ffff'
                            }}
                        ></View>
                    </View>
                    <Text
                        className={`font-[Montserrat-regular] text-center mt-6 text-2xl`}
                        style={{
                            color: (hasError) ? '#ff0000' : '#f5f5ff'
                        }}
                    >
                        { STEP_TEXTS[currentStep] }
                    </Text>
                    {
                        (currentStep === 0) && (
                            <>
                                {
                                    FIRST_STEP_ANSWERS.map((answer, key) => (
                                        <TouchableOpacity
                                            className="mt-2"
                                            onPress={() => onChange(answer.key, 'mood')}
                                            key={key}
                                        >
                                            <View
                                                className="flex flex-row py-4 px-4 bg-[#505194]"
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: (mood === answer.key) ? '#f5f5ff' : 'transparent'
                                                }}
                                            >
                                                <Text
                                                    className="text-2xl text-[#f5f5ff] font-[Montserrat-regular]"
                                                >
                                                    { answer.value }
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </>
                        )
                    }
                    {
                        (currentStep === 1) && (
                            <>
                                {
                                    SECOND_STEP_ANSWERS.map((answer, key) => (
                                        <TouchableOpacity
                                            className="mt-2"
                                            key={key}
                                            onPress={() => onChange(answer.key, 'sleep')}
                                        >
                                            <View
                                                className="flex flex-row py-4 px-4 bg-[#505194]"
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: (sleep === answer.key) ? '#f5f5ff' : 'transparent'
                                                }}
                                            >
                                                <Text
                                                    className="text-2xl text-[#f5f5ff] font-[Montserrat-regular]"
                                                >
                                                    { answer.value } hours
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </>
                        )
                    }
                    {
                        (currentStep === 2) && (
                            <View
                                className="flex flex-row mt-4"
                            >
                                <TextInput
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    className="flex flex-1 text-2xl bg-[#505194] text-[#f5f5ff] font-[Montserrat-regular]"
                                    onChangeText={(value) => onChange(value, 'reflection')}
                                    value={reflection}
                                />
                            </View>
                        )
                    }
                    <TouchableOpacity
                        onPress={handleContinue}
                    >
                        <View
                            className="flex flex-row py-4 px-4 bg-[#3a3a59] mt-4"
                        >
                            <Text
                                className="flex flex-1 text-2xl text-[#f5f5ff] font-[Montserrat-regular] text-center"
                            >
                                { (currentStep === 2) ? 'Submit' : 'Next' }
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {
                        (isLoading) && (
                            <ActivityIndicator 
                                className="mt-6"
                                size="large"
                            />
                        )
                    }
                </View>
            </View>
        </Modal>
    )
}