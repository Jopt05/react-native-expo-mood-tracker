import { Mood } from "@/apis/mood-tracker/interfaces";
import { MoodContext } from "@/context/Mood.context";
import { ThemeContext } from "@/context/Theme.context";
import { useForm } from "@/hooks/useForm.hook";
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
  const { createMood, moodState, updatemood } = useContext(MoodContext);

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {mood, sleep, reflection, onChange, setFormValue} = useForm({
    mood: "",
    sleep: "",
    reflection: "",
  });
  const [hasError, setHasError] = useState(false);

  const handleContinue = () => {
    if ((currentStep == 0 && !mood) || (currentStep == 1 && !sleep)) {
      setHasError(true);
      return;
    }
    setHasError(false);
    if (currentStep == 2) {
      if( moodState.todaysMood ) {
        handleUpdateMood();
      } else {
        handleCreateMood();
      }
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleUpdateMood = async() => {
    try {
      setIsLoading(true);
      await updatemood({mood, sleep, reflection, id: moodState.todaysMood!.id} as Mood);
      setIsLoading(false);
      setCurrentStep(0);
      props.onClose();
    } catch (error) {
      console.log("Ocurrió un error al editar mood");
      console.log(error);
      return;
    }
  }

  const handleCreateMood = async () => {
    try {
      setIsLoading(true);
      const isCreated = await createMood({mood, sleep, reflection} as Mood);
      setIsLoading(false);
      setCurrentStep(0);
      props.onClose();
    } catch (error) {
      console.log("Ocurrió un error al crear mood");
      console.log(error);
      return;
    }
  };

  const handleClose = async () => {
    setCurrentStep(0);
    setHasError(false);
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
                  currentStep === 0 ? "#20214f" : theme.colors.background,
              }}
            ></View>
            <View
              className="flex flex-1 h-1"
              style={{
                backgroundColor:
                  currentStep === 1 ? "#20214f" : theme.colors.background,
              }}
            ></View>
            <View
              className="flex flex-1 h-1"
              style={{
                backgroundColor:
                  currentStep === 2 ? "#20214f" : theme.colors.background,
              }}
            ></View>
          </View>
          <Text
            className={`font-[Montserrat-regular] text-center mt-6 text-2xl`}
            style={{
              color: hasError ? "#ff0000" : theme.colors.primary,
            }}
          >
            {STEP_TEXTS[currentStep]}
          </Text>
          {currentStep === 0 && (
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
          {currentStep === 1 && (
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
          {currentStep === 2 && (
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
                {currentStep === 2 ? "Submit" : "Next"}
              </Text>
            </View>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator className="mt-6" size="large" />}
        </View>
      </View>
    </Modal>
  );
}
