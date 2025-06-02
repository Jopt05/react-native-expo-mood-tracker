import { LoginProps, LoginResponse, RegisterProps, UserPayload } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { getItemFromAsyncStorage, removeItemFromAsyncStorage, setItemToAsyncStorage } from "@/utils/asyncstorage";
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
    isLoadingAuthState: false,
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
    
    useEffect(() => {
      validateAuth()
    }, [])
    
    const validateAuth = async() => {
        if( authState.isLoadingAuthState || authState.isLoggedIn ) return; 
        console.log('Validando auth de usuario')
        try {
            setauthState({
                isLoggedIn: false,
                isLoadingAuthState: true,
            })
            const token = await getItemFromAsyncStorage('authToken');
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
            await setItemToAsyncStorage('authToken', data.payload.token);
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

    const logout = async() => {
        await removeItemFromAsyncStorage('authToken');
        setauthState({
            isLoggedIn: false,
            token: undefined,
            isLoadingAuthState: false
        })
        router.replace("/login");
    }
    

    return (
        <AuthContext.Provider
            value={{
                authState: authState,
                login,
                registerUser,
                logout,
                getCurrentUser: validateAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}