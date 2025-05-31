import { AuthContext } from "@/context/Auth.context";
import { useForm } from "@/hooks/useForm.hook";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {

    const { login, registerUser } = useContext( AuthContext );
    const router = useRouter();

    const [isRegistering, setIsRegistering] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [sucessMessage, setSetsuccessMessage] = useState("");
    const [isShowingPassord, setIsShowingPassord] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { email, name, password, onChange } = useForm({
        email: '',
        name: '',
        password: ''
    });

    function handleToggleRegister() {
        setIsRegistering(!isRegistering);
    }

    async function handleRegister() {
        if( !email ) {
            setErrorMessage("Email is required");
            return;
        }
        if( !password ) {
            setErrorMessage("Password is required");
            return;
        }
        if( password.length < 5 ) {
            setErrorMessage("Password must be at least 5 characters");
            return;
        } 
        if( !name ) {
            setErrorMessage("Name is required");
            return;
        }
        setIsLoading(true);
        const isRegistered = await registerUser({email, password, name});
        if( isRegistered ) {
            setErrorMessage("");
            setSetsuccessMessage("Registered in successfully");
            const isLoggedIn = await login({email, password});
            if( isLoggedIn ) {
                setErrorMessage("");
                router.replace("/home");
                return;
            }; 
            setIsLoading(false);
            return;
        };
        setIsLoading(false);
    }

    async function handeLogin() {
        if( !email ) {
            setErrorMessage("Email is required");
            return;
        }
        if( !password ) {
            setErrorMessage("Password is required");
            return;
        }
        setIsLoading(true);
        const isLoggedIn = await login({email, password});
        if( isLoggedIn ) {
            setSetsuccessMessage("Logged in successfully");
            setErrorMessage("");
            router.replace("/home");
            return;
        };
        setErrorMessage("Invalid credentials");
        setIsLoading(false);
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
                        { (isRegistering) ? 'Register' : 'Login' }
                    </Text>
                    <Text
                        className="text-[#f5f5ff] font-[Montserrat-regular] text-sm mb-2"
                    >
                        Email
                    </Text>
                    <TextInput 
                        className="bg-[#505194] rounded-sm py-2 px-4 mt-2 font-[Montserrat-regular] text-[#f5f5ff] mb-6"
                        placeholder="Your email here"
                        autoCapitalize="none"
                        placeholderTextColor="#f5f5ff"
                        value={email}
                        onChangeText={(value) => onChange(value, 'email')}
                    />
                    {
                        (isRegistering) && (
                            <>
                                <Text
                                    className="text-[#f5f5ff] font-[Montserrat-regular] text-sm mb-2"
                                >
                                    Name
                                </Text>
                                <TextInput 
                                    className="bg-[#505194] rounded-sm py-2 px-4 mt-2 font-[Montserrat-regular] text-[#f5f5ff] mb-8"
                                    placeholder="Your name here"
                                    autoCapitalize="none"
                                    placeholderTextColor="#f5f5ff"
                                    value={name}
                                    onChangeText={(value) => onChange(value, 'name')}
                                />
                            </>
                        )
                    }
                    <Text
                        className="text-[#f5f5ff] font-[Montserrat-regular] text-sm mb-2"
                    >
                        Password
                    </Text>
                    <View
                        className="flex flex-row items-center px-4 bg-[#505194] rounded-sm mb-4"
                    >
                        <TextInput 
                            className="flex flex-1 py-2 font-[Montserrat-regular] text-[#f5f5ff]"
                            placeholder="Your password here"
                            autoCapitalize="none"
                            secureTextEntry={ (isShowingPassord) ? false : true }
                            placeholderTextColor="#f5f5ff"
                            value={password}
                            onChangeText={(value) => onChange(value, 'password')}
                        />
                        <TouchableOpacity
                            onPress={ () => setIsShowingPassord(!isShowingPassord) }
                        >
                            <Ionicons 
                                name={ (isShowingPassord) ? 'eye' : "eye-off-outline" }
                                color={"#f5f5ff"}
                                size={15}
                            />
                        </TouchableOpacity>
                    </View>
                    {
                        (errorMessage !== "") && (
                            <Text
                                className="text-red-600 font-[Montserrat-regular] text-sm my-4 text-center"
                            >
                                {  errorMessage }
                            </Text>
                        )
                    }
                    {
                        (sucessMessage !== "") && (
                            <Text
                                className="text-green-600 font-[Montserrat-regular] text-sm my-4 text-center"
                            >
                                {  sucessMessage }
                            </Text>
                        )
                    }
                    <TouchableOpacity
                        className="flex flex-row justify-center items-center mb-4"
                        onPress={ (isRegistering) ? handleRegister : handeLogin }
                    >
                        <View
                            className="py-2 px-10 bg-[#505194] rounded-sm"
                        >
                            <Text
                                className="text-[#f5f5ff] font-[Montserrat-bold] text-xl"
                            >
                                { (isRegistering) ? 'Register' : 'Login' }
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View
                        className="flex flex-row justify-between items-center"
                    >
                        <TouchableOpacity
                            className="flex flex-row mt-2"
                            onPress={handleToggleRegister}
                            style={{
                                width: '40%'
                            }}
                        >
                            <View
                            >
                                <Text
                                    className="text-[#f5f5ff] font-[Montserrat-regular] text-sm underline"
                                >
                                    { (isRegistering) ? 'Already have an account?' : 'Don\'t have an account?' } 
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex flex-row mt-2"
                            style={{
                                width: '40%'
                            }}
                            onPress={() => { router.navigate('/reset-password') }}
                        >
                            <View
                            >
                                <Text
                                    className="text-[#f5f5ff] font-[Montserrat-regular] text-sm underline text-right"
                                >
                                    Forgot your password?
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        (isLoading) && (
                            <ActivityIndicator 
                                className="mt-6"
                                size="small"
                            />
                        )
                    }
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}