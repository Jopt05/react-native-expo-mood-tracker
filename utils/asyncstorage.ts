import AsyncStorage from "@react-native-async-storage/async-storage";

export const getItemFromAsyncStorage = async(itemName: string) => {
    try {
        const item = await AsyncStorage.getItem(itemName);
        return item
    } catch (error) {
        console.log('Error al obtener de AsyncStorage');
        console.log(error)
        return null
    }
}

export const setItemToAsyncStorage = async(itemName: string, item: string) => {
    try {
        await AsyncStorage.setItem(itemName, item);
    } catch (error) {
        console.log('Error al guardar en AsyncStorage');
        console.log(error)
    }
}

export const removeItemFromAsyncStorage = async(itemName: string) => {
    try {
        await AsyncStorage.removeItem(itemName);
    } catch (error) {
        console.log('Error al eliminar de AsyncStorage');
        console.log(error)
    }
}