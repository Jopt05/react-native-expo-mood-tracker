import { Mood } from "@/apis/mood-tracker/interfaces";
import { ThemeContext } from "@/context/Theme.context";
import { formatMoodToChartColor, moodToImage, numberToSleep, sleepToNumber } from "@/utils/mood";
import { useContext, useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
interface ChartComponentProps {
  data: Mood[]
}

const MOODS_LIST = [
  'VERY_SAD',
  'SAD',
  'NEUTRAL',
  'HAPPY',
  'VERY_HAPPY'
]

const Montserrat = require('../../assets/fonts/Montserrat-Regular.ttf')

export default function ChartComponent(props: ChartComponentProps) {

    const { theme } = useContext( ThemeContext );

    const [charData, setChartData] = useState<{ data: barDataItem[] }>({
        data: []
    });

    useEffect(() => {
      setChartData({
        data: mapChartData()
      });
    }, [props.data])
    
    const mapChartData = () => {
      const chartData = props.data.map((m, index) => {
        return ({
          value: sleepToNumber(m.sleep),
          label: new Date(m.createdAt).toLocaleDateString(),
          frontColor: formatMoodToChartColor(m.mood),
          topLabelComponent: () => (
            <Image 
              className="w-[35] h-[35] mb-[-35]"
              source={moodToImage(m.mood)}
            />
          ),
        })
      })
      return chartData;
    }

    return (
        <View
            className="flex flex-col py-4 px-4 mt-4 rounded-xl"
            style={{
                backgroundColor: theme.colors.card
            }}
        >
          <Text
            className="font-[Montserrat-bold] text-xl"
            style={{
              color: theme.colors.primary
            }}
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
              }}
            >
              <BarChart 
                data={charData.data}
                barBorderTopLeftRadius={15}
                barBorderTopRightRadius={15}
                dashGap={25}
                spacing={50}
                barWidth={35}
                height={250}
                maxValue={5}
                stepValue={1}
                xAxisLabelTextStyle={{
                  color: theme.colors.primary
                }}
                yAxisTextStyle={{
                  color: theme.colors.primary,
                  fontSize: 10,
                  fontFamily: 'Montserrat-regular'
                }}
                formatYLabel={(value) => {
                  if( value == '0' ) return '';
                  const hourText = numberToSleep(Number(value));
                  return `${hourText} hours`
                }}
                yAxisLabelWidth={60}
                isAnimated
              />
            </View>
          </ScrollView>
        </View>
    )
}