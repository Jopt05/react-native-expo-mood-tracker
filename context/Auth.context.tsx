import { LoginProps, RegisterProps, UserPayload } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi, { createUser, getUser, loginUser, updateUser } from "@/apis/mood-tracker/mood-tracker.api";
import { removeItemFromAsyncStorage } from "@/utils/asyncstorage";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { createContext, useEffect, useState } from "react";

export interface AuthState {
    isLoggedIn: boolean;
    userData?: UserPayload;
    token?: string;
    isLoadingAuthState: boolean;
}

export const initialAuthState: AuthState = {
    isLoggedIn: false,
    isLoadingAuthState: true,
}

export interface AuthContextProps {
    authState: AuthState;
    login: (loginData: LoginProps) => Promise<Boolean>;
    registerUser: (registerData: RegisterProps) => Promise<boolean>;
    logout: () => void;
    getUserInfo: () => Promise<void>;
    requestResetPassword: (userEmail: string) => Promise<boolean>;
    updateUser: (name: string, imagePath: string) => Promise<boolean>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {

    const router = useRouter();
    const [authState, setauthState] = useState(initialAuthState);

    useEffect(() => {
      getUserInfo();
    }, [])

    useEffect(() => {
      console.log(authState)
    }, [authState])
    
    const getUserInfo = async() => {
        setauthState({
            isLoadingAuthState: true,
            isLoggedIn: false,
        })
        console.log('Obteniendo información de usuario')
        try {
            const userData = await getUser();
            if( !userData ) {
                setauthState({
                    isLoggedIn: false,
                    isLoadingAuthState: false,
                })
                return
            };
            setauthState({
                isLoggedIn: true,
                userData: userData,
                isLoadingAuthState: false,
            })
            console.log('Información obtenida')
        } catch (error) {
            console.log(`Ocurrio un error en getCurrentUser: ${error}`)
            console.log(error)
            setauthState({
                isLoggedIn: false,
                isLoadingAuthState: false,
            })
        }
    }

    const updateUserInfo = async(name: string, imagePath?: string) => {
        try {
            const updatedData = await updateUser(name, imagePath);
            if( !updatedData ) return false;
            setauthState({
                isLoadingAuthState: false,
                isLoggedIn: true,
                userData: updatedData
            })
            console.log('Usuario actualizado')
            return true;
        } catch (error) {
            console.log(`Ocurrio un error en updateUser: ${error}`)
            console.log(error)
            return false;
        }
    }

    const login = async(loginData: LoginProps) => {
        try {
            const loginPayload = await loginUser(loginData);
            setauthState(prev => ({
                ...prev,
                isLoggedIn: true,
                token: loginPayload.token,
                isLoadingAuthState: false
            }))
            return true;
        } catch (error) {
            console.log(`Ocurrio error en login: ${error}`);
            return false
        }
    }

    const registerUser = async(registerData: RegisterProps) => {
        try {
            const userData = await createUser(registerData);
            if( !userData ) return false;
            setauthState({
                isLoggedIn: true,
                userData: userData,
                isLoadingAuthState: false
            })
            return true;
        } catch (error) {
            console.log(`Ocurrio un error en register: ${error}`)
            return false;
        }
   
    }

    const logout = async() => {
        await removeItemFromAsyncStorage('authToken');
        setauthState({
            isLoggedIn: false,
            isLoadingAuthState: false
        })
        router.replace("/login");
    }
    
    const requestResetPassword = async(email: string) => {
        try {
            console.log('Solicitando request de password')
            const { data } = await moodTrackedApi.post('/users/auth/reset-password', { email });
            return true;
        } catch (error: any | AxiosError) {
            console.log('Ocurrió un error al solicitar request de password')
            console.log(error)
            if( error instanceof AxiosError ) {
                console.log( error.response?.data )
            }
            return false;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                authState: authState,
                login,
                registerUser,
                logout,
                getUserInfo,
                requestResetPassword,
                updateUser: updateUserInfo
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}