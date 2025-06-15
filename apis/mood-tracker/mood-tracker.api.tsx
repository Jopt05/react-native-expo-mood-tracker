import { getItemFromAsyncStorage, setItemToAsyncStorage } from "@/utils/asyncstorage";
import axios from "axios";
import { GetUserResponse, LoginProps, LoginResponse, RegisterProps } from "./interfaces";

const moodTrackedApi = axios.create({
    baseURL: 'https://mood-tracker-app-backend-ntsz.onrender.com/api',
});

export const getUser = async() => {
    const token = await getItemFromAsyncStorage('authToken');
    if( !token ) return null;
    const { data } = await moodTrackedApi.get<GetUserResponse>('/users', { headers: { 'Authorization': `Bearer ${token}` }});
    return data.payload;
}

export const updateUser = async(name: string, imagePath?: string) => {
    const formData = createFormData(name, imagePath);
    const token = await getItemFromAsyncStorage('authToken');
    if( !token ) return null;
    const { data } = await moodTrackedApi.put<GetUserResponse>(
        '/users', 
        formData, { 
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data' 
        },
    });
    return data.payload;
}

export const loginUser = async(loginData: LoginProps) => {
    const { data } = await moodTrackedApi.post<LoginResponse>('/users/login', loginData);
    if( data.payload.token ) {
        await setItemToAsyncStorage('authToken', data.payload.token);
    }
    return data.payload;
}

export const createUser = async(registerProps: RegisterProps) => {
    const { data } = await moodTrackedApi.post('/users', registerProps);
    return data.payload;
}

const createFormData = (name: string, imagePath?: string) => {
    let formData = new FormData();
    formData.append('name', name);
    if( imagePath ) {
        formData.append('file', {
            uri: imagePath,
            name: 'image.jpg',
            type: 'image/jpeg',
        } as any);
    };
    return formData
}

export default moodTrackedApi;