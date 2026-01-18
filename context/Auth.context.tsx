import {
  GetUserResponse,
  LoginProps,
  LoginResponse,
  RegisterProps,
  UserPayload,
} from "@/apis/mood-tracker/interfaces";
import moodTrackedApi from "@/apis/mood-tracker/mood-tracker.api";
import {
  getItemFromAsyncStorage,
  removeItemFromAsyncStorage,
  setItemToAsyncStorage,
} from "@/utils/asyncstorage";
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
};

export interface AuthContextProps {
  authState: AuthState;
  getUserData: () => Promise<void>;
  login: (loginData: LoginProps) => Promise<void>;
  registerUser: (registerData: RegisterProps) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (name: string, imagePath?: string) => Promise<boolean>;
  requestResetPassword: (email: string) => Promise<boolean>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const router = useRouter();
  const [authState, setAuthState] = useState(initialAuthState);

  const getUserData = async () => {
    setAuthState({...authState, isLoadingAuthState: true});

    try {
      const token = await getItemFromAsyncStorage("authToken");
      if (!token) {
        setAuthState({isLoggedIn: false, isLoadingAuthState: false});
        return;
      }

      const {data} = await moodTrackedApi.get("/users", {
        headers: {Authorization: `Bearer ${token}`},
      });

      setAuthState({
        isLoggedIn: true,
        userData: data.payload,
        isLoadingAuthState: false,
        token,
      });
    } catch (error) {
      console.log(`Ocurrio un error en getCurrentUser: ${error}`);
      console.log(error);
    }
  };

  const updateUser = async (name: string, imagePath?: string) => {
    try {
      let formData = new FormData();
      formData.append("name", name);

      if (imagePath) {
        formData.append("file", {
          uri: imagePath,
          name: "image.jpg",
          type: "image/jpeg",
        } as any);
      }

      const token = await getItemFromAsyncStorage("authToken");

      if (!token) {
        console.log("No existe token en storage");
        return false;
      }

      const {data} = await moodTrackedApi.put<GetUserResponse>(
        "/users",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setAuthState({
        ...authState,
        userData: data.payload,
      });
      return true;
    } catch (error) {
      console.log(`Ocurrio un error en updateUser: ${error}`);
      console.log(error);
      return false;
    }
  };

  const login = async (loginData: LoginProps) => {
    try {
      const {data} = await moodTrackedApi.post<LoginResponse>(
        "/users/login",
        loginData,
      );
      await setItemToAsyncStorage("authToken", data.payload.token);
      setAuthState({
        ...authState,
        isLoggedIn: true,
        token: data.payload.token,
        isLoadingAuthState: false,
      });
      router.replace("/");
    } catch (error) {
      console.log(`Ocurrio error en login: ${error}`);
    }
  };

  const registerUser = async (registerData: RegisterProps) => {
    try {
      const {data} = await moodTrackedApi.post("/users", registerData);
      return true;
    } catch (error) {
      console.log(`Ocurrio un error en register: ${error}`);
      return false;
    }
  };

  const logout = async () => {
    await removeItemFromAsyncStorage("authToken");
    setAuthState({
      isLoggedIn: false,
      token: undefined,
      isLoadingAuthState: false,
      userData: undefined,
    });
    router.replace("/login");
  };

  const requestResetPassword = async (email: string) => {
    try {
      console.log("Solicitando request de password");
      const {data} = await moodTrackedApi.post("/users/auth/reset-password", {
        email,
      });
      return true;
    } catch (error: any | AxiosError) {
      console.log("Ocurrió un error al solicitar request de password");
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
      return false;
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        getUserData,
        login,
        registerUser,
        logout,
        updateUser,
        requestResetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
