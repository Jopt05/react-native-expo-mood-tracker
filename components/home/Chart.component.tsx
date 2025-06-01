import { Mood } from "@/apis/mood-tracker/interfaces";
import { formatMoodToChartColor, numberToSleep, sleepToNumber } from "@/utils/mood";
import { useFont } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";

interface ChartComponentProps {
  data: Mood[]
}

interface ChartDataState extends ChartComponentProps {
  isLoading: boolean
}

const Montserrat = require('../../assets/fonts/Montserrat-Regular.ttf')

export default function ChartComponent(props: ChartComponentProps) {

    const font = useFont(Montserrat, 12);
    const [charData, setChartData] = useState<ChartDataState>({
        isLoading: true,
        data: []
    });

    useEffect(() => {
      setChartData({
        isLoading: false,
        data: props.data
      })
    }, [props.data])
    

    return (
        <View
            className="flex flex-col py-4 px-4 mt-4 bg-[#44446f] rounded-xl"
        >
          <Text
            className="text-[#f5f5ff] font-[Montserrat-bold] text-xl"
          >
            Moods and sleep trends
          </Text>
          <ScrollView
            horizontal={true}
            className="flex flex-1 py-1 pb-2"
          >
            <View
              style={{
                height: 300,
                width: 800
              }}
            >
              <CartesianChart
                data={charData.data.map((m, index) => {
                  return ({
                    date: index + 1,
                    value: sleepToNumber(m.sleep),
                  })
                })}
                xKey="date"
                yKeys={["value"]}
                domainPadding={{ left: 50, right: 50, top: 30 }}
                axisOptions={{
                  font,
                  formatYLabel(value) {
                    return numberToSleep(value);
                  },
                  labelColor: 'white',
                  tickValues: {
                    y: [0,1,2,3,4,5],
                    x: charData.data.map((m, index) => index + 1)
                  },
                  tickCount: {
                    y: 5,
                    x: charData.data.length
                  },
                  formatXLabel(label) {
                    const mood = charData.data[label - 1];
                     const d = new Date(mood.createdAt);
                    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
                  },
                }}
              >
                {({ points, chartBounds }) => {
                  return points.value.map((p, i) => {
                    return (
                      <Bar
                        key={i}
                        barCount={points.value.length}
                        points={[p]}
                        chartBounds={chartBounds}
                        animate={{ type: "spring" }}
                        roundedCorners={{
                          topLeft: 5,
                          topRight: 5,
                        }}
                        color={ formatMoodToChartColor(charData.data[i].mood) }
                      />
                    )
                  })
                }}
              </CartesianChart>
            </View>
          </ScrollView>
        </View>
    )
}