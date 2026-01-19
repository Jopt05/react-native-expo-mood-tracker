import { Mood } from "@/apis/mood-tracker/interfaces";
import { MoodContext } from "@/context/Mood.context";
import { useContext, useState } from "react"

interface UseMoodFormProps {
    mood: string;
    sleep: string;
    reflection: string;
}

export const useMoodForm = ({ mood, sleep, reflection }: UseMoodFormProps) => {

    const { moodState, updatemood, createMood } = useContext(MoodContext);

    const [moodFormState, setMoodFormState] = useState({
        currentStep: 0,
        isLoading: false,
        hasError: false,
    })

    const handleNextStep = async(onClose: () => void) => {
        const currentStep = moodFormState.currentStep;
        if (
            (currentStep == 0 && !mood) || 
            (currentStep == 1 && !sleep)
        ) {
            setMoodFormState(x => ({ ...x, hasError: true }))
            return;
        }
        if (currentStep == 2) {
            if( moodState.todaysMood ) {
                await handleUpdateMood();
            } else {
                await handleCreateMood();
            }
            resetMoodForm();
            onClose();
            return;
        }
        setMoodFormState(x => ({ ...x, currentStep: x.currentStep + 1, hasError: false }) )
    }
    
    const handleCreateMood = async () => {
        try {
            setMoodFormState(x => ({ ...x, isLoading: true }));

            await createMood({mood, sleep, reflection} as Mood);

            setMoodFormState(x => ({ ...x, isLoading: false }));
        } catch (error) {
            console.log("Ocurrió un error al crear mood");
            console.log(error);
            return;
        }
    };
    
    const handleUpdateMood = async() => {
        try {
            setMoodFormState(x => ({ ...x, isLoading: true }));

            await updatemood({mood, sleep, reflection, id: moodState.todaysMood!.id} as Mood);
            
            setMoodFormState(x => ({ ...x, isLoading: false }));
        } catch (error) {
            console.log("Ocurrió un error al editar mood");
            console.log(error);
            return;
        }
    }

    const resetMoodForm = () => {
        setMoodFormState({
            currentStep: 0,
            isLoading: false,
            hasError: false,
        })
    }

    return {
        moodFormState,
        resetMoodForm,
        handleNextStep
    }

}