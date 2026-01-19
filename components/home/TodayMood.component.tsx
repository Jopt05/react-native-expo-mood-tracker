import { Mood } from "@/apis/mood-tracker/interfaces";
import { MoodContext } from "@/context/Mood.context";
import { ThemeContext } from "@/context/Theme.context";
import { moodToImage, moodToText, sleepToText } from "@/utils/mood";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface TodayMoodComponentProps {
  onEditMood: () => void;
}

export default function TodayMoodComponent({ onEditMood }: TodayMoodComponentProps) {

  const {theme} = useContext(ThemeContext);
  const {moodState} = useContext(MoodContext);

  const handleEditMood = () => {
    onEditMood();
  }

  return (
    <>
      <View
        className="flex flex-row py-4 px-4 mt-20 rounded-xl"
        style={{
          backgroundColor: theme.colors.card,
        }}
      >
        <View
          style={{
            minHeight: 150,
          }}
          className="flex flex-col flex-1"
        >
          <Text
            className="font-[Montserrat-regular] text-xl mb-2"
            style={{
              color: theme.colors.text,
            }}
          >
            I'm feeling
          </Text>
          <Text
            className="font-[Montserrat-bold] text-3xl flex-1"
            style={{
              color: theme.colors.primary,
            }}
          >
            {moodToText(moodState.todaysMood!.mood)}
          </Text>
          <Text
            className="font-[Montserrat-regular] text-sm mt-6"
            style={{
              color: theme.colors.primary,
            }}
          >
            "{moodState.advice}"
          </Text>
        </View>
        <View className="flex flex-row flex-1 items-end justify-end">
          <Image
            className=""
            source={moodToImage(moodState.todaysMood!.mood)}
          />
        </View>
      </View>
      <View
        className="flex flex-col py-4 px-4 mt-4 rounded-xl"
        style={{
          backgroundColor: theme.colors.card,
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <Ionicons name="bed-outline" color={theme.colors.primary} size={20} />
          <Text
            className=" font-[Montserrat-regular] text-xl"
            style={{
              color: theme.colors.primary,
            }}
          >
            Sleep
          </Text>
        </View>
        <Text
          className=" font-[Montserrat-bold] text-3xl mt-2"
          style={{
            color: theme.colors.primary,
          }}
        >
          {sleepToText(moodState.todaysMood!.sleep)} hours
        </Text>
      </View>
      <View
        className="flex flex-col py-4 px-4 mt-4 rounded-xl"
        style={{
          backgroundColor: theme.colors.card,
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <Ionicons
            name="cloud-outline"
            color={theme.colors.primary}
            size={20}
          />
          <Text
            className=" font-[Montserrat-regular] text-xl"
            style={{
              color: theme.colors.primary,
            }}
          >
            Reflection
          </Text>
        </View>
        <View
          className="flex flex-row items-center justify-between mt-8"
        >
          <Text
            className=" font-[Montserrat-regular] text-sm mr-2"
            style={{
              color: theme.colors.text,
            }}
          >
            {moodState.todaysMood!.reflection || "No reflection this day"}
          </Text>
          <TouchableOpacity
            onPress={handleEditMood}
          >
            <Ionicons
              className="p-1.5 bg-blue-500 rounded-md"
              name="pencil-outline"
              color={theme.colors.primary}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
