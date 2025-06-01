import { AdviceResponse } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { getItemFromAsyncStorage } from "@/utils/asyncstorage";
import { useState } from "react";

interface AdviceState {
    advice?: string,
    isLoading: boolean
}


export const useAdvice = () => {

    const [adviceState, setadviceState] = useState<AdviceState>({
        isLoading: true
    });

    const getAdvice = async() => {
        try {
            console.log('Obteniendo advice')
            const token = await getItemFromAsyncStorage('authToken');
            if( !token ) return; 
            const { data } = await moodTrackedApi.get<AdviceResponse>('/advices', { headers: { Authorization: `Bearer ${token}` }});
            setadviceState({
                advice: data.payload.advice,
                isLoading: false
            })
        } catch (error) {
            console.log('Ocurrió un error en getAdvice')
            console.log(error)
            setadviceState({
                isLoading: false
            })
        }
    }

    return {
        ...adviceState,
        getAdvice
    }

}