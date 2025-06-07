import { Mood } from "@/apis/mood-tracker/interfaces";
import { ThemeContext } from "@/context/Theme.context";
import { moodToImage } from "@/utils/mood";
import { useContext } from "react";
import { Image, Text, View } from "react-native";
import { CalendarDay } from "react-native-ui-datepicker";

interface DayfaceComponentProps {
    day: CalendarDay,
    matchingMood?: Mood;
}


export default function DayfaceComponent(props: DayfaceComponentProps) {

    const { theme } = useContext( ThemeContext );

    return (
        <>
            {
                (props.matchingMood) && (
                    <View
                        className="w-10 h-10 items-center justify-center"
                    >
                        <Image 
                            style={{
                                objectFit: 'contain',
                                width: '100%',
                                height: '100%',
                            }}
                            source={moodToImage(props.matchingMood.mood)}
                        />
                    </View>
                )
            }
            {
                (!props.matchingMood) && (
                    <View>
                        <Text
                            style={{
                                color: (props.day.isDisabled) ? 'grey' : theme.colors.text
                            }}
                        >
                            {props.day.number}
                        </Text>
                    </View>
                )
            }
        </>
    )
}