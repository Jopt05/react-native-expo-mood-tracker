import { ThemeContext } from "@/context/Theme.context";
import { Period } from "@/hooks/useStats.hook";
import { formatMoodToChartColor, moodToText, sleepToText } from "@/utils/mood";
import { useContext } from "react";
import { Text, View } from "react-native";
import PeriodSelector from "./PeriodSelector.component";

interface DistributionData {
  moodDistribution: { [key: string]: number };
  sleepDistribution: { [key: string]: number };
}

interface StatsDistributionProps {
  distribution: DistributionData | null;
  period: Period;
  onPeriodChange: (period: Period) => void;
}

const SLEEP_COLORS: Record<string, string> = {
  ZER0_TWO: "#ff6b6b",
  THREE_FOUR: "#ffc078",
  FIVE_SIX: "#ffd43b",
  SEVEN_EIGHT: "#69db7c",
  NINE: "#38d9a9",
};

const SLEEP_LABELS: Record<string, string> = {
  ZER0_TWO: "0-2 hours",
  THREE_FOUR: "3-4 hours",
  FIVE_SIX: "5-6 hours",
  SEVEN_EIGHT: "7-8 hours",
  NINE: "9+ hours",
};

interface ProgressBarProps {
  label: string;
  percentage: number;
  color: string;
  textColor: string;
}

function ProgressBar({ label, percentage, color, textColor }: ProgressBarProps) {
  return (
    <View className="mb-3">
      <View className="flex flex-row justify-between mb-1">
        <Text
          className="font-[Montserrat-regular] text-xs flex-1 mr-2"
          style={{ color: textColor }}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {label}
        </Text>
        <Text
          className="font-[Montserrat-regular] text-xs"
          style={{ color }}
        >
          {percentage > 0 ? `${Math.round(percentage)}%` : ""}
        </Text>
      </View>
      <View
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
      >
        <View
          className="h-2 rounded-full"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

export default function StatsDistributionComponent({
  distribution,
  period,
  onPeriodChange,
}: StatsDistributionProps) {
  const { theme } = useContext(ThemeContext);

  // Sort mood entries by percentage (highest first), filter out 0%
  const moodEntries = distribution
    ? Object.entries(distribution.moodDistribution)
        .filter(([_, pct]) => pct > 0)
        .sort((a, b) => b[1] - a[1])
    : [];

  // Sort sleep entries by percentage (highest first), filter out 0%
  const sleepEntries = distribution
    ? Object.entries(distribution.sleepDistribution)
        .filter(([_, pct]) => pct > 0)
        .sort((a, b) => b[1] - a[1])
    : [];

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
          Distribution Statistics
        </Text>
        <PeriodSelector selected={period} onChange={onPeriodChange} />
      </View>
      <Text
        className="font-[Montserrat-regular] text-xs mb-4"
        style={{ color: theme.colors.text }}
      >
        Percentage breakdown of your moods and sleep
      </Text>

      <View className="flex flex-row gap-4">
        {/* Mood Distribution */}
        <View className="flex-1">
          <Text
            className="font-[Montserrat-bold] text-sm mb-3"
            style={{ color: theme.colors.primary }}
          >
            Mood Distribution
          </Text>
          {moodEntries.length > 0 ? (
            moodEntries.map(([mood, pct]) => (
              <ProgressBar
                key={mood}
                label={moodToText(mood)}
                percentage={pct}
                color={formatMoodToChartColor(mood)}
                textColor={theme.colors.primary}
              />
            ))
          ) : (
            <Text
              className="font-[Montserrat-regular] text-xs"
              style={{ color: theme.colors.text }}
            >
              No data
            </Text>
          )}
        </View>

        {/* Sleep Distribution */}
        <View className="flex-1">
          <Text
            className="font-[Montserrat-bold] text-sm mb-3"
            style={{ color: theme.colors.primary }}
          >
            Sleep Distribution
          </Text>
          {sleepEntries.length > 0 ? (
            sleepEntries.map(([sleep, pct]) => (
              <ProgressBar
                key={sleep}
                label={SLEEP_LABELS[sleep] || sleep}
                percentage={pct}
                color={SLEEP_COLORS[sleep] || "#87c9fc"}
                textColor={theme.colors.primary}
              />
            ))
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
