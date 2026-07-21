import { ThemeContext } from "@/context/Theme.context";
import { Period } from "@/hooks/useStats.hook";
import { moodToImage, moodToText, numberToMood, numberToSleep } from "@/utils/mood";
import { useContext } from "react";
import { Image, Text, View } from "react-native";
import PeriodSelector from "./PeriodSelector.component";

interface AverageData {
  avg_mood: number;
  avg_sleep: number;
}

interface StatsAverageProps {
  average: AverageData | null;
  period: Period;
  onPeriodChange: (period: Period) => void;
}

export default function StatsAverageComponent({
  average,
  period,
  onPeriodChange,
}: StatsAverageProps) {
  const { theme } = useContext(ThemeContext);

  const moodValue = average ? Math.round(average.avg_mood) : 3;
  const sleepValue = average ? Math.round(average.avg_sleep) : 1;
  const moodKey = numberToMood(moodValue);
  const moodLabel = moodToText(moodKey);
  const sleepLabel = numberToSleep(sleepValue);
  const moodImg = moodToImage(moodKey);

  return (
    <View
      className="flex flex-col py-4 px-4 mt-4 rounded-xl"
      style={{ backgroundColor: theme.colors.card }}
    >
      <View className="flex flex-row justify-between items-center mb-1">
        <Text
          className="font-[Montserrat-bold] text-xl"
          style={{ color: theme.colors.primary }}
        >
          Average Statistics
        </Text>
        <PeriodSelector selected={period} onChange={onPeriodChange} />
      </View>
      <Text
        className="font-[Montserrat-regular] text-xs mb-4"
        style={{ color: theme.colors.text }}
      >
        Your average mood and sleep over time
      </Text>

      <View className="flex flex-row gap-4">
        {/* Average Mood */}
        <View
          className="flex-1 rounded-lg py-4 px-3"
          style={{ backgroundColor: theme.colors.background }}
        >
          <Text
            className="font-[Montserrat-bold] text-sm mb-3"
            style={{ color: theme.colors.primary }}
          >
            Average Mood
          </Text>
          {average ? (
            <View className="flex flex-row items-center gap-3">
              <Image
                source={moodImg}
                style={{ width: 40, height: 40 }}
              />
              <View>
                <Text
                  className="font-[Montserrat-bold] text-lg"
                  style={{ color: theme.colors.primary }}
                >
                  {moodLabel}
                </Text>
                <Text
                  className="font-[Montserrat-regular] text-xs"
                  style={{ color: theme.colors.text }}
                >
                  Based on {period}
                </Text>
                <Text
                  className="font-[Montserrat-regular] text-xs"
                  style={{ color: theme.colors.text }}
                >
                   days of data
                </Text>
              </View>
            </View>
          ) : (
            <Text
              className="font-[Montserrat-regular] text-xs"
              style={{ color: theme.colors.text }}
            >
              No data
            </Text>
          )}
        </View>

        {/* Average Sleep */}
        <View
          className="flex-1 rounded-lg py-4 px-3"
          style={{ backgroundColor: theme.colors.background }}
        >
          <Text
            className="font-[Montserrat-bold] text-sm mb-3"
            style={{ color: theme.colors.primary }}
          >
            Average Sleep
          </Text>
          {average ? (
            <View>
              <Text
                className="font-[Montserrat-bold] text-lg"
                style={{ color: theme.colors.primary }}
              >
                {sleepLabel}
              </Text>
              <Text
                className="font-[Montserrat-regular] text-xs"
                style={{ color: theme.colors.text }}
              >
                Based on {period} days of data
              </Text>
            </View>
          ) : (
            <Text
              className="font-[Montserrat-regular] text-xs"
              style={{ color: theme.colors.text }}
            >
              No data
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
