import AsyncStorage from "@react-native-async-storage/async-storage";
import { Timer } from "../types/Timer";

const TIMERS_KEY = "timers";

export const saveTimers = async (timers: Timer[]) => {
  try {
    await AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
  } catch (error) {
    console.error("Failed to save timers:", error);
  }
};

export const loadTimers = async (): Promise<Timer[]> => {
  try {
    const timers = await AsyncStorage.getItem(TIMERS_KEY);
    return timers ? JSON.parse(timers) : [];
  } catch (error) {
    console.error("Failed to load timers:", error);
    return [];
  }
};