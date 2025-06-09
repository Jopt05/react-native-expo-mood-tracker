import { LoginProps, LoginResponse, RegisterProps, UserPayload } from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import { getItemFromAsyncStorage, removeItemFromAsyncStorage, setItemToAsyncStorage } from "@/utils/asyncstorage";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { createContext, useState } from "react";

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
    validateAuth: () => Promise<void>;
    requestResetPassword: (userEmail: string) => Promise<boolean>;
    updateUser: (name: string) => Promise<boolean>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {

    const router = useRouter();
    const [authState, setauthState] = useState(initialAuthState);

    const validateAuth = async() => {
        console.log('Validando auth de usuario')
        setauthState({
            ...authState,
            isLoadingAuthState: true,
        })
        const token = await getItemFromAsyncStorage('authToken');
        if( !token ) {
            setauthState({
                isLoggedIn: false,
                isLoadingAuthState: false,
            })
            return;
        }
        try {
            const { data } = await moodTrackedApi.get('/users', { headers: { 'Authorization': `Bearer ${token}` }});
            setauthState({
                ...authState,
                isLoggedIn: true,
                isLoadingAuthState: false,
            })
            console.log('Auth vigente')
        } catch (error) {
            console.log('Error al validar auth')
            console.log(error)
            setauthState({
                isLoggedIn: false,
                isLoadingAuthState: false,
            })
        }
    }
    
    const getUserInfo = async() => {
        console.log('Obteniendo información de usuario')
        setauthState({
            ...authState,
            isLoadingAuthState: true,
        })
        try {
            const token = await getItemFromAsyncStorage('authToken');
            if( !token ) {
                console.log('No existe token en storage')
                setauthState({
                    isLoggedIn: false,
                    isLoadingAuthState: false,
                })
                return;
            }
            const { data } = await moodTrackedApi.get('/users', { headers: { 'Authorization': `Bearer ${token}` }});
            setauthState({
                ...authState,
                isLoggedIn: true,
                userData: data.payload,
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

    const updateUser = async(name: string) => {
        try {
            const token = await getItemFromAsyncStorage('authToken');
            if( !token ) {
                console.log('No existe token en storage')
                return false;
            }
            const { data } = await moodTrackedApi.put('/users', { name }, { headers: { 'Authorization': `Bearer ${token}` }});
            console.log('Usuario actualizado')
            return true;
        } catch (error) {
            console.log(`Ocurrio un error en updateUser: ${error}`)
            console.log(error)
            return false;
        }
    }

    const login = async (loginData: LoginProps) => {
        try {
            const { data } = await moodTrackedApi.post<LoginResponse>('/users/login', loginData);
            await setItemToAsyncStorage('authToken', data.payload.token);
            setauthState({
                ...authState,
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
                validateAuth,
                requestResetPassword,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}