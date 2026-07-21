import { Mood } from "@/apis/mood-tracker/interfaces";
import { MoodContext } from "@/context/Mood.context";
import { ThemeContext } from "@/context/Theme.context";
import { useForm } from "@/hooks/useForm.hook";
import { useMoodForm } from "@/hooks/useMoodForm.hook";
import { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
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

const MOOD_ICONS: Record<string, ReturnType<typeof require>> = {
  VERY_HAPPY: require("../../assets/images/very_happy.png"),
  HAPPY: require("../../assets/images/happy.png"),
  NEUTRAL: require("../../assets/images/neutral.png"),
  SAD: require("../../assets/images/sad.png"),
  VERY_SAD: require("../../assets/images/very_sad.png"),
};

const FIRST_STEP_ANSWERS = [
  { key: "VERY_HAPPY", value: "Very happy" },
  { key: "HAPPY", value: "Happy" },
  { key: "NEUTRAL", value: "Neutral" },
  { key: "SAD", value: "Sad" },
  { key: "VERY_SAD", value: "Very sad" },
];

const SECOND_STEP_ANSWERS = [
  { key: "NINE", value: "+9" },
  { key: "SEVEN_EIGHT", value: "7-8" },
  { key: "FIVE_SIX", value: "5-6" },
  { key: "THREE_FOUR", value: "3-4" },
  { key: "ZERO_TWO", value: "0-2" },
];

const STEP_TEXTS = [
  "How was your mood today?",
  "How much sleep did you get last night?",
  "Any thoughts for today?",
];

const ERROR_TEXTS = [
  "Please select your mood",
  "Please select your sleep hours",
  "",
];

export default function MoodFormComponent(props: ModalComponentProps) {
  const { theme } = useContext(ThemeContext);
  const { moodState } = useContext(MoodContext);

  const { mood, sleep, reflection, onChange, setFormValue } = useForm({
    mood: "",
    sleep: "",
    reflection: "",
  });
  const { moodFormState, resetMoodForm, handleNextStep, handlePrevStep } =
    useMoodForm({ mood, sleep, reflection });

  const handleContinue = () => {
    handleNextStep(props.onClose);
  };

  const handleBack = () => {
    handlePrevStep();
  };

  const handleClose = () => {
    resetMoodForm();
    setFormValue({ mood: "", sleep: "", reflection: "" });
    props.onClose();
  };

  useEffect(() => {
    if (!props.visible) return;
    const todayMood = moodState.todaysMood;
    if (todayMood) {
      setFormValue({
        mood: todayMood.mood,
        sleep: todayMood.sleep,
        reflection: todayMood.reflection || "",
      });
    }
  }, [props.visible, moodState.todaysMood]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={handleClose}
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
          onPress={handleClose}
        />
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.card,
          }}
          className="flex flex-col rounded-xl py-5 px-5 z-20"
        >
          <Text
            className="font-[Montserrat-bold] text-3xl text-center"
            style={{ color: theme.colors.primary }}
          >
            Log your mood
          </Text>

          {/* Progress bar */}
          <View className="flex flex-row gap-2 mt-5">
            {[0, 1, 2].map((step) => (
              <View
                key={step}
                className="flex flex-1 h-1 rounded-full"
                style={{
                  backgroundColor:
                    step <= moodFormState.currentStep
                      ? theme.colors.notification
                      : theme.colors.background,
                }}
              />
            ))}
          </View>

          {/* Step question */}
          <Text
            className="font-[Montserrat-regular] text-center mt-5 text-xl"
            style={{ color: theme.colors.primary }}
          >
            {STEP_TEXTS[moodFormState.currentStep]}
          </Text>

          {/* Error message */}
          {moodFormState.hasError && (
            <Text
              className="font-[Montserrat-regular] text-center mt-2 text-sm"
              style={{ color: "#ff6b6b" }}
            >
              {ERROR_TEXTS[moodFormState.currentStep]}
            </Text>
          )}

          {/* Step 1: Mood selection */}
          {moodFormState.currentStep === 0 && (
            <View className="mt-3">
              {FIRST_STEP_ANSWERS.map((answer) => {
                const isSelected = mood === answer.key;
                return (
                  <TouchableOpacity
                    className="mt-2"
                    onPress={() => onChange(answer.key, "mood")}
                    key={answer.key}
                  >
                    <View
                      className="flex flex-row items-center py-3 px-4 rounded-lg"
                      style={{
                        borderWidth: 2,
                        borderColor: isSelected
                          ? theme.colors.notification
                          : "transparent",
                        backgroundColor: theme.colors.background,
                      }}
                    >
                      <Image
                        source={MOOD_ICONS[answer.key]}
                        style={{ width: 28, height: 28, marginRight: 12 }}
                      />
                      <Text
                        className="text-lg font-[Montserrat-regular]"
                        style={{ color: theme.colors.primary }}
                      >
                        {answer.value}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Step 2: Sleep selection */}
          {moodFormState.currentStep === 1 && (
            <View className="mt-3">
              {SECOND_STEP_ANSWERS.map((answer) => {
                const isSelected = sleep === answer.key;
                return (
                  <TouchableOpacity
                    className="mt-2"
                    onPress={() => onChange(answer.key, "sleep")}
                    key={answer.key}
                  >
                    <View
                      className="flex flex-row items-center py-3 px-4 rounded-lg"
                      style={{
                        borderWidth: 2,
                        borderColor: isSelected
                          ? theme.colors.notification
                          : "transparent",
                        backgroundColor: theme.colors.background,
                      }}
                    >
                      <Text
                        className="text-lg font-[Montserrat-regular]"
                        style={{ color: theme.colors.primary }}
                      >
                        {answer.value} hours
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Step 3: Reflection */}
          {moodFormState.currentStep === 2 && (
            <View className="mt-4">
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Write your thoughts here..."
                placeholderTextColor={theme.colors.text}
                className="text-lg font-[Montserrat-regular] rounded-lg py-3 px-4"
                style={{
                  color: theme.colors.primary,
                  backgroundColor: theme.colors.background,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
                onChangeText={(value) => onChange(value, "reflection")}
                value={reflection}
                multiline
              />
            </View>
          )}

          {/* Action buttons */}
          <View className="flex flex-row gap-3 mt-5">
            {moodFormState.currentStep > 0 && (
              <TouchableOpacity
                onPress={handleBack}
                className="flex-1"
              >
                <View
                  className="py-3 px-4 rounded-lg items-center"
                  style={{
                    backgroundColor: theme.colors.background,
                  }}
                >
                  <Text
                    className="text-lg font-[Montserrat-regular]"
                    style={{ color: theme.colors.primary }}
                  >
                    Back
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleContinue}
              className="flex-1"
            >
              <View
                className="py-3 px-4 rounded-lg items-center"
                style={{
                  backgroundColor: theme.colors.notification,
                }}
              >
                <Text className="text-lg font-[Montserrat-regular] text-white">
                  {moodFormState.currentStep === 2 ? "Submit" : "Next"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {moodFormState.isLoading && (
            <ActivityIndicator className="mt-4" size="large" />
          )}
        </View>
      </View>
    </Modal>
  );
}
