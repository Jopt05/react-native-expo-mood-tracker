import { Mood } from "@/apis/mood-tracker/interfaces";
import { ThemeContext } from "@/context/Theme.context";
import { formatMoodToChartColor } from "@/utils/mood";
import { Image, useFont, useImage } from "@shopify/react-native-skia";
import { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";

interface ChartComponentProps {
  data: Mood[];
}

interface ChartDataState extends ChartComponentProps {
  isLoading: boolean;
}



const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const sleepToNumber = (value: string) => {
  switch (value) {
    case "ZERO_TWO": return 1;
    case "THREE_FOUR": return 2;
    case "FIVE_SIX": return 3;
    case "SEVEN_EIGHT": return 4;
    case "NINE": return 5;
    default: return 0;
  }
};

const numberToSleep = (value: number) => {
  switch (value) {
    case 0: return "0 hours";
    case 1: return "0-2 hours";
    case 2: return "3-5 hours";
    case 3: return "5-6 hours";
    case 4: return "7-8 hours";
    case 5: return "9+ hours";
    default: return "";
  }
};

const Montserrat = require("../../assets/fonts/Montserrat-Regular.ttf");

export default function ChartComponent(props: ChartComponentProps) {
  const { theme } = useContext(ThemeContext);
  const font = useFont(Montserrat, 11);

  const verySadImg = useImage(require("../../assets/images/very_sad.png"));
  const sadImg = useImage(require("../../assets/images/sad.png"));
  const neutralImg = useImage(require("../../assets/images/neutral.png"));
  const happyImg = useImage(require("../../assets/images/happy.png"));
  const veryHappyImg = useImage(require("../../assets/images/very_happy.png"));

  const moodSkiaImages: Record<string, ReturnType<typeof useImage>> = {
    VERY_SAD: verySadImg,
    SAD: sadImg,
    NEUTRAL: neutralImg,
    HAPPY: happyImg,
    VERY_HAPPY: veryHappyImg,
  };

  const [chartData, setChartData] = useState<ChartDataState>({
    isLoading: true,
    data: [],
  });

  useEffect(() => {
    setChartData({
      isLoading: false,
      data: props.data,
    });
  }, [props.data]);

  // Reverse data so most recent is on the left
  const reversedData = [...chartData.data].reverse();

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  };

  return (
    <View
      className="flex flex-col py-4 px-4 mt-4 rounded-xl"
      style={{ backgroundColor: theme.colors.card }}
    >
      <Text
        className="font-[Montserrat-bold] text-xl mb-2"
        style={{ color: theme.colors.primary }}
      >
        Moods and sleep trends
      </Text>
      <ScrollView horizontal className="flex flex-1 py-1 pb-2">
        <View style={{ height: 320, width: Math.max(reversedData.length * 80, 400) }}>
          <CartesianChart
            data={reversedData.map((m, index) => ({
              date: index + 1,
              value: sleepToNumber(m.sleep),
            }))}
            xKey="date"
            yKeys={["value"]}
            domainPadding={{ left: 50, right: 50, top: 40 }}
            domain={{ y: [0, 5] }}
            axisOptions={{
              font,
              formatYLabel(value) {
                return numberToSleep(value);
              },
              labelColor: theme.colors.primary,
              tickValues: {
                y: [0, 1, 2, 3, 4, 5],
                x: reversedData.map((_, index) => index + 1),
              },
              tickCount: {
                y: 6,
                x: reversedData.length,
              },
              formatXLabel(label) {
                const mood = reversedData[label - 1];
                if (!mood) return "";
                return formatDate(mood.createdAt);
              },
            }}
          >
            {({ points, chartBounds }) => {
              return points.value.map((p, i) => {
                const mood = reversedData[i];
                const img = mood ? moodSkiaImages[mood.mood] : null;
                const imgSize = 28;

                return (
                  <>
                    <Bar
                      key={`bar-${i}`}
                      barCount={points.value.length}
                      points={[p]}
                      chartBounds={chartBounds}
                      animate={{ type: "spring" }}
                      roundedCorners={{
                        topLeft: 10,
                        topRight: 10,
                        bottomLeft: 10,
                        bottomRight: 10,
                      }}
                      color={mood ? formatMoodToChartColor(mood.mood) : "#ccc"}
                    />
                    {img && p.y != null && p.x != null && (
                      <Image
                        key={`img-${i}`}
                        image={img}
                        x={p.x - imgSize / 2}
                        y={p.y - imgSize - 4}
                        width={imgSize}
                        height={imgSize}
                      />
                    )}
                  </>
                );
              });
            }}
          </CartesianChart>
        </View>
      </ScrollView>

    </View>
  );
}
