import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { getItemFromAsyncStorage } from "@/utils/asyncstorage";
import { useEffect, useState } from "react";

interface MoodDistribution {
  [key: string]: number;
}

interface SleepDistribution {
  [key: string]: number;
}

interface DistributionResponse {
  moodDistribution: MoodDistribution;
  sleepDistribution: SleepDistribution;
}

interface AverageResponse {
  avg_mood: number;
  avg_sleep: number;
}

export interface StatsState {
  distribution: DistributionResponse | null;
  average: AverageResponse | null;
  isLoading: boolean;
}

const PERIODS = [7, 14, 30, 60, 90] as const;
export type Period = (typeof PERIODS)[number];
export { PERIODS };

export const useStats = () => {
  const [distributionPeriod, setDistributionPeriod] = useState<Period>(30);
  const [averagePeriod, setAveragePeriod] = useState<Period>(7);
  const [stats, setStats] = useState<StatsState>({
    distribution: null,
    average: null,
    isLoading: false,
  });

  const fetchDistribution = async (days: Period) => {
    try {
      const token = await getItemFromAsyncStorage("authToken");
      if (!token) return;
      const { data } = await moodTrackedApi.get(`/stats/distribution?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats((x) => ({ ...x, distribution: data.payload }));
    } catch (error) {
      console.log("Error fetching distribution", error);
    }
  };

  const fetchAverage = async (days: Period) => {
    try {
      const token = await getItemFromAsyncStorage("authToken");
      if (!token) return;
      const { data } = await moodTrackedApi.get(`/stats/average?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats((x) => ({ ...x, average: data.payload }));
    } catch (error) {
      console.log("Error fetching average", error);
    }
  };

  const loadStats = async () => {
    setStats((x) => ({ ...x, isLoading: true }));
    await Promise.all([
      fetchDistribution(distributionPeriod),
      fetchAverage(averagePeriod),
    ]);
    setStats((x) => ({ ...x, isLoading: false }));
  };

  useEffect(() => {
    fetchDistribution(distributionPeriod);
  }, [distributionPeriod]);

  useEffect(() => {
    fetchAverage(averagePeriod);
  }, [averagePeriod]);

  return {
    stats,
    distributionPeriod,
    averagePeriod,
    setDistributionPeriod,
    setAveragePeriod,
    loadStats,
  };
};
