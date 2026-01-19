import { Mood } from "@/apis/mood-tracker/interfaces";
import { MoodContext } from "@/context/Mood.context";
import { ThemeContext } from "@/context/Theme.context";
import { useForm } from "@/hooks/useForm.hook";
import { useMoodForm } from "@/hooks/useMoodForm.hook";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalComponentProps {
  visible: boolean;
  onClose: () => void;
}

const FIRST_STEP_ANSWERS = [
  {key: "VERY_HAPPY", value: "Very happy"},
  {key: "HAPPY", value: "Happy"},
  {key: "NEUTRAL", value: "Neutral"},
  {key: "SAD", value: "Sad"},
  {key: "VERY_SAD", value: "Very sad"},
];

const SECOND_STEP_ANSWERS = [
  {key: "NINE", value: "+9"},
  {key: "SEVEN_EIGHT", value: "6-8"},
  {key: "FIVE_SIX", value: "5-6"},
  {key: "THREE_FOUR", value: "3-4"},
  {key: "ZERO_TWO", value: "0-2"},
];

const STEP_TEXTS = [
  "How was your mood today?",
  "How much sleep did you get last night?",
  "Any thoughts for today?",
];

export default function ModalFormComponent(props: ModalComponentProps) {

  const {theme} = useContext(ThemeContext);
  const { moodState } = useContext(MoodContext);
  
  const {mood, sleep, reflection, onChange, setFormValue} = useForm({
    mood: "",
    sleep: "",
    reflection: "",
  });
  const { moodFormState, resetMoodForm, handleNextStep } = useMoodForm({mood, sleep, reflection});

  const handleContinue = () => {
    handleNextStep(props.onClose);
  }

  const handleClose = async () => {
    resetMoodForm();
    setFormValue({
      mood: "",
      sleep: "",
      reflection: "",
    })
    props.onClose();
  };
  
  useEffect(() => {
    if (!props.visible && !moodState.todaysMood) return;
    const todayMood = moodState.todaysMood;
    if (todayMood) {
      setFormValue({
        mood: todayMood.mood,
        sleep: todayMood.sleep,
        reflection: todayMood.reflection || "",
      })
    }
  }, [props.visible])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={props.onClose}
    >
      <View className="flex flex-1 relative justify-center items-center z-20">
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 10,
          }}
          onPress={() => handleClose()}
        ></TouchableOpacity>
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.card,
          }}
          className="flex flex-col rounded-xl py-4 px-4 z-20"
        >
          <Text
            className="font-[Montserrat-bold] text-3xl text-center"
            style={{
              color: theme.colors.primary,
            }}
          >
            Log your mood
          </Text>
          <View className="flex flex-row gap-4 mt-6">
            <View
              className="flex flex-1 h-1"
              style={{
                backgroundColor:
                  moodFormState.currentStep === 0 ? "#20214f" : theme.colors.background,
              }}
            ></View>
            <View
              className="flex flex-1 h-1"
              style={{
                backgroundColor:
                  moodFormState.currentStep === 1 ? "#20214f" : theme.colors.background,
              }}
            ></View>
            <View
              className="flex flex-1 h-1"
              style={{
                backgroundColor:
                  moodFormState.currentStep === 2 ? "#20214f" : theme.colors.background,
              }}
            ></View>
          </View>
          <Text
            className={`font-[Montserrat-regular] text-center mt-6 text-2xl`}
            style={{
              color: moodFormState.hasError ? "#ff0000" : theme.colors.primary,
            }}
          >
            {STEP_TEXTS[moodFormState.currentStep]}
          </Text>
          {moodFormState.currentStep === 0 && (
            <>
              {FIRST_STEP_ANSWERS.map((answer, key) => (
                <TouchableOpacity
                  className="mt-2"
                  onPress={() => onChange(answer.key, "mood")}
                  key={key}
                >
                  <View
                    className="flex flex-row py-4 px-4"
                    style={{
                      borderWidth: 1,
                      borderColor: mood === answer.key ? "grey" : "transparent",
                      backgroundColor: theme.colors.background,
                    }}
                  >
                    <Text
                      className="text-2xl font-[Montserrat-regular]"
                      style={{
                        color: theme.colors.primary,
                      }}
                    >
                      {answer.value}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
          {moodFormState.currentStep === 1 && (
            <>
              {SECOND_STEP_ANSWERS.map((answer, key) => (
                <TouchableOpacity
                  className="mt-2"
                  key={key}
                  onPress={() => onChange(answer.key, "sleep")}
                >
                  <View
                    className="flex flex-row py-4 px-4 bg-[#505194]"
                    style={{
                      borderWidth: 1,
                      borderColor:
                        sleep === answer.key ? "grey" : "transparent",
                      backgroundColor: theme.colors.background,
                    }}
                  >
                    <Text
                      className="text-2xl font-[Montserrat-regular]"
                      style={{
                        color: theme.colors.primary,
                      }}
                    >
                      {answer.value} hours
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
          {moodFormState.currentStep === 2 && (
            <View className="flex flex-row mt-4">
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                className="flex flex-1 text-2xl font-[Montserrat-regular]"
                style={{
                  color: theme.colors.primary,
                  backgroundColor: theme.colors.background,
                }}
                onChangeText={(value) => onChange(value, "reflection")}
                value={reflection}
                multiline
              />
            </View>
          )}
          <TouchableOpacity onPress={handleContinue}>
            <View className="flex flex-row py-4 px-4 bg-[#3a3a59] mt-4">
              <Text className="flex flex-1 text-2xl text-[#f5f5ff] font-[Montserrat-regular] text-center">
                {moodFormState.currentStep === 2 ? "Submit" : "Next"}
              </Text>
            </View>
          </TouchableOpacity>
          {moodFormState.isLoading && <ActivityIndicator className="mt-6" size="large" />}
        </View>
      </View>
    </Modal>
  );
}
