import { getItemFromAsyncStorage, setItemToAsyncStorage } from "@/utils/asyncstorage";
import { Theme } from "@react-navigation/native";
import { createContext, useEffect, useState } from "react";

export interface ThemeState extends Theme {
    currentTheme: 'light' | 'dark';
}

export const lightTheme: ThemeState = {
    currentTheme: 'light',
    dark: false,
    colors: {
        primary: '#20214f',
        background: '#f5f5ff',
        card: '#ffff',
        text: '#b2b2bf',
        border: '#000000',
        notification: '#4865db',
    },
    fonts: {
        regular: {
            fontFamily: "Montserrat-regular",
            fontWeight: "bold"
        },
        medium: {
            fontFamily: "Montserrat-medium",
            fontWeight: "bold"
        },
        bold: {
            fontFamily: "Montserrat-bold",
            fontWeight: "bold"
        },
        heavy: {
            fontFamily: "Montserrat-bold",
            fontWeight: "bold"
        }
    }
}

export const darkTheme: ThemeState = {
    currentTheme: 'dark',
    dark: true,
    colors: {
        primary: '#f5f5ff',
        background: '#3a3a59',
        card: '#44446f',
        text: '#f5f5ff',
        border: '#f5f5ff',
        notification: '#505194',
    },
    fonts: {
        regular: {
            fontFamily: "Montserrat-regular",
            fontWeight: "bold"
        },
        medium: {
            fontFamily: "Montserrat-medium",
            fontWeight: "bold"
        },
        bold: {
            fontFamily: "Montserrat-bold",
            fontWeight: "bold"
        },
        heavy: {
            fontFamily: "Montserrat-bold",
            fontWeight: "bold"
        }
    }
}

interface ThemeContextProps {
    theme: ThemeState;
    setDarkTheme: () => Promise<void>;
    setLightTheme: () => Promise<void>;
}

export const ThemeContext = createContext({} as ThemeContextProps);

export const ThemeProvider = ({children}: any) => {

    const [themeState, setThemeState] = useState(darkTheme);

    useEffect(() => {
        setThemeFromStorage();
    }, []);

    const setThemeFromStorage = async() => {
        const currentTheme = await getItemFromAsyncStorage('theme');
        if( currentTheme && currentTheme == 'light' ) {
            setThemeState(lightTheme);
            return;
        }
    }
    

    const setDarkTheme = async() => {
        setThemeState(darkTheme);
        setItemToAsyncStorage('theme', 'dark')
    }

    const setLightTheme = async() => {
        setThemeState(lightTheme);
        setItemToAsyncStorage('theme', 'light')
    }

    return (
        <ThemeContext.Provider
            value={{
                theme: themeState,
                setDarkTheme,
                setLightTheme
            }}
        >
            { children }
        </ThemeContext.Provider>
    )

}