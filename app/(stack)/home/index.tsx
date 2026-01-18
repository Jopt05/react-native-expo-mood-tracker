import ChartComponent from "@/components/home/Chart.component";
import HomeHeaderComponent from "@/components/home/HomeHeader.component";
import ModalFormComponent from "@/components/home/MoodForm.component";
import MoodListComponent from "@/components/home/MoodList.component";
import MoodResumeComponent from "@/components/home/MoodResume.component";
import TodayMoodComponent from "@/components/home/TodayMood.component";
import ProtectedRoute from "@/components/shared/ProtectedRoute.component";
import { MoodContext } from "@/context/Mood.context";
import { ThemeContext } from "@/context/Theme.context";
import { useContext, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  const {theme} = useContext(ThemeContext);
  const {moodState, loadInitialData} = useContext(MoodContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoodsModalOpen, setIsMoodsModalOpen] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);

  const handleRefresh = async () => {
    setisRefreshing(true);
    await loadInitialData();
    setisRefreshing(false);
  };

  return (
    <ProtectedRoute>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
        }
        style={{
          paddingHorizontal: 25,
        }}
      >
        <ModalFormComponent
          onClose={() => setIsModalOpen(!isModalOpen)}
          visible={isModalOpen}
        />
        <MoodListComponent
          onClose={() => setIsMoodsModalOpen(!isMoodsModalOpen)}
          visible={isMoodsModalOpen}
        />

        <HomeHeaderComponent />

        {!moodState.todaysMood && (
          <>
            <View className="flex flex-row justify-center mt-14">
              <TouchableOpacity
                className="py-6 px-12 rounded-md"
                style={{
                  backgroundColor: theme.colors.notification,
                }}
                onPress={() => setIsModalOpen(true)}
              >
                <Text
                  className=" font-[Montserrat-bold] text-xl"
                  style={{
                    color: theme.dark ? theme.colors.primary : "white",
                  }}
                >
                  Log today's mood
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {moodState.todaysMood && <TodayMoodComponent />}

        <MoodResumeComponent onLinkClick={() => setIsMoodsModalOpen(true)} />

        {!isModalOpen && !isMoodsModalOpen && (
          <ChartComponent data={moodState.moodList} />
        )}
        <View className="flex flex-row justify-center my-8">
          <Text
            className=" font-[Montserrat-thin] text-sm"
            style={{
              color: theme.colors.primary,
            }}
          >
            Developed by Jesús Puentes
          </Text>
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}
