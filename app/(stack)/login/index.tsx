import { AuthContext } from "@/context/Auth.context";
import { ThemeContext } from "@/context/Theme.context";
import { useForm } from "@/hooks/useForm.hook";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {

    const { login, registerUser } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
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
            setTimeout(() => {
               router.replace("/home"); 
            }, 500);
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
                className="flex flex-col w-80 rounded-sm"
                style={{
                    backgroundColor: theme.colors.card
                }}
            >
                <View
                    className="flex flex-col py-4 px-4"
                >
                    <Text
                        className="font-[Montserrat-bold] text-2xl text-center mb-4"
                        style={{
                            color: theme.colors.primary
                        }}
                    >
                        { (isRegistering) ? 'Register' : 'Login' }
                    </Text>
                    <Text
                        className="font-[Montserrat-regular] text-sm mb-2"
                        style={{
                            color: theme.colors.primary
                        }}
                    >
                        Email
                    </Text>
                    <TextInput 
                        className="rounded-sm py-2 px-4 mt-2 font-[Montserrat-regular] mb-6"
                        style={{
                            color: theme.colors.primary,
                            backgroundColor: theme.colors.background
                        }}
                        placeholder="Your email here"
                        autoCapitalize="none"
                        placeholderTextColor={theme.colors.text}
                        value={email}
                        onChangeText={(value) => onChange(value, 'email')}
                    />
                    {
                        (isRegistering) && (
                            <>
                                <Text
                                    className="font-[Montserrat-regular] text-sm mb-2"
                                    style={{
                                        color: theme.colors.primary
                                    }}
                                >
                                    Name
                                </Text>
                                <TextInput 
                                    className="rounded-sm py-2 px-4 mt-2 font-[Montserrat-regular] mb-8"
                                    style={{
                                        color: theme.colors.primary,
                                        backgroundColor: theme.colors.background
                                    }}
                                    placeholder="Your name here"
                                    autoCapitalize="none"
                                    placeholderTextColor={theme.colors.text}
                                    value={name}
                                    onChangeText={(value) => onChange(value, 'name')}
                                />
                            </>
                        )
                    }
                    <Text
                        className="font-[Montserrat-regular] text-sm mb-2"
                        style={{
                            color: theme.colors.primary
                        }}
                    >
                        Password
                    </Text>
                    <View
                        className="flex flex-row items-center px-4 rounded-sm mb-4"
                        style={{
                            backgroundColor: theme.colors.background
                        }}
                    >
                        <TextInput 
                            className="flex flex-1 py-2 font-[Montserrat-regular]"
                            style={{
                                color: theme.colors.primary
                            }}
                            placeholder="Your password here"
                            autoCapitalize="none"
                            secureTextEntry={ (isShowingPassord) ? false : true }
                            placeholderTextColor={theme.colors.text}
                            value={password}
                            onChangeText={(value) => onChange(value, 'password')}
                        />
                        <TouchableOpacity
                            onPress={ () => setIsShowingPassord(!isShowingPassord) }
                        >
                            <Ionicons 
                                name={ (isShowingPassord) ? 'eye' : "eye-off-outline" }
                                color={theme.colors.text}
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
                            className="py-2 px-10 rounded-sm"
                            style={{
                                backgroundColor: theme.colors.notification
                            }}
                        >
                            <Text
                                className="font-[Montserrat-bold] text-xl"
                                style={{
                                    color: (theme.dark) ? theme.colors.primary : 'white'
                                }}
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
                                    className="font-[Montserrat-regular] text-sm underline"
                                    style={{
                                        color: theme.colors.primary
                                    }}
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
                                    className="font-[Montserrat-regular] text-sm underline text-right"
                                    style={{
                                        color: theme.colors.primary
                                    }}
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