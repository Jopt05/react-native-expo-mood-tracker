import { MoodContext } from "@/context/Mood.context";
import { ThemeContext } from "@/context/Theme.context";
import { moodToText, sleepToText } from "@/utils/mood";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MoodResumeComponentProps {
  onLinkClick: () => void;
}

export default function MoodResumeComponent({
  onLinkClick,
}: MoodResumeComponentProps) {
  const {theme} = useContext(ThemeContext);
  const {moodState} = useContext(MoodContext);

  return (
    <View
      className="flex flex-col py-4 px-4 mt-4 rounded-xl"
      style={{
        backgroundColor: theme.colors.card,
      }}
    >
      <View className="flex flex-row items-center gap-2">
        <Text
          className=" font-[Montserrat-bold] text-xl"
          style={{
            color: theme.colors.primary,
          }}
        >
          Average mood
        </Text>
        <Text
          className=" font-[Montserrat-regular] text-sm"
          style={{
            color: theme.colors.text,
          }}
        >
          (Last {moodState.moodList.length} check-ins)
        </Text>
      </View>
      <TouchableOpacity
        onPress={onLinkClick}
        className="flex flex-col py-8 px-5 mt-2 rounded-xl"
        style={{
          backgroundColor: theme.dark ? "#6e6e99" : "#89ccff",
        }}
      >
        <View className="flex flex-row items-center">
          <Text
            className="flex-1 text-2xl  font-[Montserrat-bold] mb-4"
            style={{
              color: theme.colors.primary,
            }}
          >
            {moodToText(moodState.averageMood || "")}
          </Text>
          <Ionicons
            name="information-circle-outline"
            color={theme.colors.primary}
            size={20}
          />
        </View>
        <View className="flex flex-row items-center gap-2">
          <Ionicons
            name="arrow-forward-outline"
            color={theme.colors.primary}
            size={10}
          />
          <Text
            className=" font-[Montserrat-regular] text-sm text-wrap"
            style={{
              color: theme.colors.primary,
            }}
          >
            Predominant mood from the past {moodState.moodList.length} check-ins
          </Text>
        </View>
      </TouchableOpacity>
      <View className="flex flex-row items-center gap-2 mt-5">
        <Text
          className=" font-[Montserrat-bold] text-xl"
          style={{
            color: theme.colors.primary,
          }}
        >
          Average sleep
        </Text>
        <Text
          className=" font-[Montserrat-regular] text-sm"
          style={{
            color: theme.colors.text,
          }}
        >
          (Last {moodState.moodList.length} check-ins)
        </Text>
      </View>
      <View
        className="flex flex-col py-8 px-5 bg-[#6e6e99] mt-2 rounded-xl"
        style={{
          backgroundColor: theme.dark ? "#6e6e99" : "#4865db",
        }}
      >
        <Text
          className="text-2xl  font-[Montserrat-bold] mb-4"
          style={{
            color: theme.dark ? theme.colors.primary : "white",
          }}
        >
          {sleepToText(moodState.averageSleepSchedule || "")} hours
        </Text>
        <View className="flex flex-row items-center gap-2">
          <Ionicons
            name="arrow-forward-outline"
            color={theme.dark ? theme.colors.primary : "white"}
            size={10}
          />
          <Text
            className=" font-[Montserrat-regular] text-sm text-wrap"
            style={{
              color: theme.dark ? theme.colors.primary : "white",
            }}
          >
            Predominant sleep schedule from the past {moodState.moodList.length}{" "}
            check-ins
          </Text>
        </View>
      </View>
    </View>
  );
}
