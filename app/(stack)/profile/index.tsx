import ProtectedRoute from "@/components/shared/ProtectedRoute.component";
import { AuthContext } from "@/context/Auth.context";
import { CameraContext } from "@/context/Camera.context";
import { ThemeContext } from "@/context/Theme.context";
import { useForm } from "@/hooks/useForm.hook";
import { useToast } from "@/hooks/useToast.hook";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function ProfileScreen() {

    const { theme } = useContext( ThemeContext );
    const { authState, requestResetPassword, logout, updateUser } = useContext( AuthContext );
    const { cameraState, resetImage, saveImage } = useContext( CameraContext );
    const { showToast } = useToast();

    const { name, onChange } = useForm({
        name: authState.userData?.name
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isloading, setIsloading] = useState(false);

    useEffect(() => {
      if( !cameraState.image ) return; 
      setIsEditing(true);
      onChange(authState.userData!.name, 'name');
    }, [cameraState])

    const handleResetPassword = async() => {
        if (!authState.userData) return;
        const resetSuccessful = await requestResetPassword(authState.userData.email);
        if( resetSuccessful ) {
            showToast({ message: "Password reset email sent ✓", type: "success" });
        }
    }

    const handleUpdate = async() => {
        if (!authState.userData) return;
        if( !name ) return;
        setIsloading(true);
        const updateSuccessful = await updateUser(name, cameraState.image);
        if( updateSuccessful ) {
            showToast({ message: "Profile updated ✓", type: "success" });
        }
        setIsEditing(false);
        setIsloading(false);
        resetImage();
    }

    const handleChangePP = async() => {
        router.push('/camera');
    }
    
    const handleCancelEdit = () => {
        resetImage();
        setIsEditing(false);
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
                        {
                            (!cameraState.image) && (
                                <Image
                                    className="w-full h-full rounded-full"
                                    source={{
                                    uri: (authState?.userData?.photoUrl)
                                        ? authState.userData.photoUrl
                                        : "https://cdni.iconscout.com/illustration/premium/thumb/male-user-image-illustration-download-in-svg-png-gif-file-formats--person-picture-profile-business-pack-illustrations-6515860.png"
                                    }}
                                />
                            )
                        }
                        {
                            (cameraState.image) && (
                                <Image
                                    className="w-full h-full rounded-full"
                                    source={{
                                    uri: cameraState.image
                                    }}
                                />
                            )
                        }
                        <TouchableOpacity
                            className="absolute bottom-0 right-0 rounded-full p-2"
                            style={{
                                backgroundColor: theme.colors.card
                            }}
                            onPress={() => handleChangePP()}
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
                        className="flex flex-col w-full mt-6"
                    >
                        {/* Email (read-only) */}
                        <Text
                            className="text-xs font-[Montserrat-regular] mb-1"
                            style={{ color: theme.colors.text }}
                        >
                            Email
                        </Text>
                        <View
                            className="flex flex-row items-center px-4 py-3 rounded-lg mb-4"
                            style={{ backgroundColor: theme.colors.background }}
                        >
                            <Ionicons name="mail-outline" size={16} color={theme.colors.text} />
                            <Text
                                className="flex-1 text-base font-[Montserrat-regular] ml-2"
                                style={{ color: theme.colors.text }}
                            >
                                {authState.userData?.email}
                            </Text>
                        </View>

                        {/* Name */}
                        <Text
                            className="text-xs font-[Montserrat-regular] mb-1"
                            style={{ color: theme.colors.text }}
                        >
                            Name
                        </Text>
                        <View
                            className="flex flex-row items-center px-4 py-1 rounded-lg"
                            style={{
                                backgroundColor: theme.colors.background,
                                borderWidth: isEditing ? 1.5 : 0,
                                borderColor: isEditing ? theme.colors.notification : "transparent",
                            }}
                        >
                            <Ionicons name="person-outline" size={16} color={theme.colors.text} />
                            <TextInput
                                autoCorrect={false}
                                autoCapitalize="none"
                                className="flex-1 text-base font-[Montserrat-regular] ml-2 py-2"
                                style={{ color: theme.colors.primary }}
                                onChangeText={(value) => onChange(value, 'name')}
                                placeholderTextColor={theme.colors.text}
                                value={name}
                                editable={isEditing}
                            />
                        </View>

                        {/* Edit profile button */}
                        {!isEditing && (
                            <TouchableOpacity
                                onPress={() => setIsEditing(true)}
                                className="flex flex-row items-center justify-center gap-2 rounded-lg mt-4 py-3"
                                style={{ backgroundColor: theme.colors.notification }}
                            >
                                <Ionicons name="pencil" size={16} color="white" />
                                <Text className="text-base font-[Montserrat-bold] text-white">
                                    Edit profile
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Save / Cancel (editing mode) */}
                        {isEditing && (
                            <View className="flex flex-row gap-3 mt-4">
                                <TouchableOpacity
                                    onPress={() => handleCancelEdit()}
                                    className="flex-1 items-center justify-center rounded-lg py-3"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: theme.colors.text,
                                    }}
                                >
                                    <Text
                                        className="text-base font-[Montserrat-regular]"
                                        style={{ color: theme.colors.primary }}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleUpdate()}
                                    className="flex-1 items-center justify-center rounded-lg py-3"
                                    style={{ backgroundColor: theme.colors.notification }}
                                >
                                    {isloading ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Text className="text-base font-[Montserrat-bold] text-white">
                                            Save changes
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Reset password */}
                        <TouchableOpacity
                            onPress={() => handleResetPassword()}
                            className="flex flex-row items-center justify-center gap-2 rounded-lg mt-6 py-3"
                            style={{ backgroundColor: theme.colors.background }}
                        >
                            <Ionicons name="lock-closed-outline" size={16} color={theme.colors.primary} />
                            <Text
                                className="text-base font-[Montserrat-regular]"
                                style={{ color: theme.colors.primary }}
                            >
                                Reset password
                            </Text>
                        </TouchableOpacity>

                        {/* Logout */}
                        <TouchableOpacity
                            onPress={() => logout()}
                            className="flex flex-row items-center justify-center gap-2 rounded-lg mt-3 mb-8 py-3"
                            style={{
                                borderWidth: 1,
                                borderColor: "#ff6b6b",
                            }}
                        >
                            <Ionicons name="log-out-outline" size={16} color="#ff6b6b" />
                            <Text
                                className="text-base font-[Montserrat-regular]"
                                style={{ color: "#ff6b6b" }}
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