import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddTimerScreen from './src/screens/AddTimerScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { RootStackParamList } from './src/types/Timer';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddTimer" component={AddTimerScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  light: { backgroundColor: '#ffffff' },
  dark: { backgroundColor: '#121212' },
});

export default App;
