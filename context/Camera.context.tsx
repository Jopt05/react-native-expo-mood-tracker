import { createContext, useState } from "react";

export interface CameraState {
    image: any
}

export const initialCameraState: CameraState = {
    image: undefined
}

export interface CameraContextProps {
    cameraState: CameraState,
    saveImage: (image: any) => void,
    resetImage: () => void,
}

export const CameraContext = createContext({} as CameraContextProps);

export const CameraProvider = ({children}: any) => {

    const [cameraState, setCameraState] = useState(initialCameraState);

    const saveImage = (image: any) => {
        setCameraState({
            ...cameraState,
            image
        })
    }

    const resetImage = () => {
        setCameraState({
            ...cameraState,
            image: undefined
        })
    }

    return (
        <CameraContext.Provider
            value={{
                cameraState,
                saveImage,
                resetImage
            }}
        >
            {children}
        </CameraContext.Provider>
    )

}