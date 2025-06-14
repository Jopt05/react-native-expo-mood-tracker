import { Mood } from "@/apis/mood-tracker/interfaces";
import { ThemeContext } from "@/context/Theme.context";
import { moodToImage, sleepToText } from "@/utils/mood";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Image, Text, View } from "react-native";

interface MoodInformationProps {
    selectedMood: Mood;   
}

export default function MoodInformation(props: MoodInformationProps) {

    const { theme } = useContext( ThemeContext );

    return (
        <View
            className="flex flex-col px-4 py-4"
            style={{
                backgroundColor: theme.colors.card,
                borderRadius: 10,
                ...(props.selectedMood ? { marginBottom: 40 } : {})
            }}
        >
            <Text
                className="font-[Montserrat-regular] text-lg"
                style={{
                    color: theme.colors.primary
                }}
            >
                { new Date(props.selectedMood.createdAt).toDateString() }
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
                        source={moodToImage(props.selectedMood.mood)}
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
                        { sleepToText(props.selectedMood.sleep) } hours
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
                        { props.selectedMood.reflection || 'No reflection this day' }
                    </Text>
                </View>
            </View>
        </View>
    )
}