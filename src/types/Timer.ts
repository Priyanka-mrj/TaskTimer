export interface Timer {
    id: string;
    name: string;
    duration: number;
    remainingTime: number;
    category: string;
    status: "Not Started" | "Running" | "Paused" | "Completed";
    enableHalfwayAlert?: boolean; 
  }
  
  export interface Category {
    name: string;
    timers: Timer[];
  }

  export type RootStackParamList = {
    Home: undefined;
    AddTimer: { onTimerAdded: () => Promise<void> };
    History: undefined;
  };