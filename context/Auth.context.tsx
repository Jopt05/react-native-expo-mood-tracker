import { LoginProps, LoginResponse, RegisterProps } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createContext, useEffect, useState } from "react";

export interface AuthState {
    isLoggedIn: boolean;
    userData: any;
    token?: string;
}

export const initialAuthState: AuthState = {
    isLoggedIn: false,
    userData: null,
}

export interface AuthContextProps {
    authState: AuthState;
    login: (loginData: LoginProps) => Promise<Boolean>;
    registerUser: (registerData: RegisterProps) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {

    const router = useRouter();
    const [authState, setauthState] = useState(initialAuthState);

    useEffect(() => {
        getCurrentUser()
    }, [])
    
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
                userData: data.payload
            })
            router.replace("/home");
        } catch (error) {
            console.log(error)
            console.log(`Ocurrio un error en getCurrentUser: ${error}`)
            setauthState({
                isLoggedIn: false,
                userData: null
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
                userData: null,
                token: data.payload.token
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
            userData: null,
            token: undefined
        })
        router.replace("/login");
    }

    return (
        <AuthContext.Provider
            value={{
                authState: authState,
                login,
                registerUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}