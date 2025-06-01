import { GetMoodsResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { getItemFromAsyncStorage } from "@/utils/asyncstorage";
import { useState } from "react";

interface MoodState {
    moodsList: Mood[],
    isLoading: boolean,
    todaysMood?: Mood,
    averageMood?: string,
    averageSleepSchedule?: string
}

export const useMood = () => {

    const [moodState, setmoodState] = useState<MoodState>({
        moodsList: [],
        isLoading: false
    })

    const getMoods = async() => {
        try {
            console.log('Obteniendo moods')
            const token = await getItemFromAsyncStorage('authToken');
            if( !token ) return; 
            const { data } = await moodTrackedApi.get<GetMoodsResponse>('/moods', { headers: { Authorization: `Bearer ${token}` }});
            setmoodState({
                moodsList: data.payload.mood,
                isLoading: false,
                averageMood: getMostRepeatedMood(data.payload.mood),
                averageSleepSchedule: getMostRepeatedSleep(data.payload.mood),
                todaysMood: getTodaysMood(data.payload.mood)
            });
        } catch (error) {
            console.log('Error al obtener moods')
            console.log(error)
            setmoodState({
                moodsList: [],
                isLoading: false
            })
        }
    }

    const getTodaysMood = (moodList: Mood[]) => {
        const currentDate = new Date().toLocaleDateString();
        const todaysMood = moodList.find( m => new Date(m.createdAt).toLocaleDateString() == currentDate );
        return todaysMood;
    }

    const getMostRepeatedMood = (moodList: Mood[]) => {
        if( moodList.length === 0 ) return;
        const moodCount = moodList.reduce((acc: any, mood: Mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
        }, {});
        const mostRepeatedMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);
        return mostRepeatedMood
    }

    const getMostRepeatedSleep = (moodList: Mood[]) => {
        if( moodList.length === 0 ) return;
        const sleepCount = moodList.reduce((acc: any, mood: Mood) => {
        acc[mood.sleep] = (acc[mood.sleep] || 0) + 1;
        return acc;
        }, {});
        const mostRepeatedSleep = Object.keys(sleepCount).reduce((a, b) => sleepCount[a] > sleepCount[b] ? a : b);
        return mostRepeatedSleep
    }

    const createMood = (newMood: Mood) => {
        setmoodState({
            ...moodState,
            moodsList: [newMood, ...moodState.moodsList],
            averageMood: getMostRepeatedMood([newMood, ...moodState.moodsList]),
            averageSleepSchedule: getMostRepeatedSleep([newMood, ...moodState.moodsList]),
            todaysMood: getTodaysMood([newMood, ...moodState.moodsList])
        })
    }

    return {
        ...moodState,
        getMoods,
        createMood
    }
    
}