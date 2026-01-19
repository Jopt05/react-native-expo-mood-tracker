import {
  AdviceResponse,
  CreateMoodResponse,
  GetMoodsResponse,
  Mood,
} from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { getItemFromAsyncStorage } from "@/utils/asyncstorage";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth.context";

export interface MoodState {
  todaysMood?: Mood;
  moodList: Mood[];
  averageMood?: string;
  averageSleepSchedule?: string;
  advice?: string;
}

export const initialMoodState: MoodState = {
  moodList: [],
};

export interface MoodContextProps {
  moodState: MoodState;
  createMood: (mood: Mood) => Promise<boolean | undefined>;
  loadInitialData: () => Promise<void>;
  updatemood: (mood: Mood) => Promise<boolean | undefined>;
}

export const MoodContext = createContext({} as MoodContextProps);

export const MoodProvider = ({children}: any) => {
  const {authState} = useContext(AuthContext);
  const [moodState, setMoodState] = useState(initialMoodState);

  const getMoods = async () => {
    try {
      const token = await getItemFromAsyncStorage("authToken");
      if (!token) return;
      const {data} = await moodTrackedApi.get<GetMoodsResponse>("/moods", {
        headers: {Authorization: `Bearer ${token}`},
      });
      setMoodState((x) => ({...x, moodList: data.payload.mood}));
    } catch (error) {
      console.log("Error al obtener moods");
      console.log(error);
    }
  };

  const getAdvice = async () => {
    try {
      const token = await getItemFromAsyncStorage("authToken");
      if (!token) return;
      const {data} = await moodTrackedApi.get<AdviceResponse>("/advices", {
        headers: {Authorization: `Bearer ${token}`},
      });
      setMoodState(x => ({...x, advice: data.payload.advice}));
    } catch (error) {
      console.log("Ocurrió un error en getAdvice");
      console.log(error);
    }
  };

  const getTodayMood = () => {
    const currentDate = new Date().toLocaleDateString();
    const todaysMood = moodState.moodList?.find(
      (m) => new Date(m.createdAt).toLocaleDateString() == currentDate,
    );
    if (!todaysMood) return;
    setMoodState((x) => ({...x, todaysMood}));
  };

  const getMostRepeatedMood = () => {
    if (moodState.moodList.length === 0) return;
    const moodCount = moodState.moodList.reduce((acc: any, mood: Mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});
    const mostRepeatedMood = Object.keys(moodCount).reduce((a, b) =>
      moodCount[a] > moodCount[b] ? a : b,
    );
    setMoodState((x) => ({...x, averageMood: mostRepeatedMood}));
  };

  const getMostRepeatedSleep = () => {
    if (moodState.moodList.length === 0) return;
    const sleepCount = moodState.moodList.reduce((acc: any, mood: Mood) => {
      acc[mood.sleep] = (acc[mood.sleep] || 0) + 1;
      return acc;
    }, {});
    const mostRepeatedSleep = Object.keys(sleepCount).reduce((a, b) =>
      sleepCount[a] > sleepCount[b] ? a : b,
    );
    setMoodState((x) => ({...x, averageSleepSchedule: mostRepeatedSleep}));
  };

  const createMood = async (newMood: Mood) => {
    try {
      const token = await getItemFromAsyncStorage("authToken");
      if (!token) return;
      const body = {
        mood: newMood.mood,
        sleep: newMood.sleep,
        reflection: newMood.reflection,
      };
      const {data} = await moodTrackedApi.post<CreateMoodResponse>(
        "/moods",
        body,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      console.log({data});
      if (data) {
        setMoodState((x) => ({
          ...x,
          moodList: [data.payload, ...moodState.moodList],
        }));
      }
      return true;
    } catch (error) {
      console.log("Error al crear mood");
      console.log(error);
    }
  };

  const updatemood = async (toUpdateMood: Mood) => {
    try {
      const token = await getItemFromAsyncStorage("authToken");
      if (!token) return;
      const body = {
        mood: toUpdateMood.mood,
        sleep: toUpdateMood.sleep,
        reflection: toUpdateMood.reflection,
      };
      const {data} = await moodTrackedApi.put<CreateMoodResponse>(
        "/moods/" + toUpdateMood.id,
        body,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (data) {
        setMoodState((x) => ({
          ...x,
          moodList: moodState.moodList.map((m) =>
            m.id === data.payload.id ? data.payload : m,
          ),
        }));
      }
      return true;
    } catch (error) {
      console.log("Error al crear mood");
      console.log(error);
    }
  };

  const loadInitialData = async () => {
    await getMoods();
    await getAdvice();
  };

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    getMoods();
    getAdvice();
  }, [authState.isLoggedIn]);

  useEffect(() => {
    getTodayMood();
    getMostRepeatedMood();
    getMostRepeatedSleep();
  }, [moodState.moodList]);

  return (
    <MoodContext.Provider
      value={{
        moodState,
        createMood,
        loadInitialData,
        updatemood,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};
