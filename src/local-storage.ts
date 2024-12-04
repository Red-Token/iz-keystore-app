import AsyncStorage from '@react-native-async-storage/async-storage';

const localStorage = {
    getItem: async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value !== null ? value : null;
        } catch (error) {
            console.error('Error getting item from AsyncStorage:', error);
            return null;
        }
    },
    setItem: async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('Error setting item in AsyncStorage:', error);
        }
    },
    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item from AsyncStorage:', error);
        }
    },
    clear: async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    },
};

global.localStorage = localStorage; // Polyfill global localStorage
