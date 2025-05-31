import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { useForm } from "@/hooks/useForm.hook";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ResetPasswordPage() {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [sucessMessage, setSetsuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { email, onChange } = useForm({
        email: ''
    })

    const handleSubmit = async() => {
        try {
            if( !email ) {
                setErrorMessage("Email is required");
                return;
            }
            setIsLoading(true);
            const { data } = await moodTrackedApi.post('users/auth/reset-password', {email});
            setErrorMessage("");
            setSetsuccessMessage("Email sent");
            setIsLoading(false);
            setTimeout(() => {
                router.navigate('/login')
            }, 1000);
        } catch (error) {
            if( error instanceof AxiosError ) {
                setErrorMessage(error.response?.data?.error);
                setIsLoading(false);
                return;
            }
            console.log(error) 
        }
    }

    return(
        <KeyboardAvoidingView
            behavior="padding"
            className="flex flex-1 justify-center items-center"
        >
            <View
                className="flex flex-col w-80 bg-[#44446f] rounded-sm"
            >
                <View
                    className="flex flex-col py-4 px-4"
                >
                    <Text
                        className="text-[#f5f5ff] font-[Montserrat-bold] text-2xl text-center mb-4"
                    >
                        Reset your password
                    </Text>
                    <Text
                        className="text-[#f5f5ff] font-[Montserrat-regular] text-sm mb-2"
                    >
                        Email
                    </Text>
                    <TextInput 
                        className="bg-[#505194] rounded-sm py-2 px-4 mt-2 font-[Montserrat-regular] text-[#f5f5ff]"
                        placeholder="Your email here"
                        autoCapitalize="none"
                        placeholderTextColor="#f5f5ff"
                        value={email}
                        onChangeText={(value) => onChange(value, 'email')}
                    />
                </View>
                {
                    (errorMessage !== "") && (
                        <Text
                            className="text-red-400 font-[Montserrat-regular] text-sm my-2 text-center"
                        >
                            {  errorMessage }
                        </Text>
                    )
                }
                {
                    (sucessMessage !== "") && (
                        <Text
                            className="text-green-600 font-[Montserrat-regular] text-sm my-2 text-center"
                        >
                            {  sucessMessage }
                        </Text>
                    )
                }
                <TouchableOpacity
                    className="flex flex-row justify-center items-center mb-4"
                    onPress={() => handleSubmit()}
                >
                    <View
                        className="py-2 px-10 bg-[#505194] rounded-sm"
                    >
                        <Text
                            className="text-[#f5f5ff] font-[Montserrat-bold] text-xl"
                        >
                            Confirm
                        </Text>
                    </View>
                </TouchableOpacity>
                {
                    (isLoading) && (
                        <ActivityIndicator 
                            className="mt-6 mb-6"
                            size="small"
                        />
                    )
                }
            </View>
        </KeyboardAvoidingView>
    )
}