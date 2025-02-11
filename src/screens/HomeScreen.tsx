import React, { useEffect, useState, useCallback } from "react";
import { View, Button, FlatList, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Timer, Category } from "../types/Timer";
import { loadTimers, saveTimers } from "../utils/storage";
import CategorySection from "../components/CategorySection";
import { RootStackParamList } from "../types/Timer";
import { useTheme } from '../context/ThemeContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, toggleTheme } = useTheme();
  const fetchTimers = async () => {
    const timers = await loadTimers();
    setCategories(groupTimersByCategory(timers));
  };

  useEffect(() => {
    fetchTimers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTimers();
    }, [])
  );

  const groupTimersByCategory = (timers: Timer[]): Category[] => {
    const grouped: { [key: string]: Timer[] } = {};
    timers.forEach((timer) => {
      if (!grouped[timer.category]) grouped[timer.category] = [];
      grouped[timer.category].push(timer);
    });
    return Object.keys(grouped).map((category) => ({
      name: category,
      timers: grouped[category],
    }));
  };

  const handleUpdateTimers = (updatedTimers: Timer[]) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        timers: category.timers.map((timer) => {
          const updatedTimer = updatedTimers.find((ut) => ut.id === timer.id);
          return updatedTimer ? updatedTimer : timer;
        }),
      }))
    );
  };

  return (
    <ScrollView style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>

      <Button title="Dark Mode" onPress={toggleTheme} />

      <View style={{ marginTop: 10 }}>
        <Button
          title="Add Timer"
          onPress={() =>
            navigation.navigate("AddTimer", { onTimerAdded: fetchTimers })
          }
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button title="Go to History" onPress={() => navigation.navigate("History")} />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <CategorySection category={item} onUpdateTimer={handleUpdateTimers} />
          )}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  listContainer: { flex: 1, marginTop: 10 },
  light: { backgroundColor: '#ffffff' },
  dark: { backgroundColor: '#121212' },
});

export default HomeScreen;
