import ProtectedRoute from "@/components/shared/ProtectedRoute.component";
import { AuthContext } from "@/context/Auth.context";
import { ThemeContext } from "@/context/Theme.context";
import { useForm } from "@/hooks/useForm.hook";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { ActivityIndicator, Image, Platform, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";


export default function ProfileScreen() {

    const { theme } = useContext( ThemeContext );
    const { authState, requestResetPassword, logout, updateUser } = useContext( AuthContext );

    const { name, onChange } = useForm({
        name: authState.userData?.name
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isloading, setIsloading] = useState(false);

    const handleResetPassword = async() => {
        if (!authState.userData) return;
        const resetSuccessful = await requestResetPassword(authState.userData.email);
        if( Platform.OS === 'android' && resetSuccessful ) {
            ToastAndroid.show('Password was successfully reset', ToastAndroid.SHORT)
        }
    }

    const handleUpdate = async() => {
        if (!authState.userData) return;
        if( !name ) return;
        setIsloading(true);
        const updateSuccessful = await updateUser(name);
        if( Platform.OS === 'android' && updateSuccessful ) {
            ToastAndroid.show('Profile was successfully updated', ToastAndroid.SHORT)
        }
        setIsEditing(false);
        setIsloading(false);
    }

    return (
        <ProtectedRoute>
            <ScrollView>
                <View
                    className="flex flex-col items-center px-[25]"
                >
                    <View
                        className="w-44 h-44 mt-7 relative"
                    >
                        <Image
                            className="w-full h-full rounded-full"
                            source={{
                            uri: (authState?.userData?.photoUrl)
                                ? authState.userData.photoUrl
                                : "https://cdni.iconscout.com/illustration/premium/thumb/male-user-image-illustration-download-in-svg-png-gif-file-formats--person-picture-profile-business-pack-illustrations-6515860.png"
                            }}
                        />
                        <TouchableOpacity
                            className="absolute bottom-0 right-0 rounded-full p-2"
                            style={{
                                backgroundColor: theme.colors.card
                            }}
                            onPress={() => router.push('/camera')}
                        >
                            <Ionicons
                                name="camera"
                                size={24}
                                color={theme.colors.primary}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text
                        className="text-center text-sm mt-6 font-[Montserrat-regular]"
                        style={{
                            color: theme.colors.primary
                        }}
                    >
                        Account created on: { new Date(authState.userData?.createdAt || '').toLocaleDateString() }
                    </Text>
                    <View
                        className="flex flex-col w-full gap-2"
                    >
                        <Text
                            className="text-sm font-[Montserrat-regular] mt-10"
                            style={{
                                color: theme.colors.text
                            }}
                        >
                            Name
                        </Text>
                        <View
                            className="flex flex-1 flex-row border-b items-center px-2"
                            style={{
                                backgroundColor: theme.colors.card
                            }}
                        >  
                            <TextInput
                                autoCorrect={false}
                                autoCapitalize="none"
                                className="flex-1 text-lg font-[Montserrat-regular] py-2"
                                style={{
                                    color: theme.colors.primary,
                                }}
                                onChangeText={(value) => onChange(value, 'name')}
                                placeholderTextColor={theme.colors.text}
                                value={name}
                                editable={isEditing}
                            />
                            <TouchableOpacity
                                className="flex flex-row items-center h-full px-2"
                                onPress={() => setIsEditing(true)}
                            >
                                <Ionicons 
                                    name="pencil"
                                    size={18}
                                    color={theme.colors.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        {
                            (isEditing) && (
                                <TouchableOpacity
                                    onPress={() => handleUpdate()}
                                    className="flex flex-1 items-center justify-center rounded-xl mt-10 bg-blue-500 py-4"
                                >
                                    {
                                        (isloading) ? (
                                            <ActivityIndicator 
                                                size="small"
                                                color="white"
                                            />
                                        )
                                        : (
                                            <Text
                                                className="text-lg font-[Montserrat-bold] text-white"
                                            >
                                                Save changes
                                            </Text>
                                        )
                                    }
                                </TouchableOpacity>
                            )
                        }
                        <TouchableOpacity
                            onPress={() => handleResetPassword()}
                            className="flex flex-1 items-center justify-center rounded-xl mt-10 bg-blue-500 py-4"
                        >
                            <Text
                                className="text-lg font-[Montserrat-bold] text-white"
                            >
                                Reset password
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => logout()}
                            className="flex flex-1 items-center justify-center rounded-xl mt-2 bg-red-500 py-4"
                        >
                            <Text
                                className="text-lg font-[Montserrat-bold] text-white"
                            >
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ProtectedRoute>
    )
}