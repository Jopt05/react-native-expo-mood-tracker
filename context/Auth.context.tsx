import { LoginProps, LoginResponse, RegisterProps, UserPayload } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    getCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {

    const router = useRouter();
    const [authState, setauthState] = useState(initialAuthState);
    
    const getCurrentUser = async() => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if( !token ) {
                router.replace("/login");
                return;
            }
            const { data } = await moodTrackedApi.get('/users', { headers: { 'Authorization': `Bearer ${token}` }});
            setauthState({
                isLoggedIn: true,
                userData: data.payload,
                isLoadingAuthState: false,
            })
            router.replace('/')
        } catch (error) {
            console.log(`Ocurrio un error en getCurrentUser: ${error}`)
            console.log(error)
            setauthState({
                isLoggedIn: false,
                isLoadingAuthState: false,
            })
            router.replace("/login");
        }
    
    }

    const login = async (loginData: LoginProps) => {
        try {
            const { data } = await moodTrackedApi.post<LoginResponse>('/users/login', loginData);
            await AsyncStorage.setItem('authToken', data.payload.token);
            setauthState({
                isLoggedIn: true,
                token: data.payload.token,
                isLoadingAuthState: false
            })
            return true;
        } catch (error) {
            console.log(`Ocurrio error en login: ${error}`);
            return false
        }
    }

    const registerUser = async(registerData: RegisterProps) => {
        try {
            const { data } = await moodTrackedApi.post('/users', registerData);
            return true;
        } catch (error) {
            console.log(`Ocurrio un error en register: ${error}`)
            return false;
        }
   
    }

    const logout = () => {
        AsyncStorage.removeItem('authToken');
        setauthState({
            isLoggedIn: false,
            token: undefined,
            isLoadingAuthState: false
        })
        router.replace("/login");
    }

    useEffect(() => {
      getCurrentUser()
    }, [])
    

    return (
        <AuthContext.Provider
            value={{
                authState: authState,
                login,
                registerUser,
                logout,
                getCurrentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}