import { AdviceResponse, GetMoodsResponse, Mood } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { getItemFromAsyncStorage } from "@/utils/asyncstorage";
import { createContext, useEffect, useState } from "react";


export interface MoodState {
    todaysMood?: Mood;
    moodList: Mood[];
    averageMood?: string;
    averageSleepSchedule?: string;
    advice?: string;
}

export const initialMoodState: MoodState = {
    moodList: []
}

export interface MoodContextProps {
    moodState: MoodState;
}

export const MoodContext = createContext({} as MoodContextProps );

export const MoodProvider = ({children}: any) => {

    const [moodState, setMoodState] = useState(initialMoodState);

    const getMoods = async() => {
        try {
            const token = await getItemFromAsyncStorage('authToken');
            if( !token ) return; 
            const { data } = await moodTrackedApi.get<GetMoodsResponse>('/moods', { headers: { Authorization: `Bearer ${token}` }});
            setMoodState({
                ...moodState,
                moodList: data.payload.mood,
            });
        } catch (error) {
            console.log('Error al obtener moods');
            console.log(error)
        }
    }

    const getAdvice = async() => {
        try {
            console.log('Obteniendo advice')
            const token = await getItemFromAsyncStorage('authToken');
            if( !token ) return; 
            const { data } = await moodTrackedApi.get<AdviceResponse>('/advices', { headers: { Authorization: `Bearer ${token}` }});
            setMoodState({
                ...moodState,
                advice: data.payload.advice,
            })
        } catch (error) {
            console.log('Ocurrió un error en getAdvice')
            console.log(error)
        }
    }

    const getTodayMood = () => {
        const currentDate = new Date().toLocaleDateString();
        const todaysMood = moodState.moodList?.find( m => new Date(m.createdAt).toLocaleDateString() == currentDate );
        if( todaysMood ) return;
        setMoodState({
            ...moodState,
            todaysMood
        })
    }

    const getMostRepeatedMood = () => {
        if( moodState.moodList.length === 0 ) return;
        const moodCount = moodState.moodList.reduce((acc: any, mood: Mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
        }, {});
        const mostRepeatedMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);
        setMoodState({
            ...moodState,
            averageMood: mostRepeatedMood
        })
    }

    const getMostRepeatedSleep = () => {
        if( moodState.moodList.length === 0 ) return;
        const sleepCount = moodState.moodList.reduce((acc: any, mood: Mood) => {
        acc[mood.sleep] = (acc[mood.sleep] || 0) + 1;
        return acc;
        }, {});
        const mostRepeatedSleep = Object.keys(sleepCount).reduce((a, b) => sleepCount[a] > sleepCount[b] ? a : b);
        setMoodState({
            ...moodState,
            averageSleepSchedule: mostRepeatedSleep
        })
    }

    useEffect(() => {
        getMoods();
        getAdvice();
    }, []);

    useEffect(() => {
        getTodayMood();
        getMostRepeatedMood();
        getMostRepeatedSleep();
    }, [moodState.moodList])
    

    return (
        <MoodContext.Provider value={{
            moodState
        }}>
            {children}
        </MoodContext.Provider>
    )

}

