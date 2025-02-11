import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { Timer } from "../types/Timer";
import { saveTimers, loadTimers } from "../utils/storage";
import { RootStackParamList } from "../types/Timer";
import { useTheme } from '../context/ThemeContext';

type AddTimerScreenRouteProp = RouteProp<RootStackParamList, "AddTimer">;

interface AddTimerScreenProps {
  route: AddTimerScreenRouteProp;
}

const AddTimerScreen: React.FC<AddTimerScreenProps> = ({ route }) => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleSave = async () => {
    const newTimer: Timer = {
      id: Date.now().toString(),
      name,
      duration: parseInt(duration, 10),
      remainingTime: parseInt(duration, 10),
      category,
      status: "Not Started",
    };
    const timers = await loadTimers();
    timers.push(newTimer);
    await saveTimers(timers);
    route.params.onTimerAdded();
    navigation.goBack();
  };

  return (
    <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
      <TextInput
        style={[styles.input, theme === 'dark' ? styles.inputDark : styles.inputLight]}
        placeholder="Name"
        placeholderTextColor={theme === 'dark' ? "#ccc" : "#555"}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, theme === 'dark' ? styles.inputDark : styles.inputLight]}
        placeholder="Duration (seconds)"
        placeholderTextColor={theme === 'dark' ? "#ccc" : "#555"}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, theme === 'dark' ? styles.inputDark : styles.inputLight]}
        placeholder="Category"
        placeholderTextColor={theme === 'dark' ? "#ccc" : "#555"}
        value={category}
        onChangeText={setCategory}
      />
      <Button title="Save" onPress={handleSave} />
    </View>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  light: { backgroundColor: '#ffffff' },
  dark: { backgroundColor: '#121212' },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  inputLight: {
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    color: '#000000',
  },
  inputDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
    color: '#ffffff',
  },
});

export default AddTimerScreen;
