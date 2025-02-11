import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Timer } from "../types/Timer";
import { loadTimers } from "../utils/storage";
import { exportTimers } from '../utils/exportTimers';
import { useTheme } from '../context/ThemeContext';

const HistoryScreen: React.FC = () => {
  const [completedTimers, setCompletedTimers] = useState<Timer[]>([]);
  const { theme } = useTheme();
  const fetchCompletedTimers = async () => {
    const timers = await loadTimers();
    const completed = timers.filter((timer) => timer.status === "Completed");
    setCompletedTimers(completed);
  };

  useEffect(() => {
    fetchCompletedTimers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCompletedTimers();
    }, [])
  );

  return (
    <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
      <FlatList
        data={completedTimers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.item,
            theme === 'dark' ? styles.darkItem : styles.lightItem
          ]}>
            <Text style={theme === 'dark' ? styles.textDark : styles.textLight}>{item.name}</Text>
            <Text style={theme === 'dark' ? styles.textDark : styles.textLight}>
              Completed at: {new Date(parseInt(item.id)).toLocaleString()}
            </Text>
          </View>
        )}
      />
      <Button title="Export Timer Data" onPress={() => exportTimers(completedTimers)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  light: { backgroundColor: '#ffffff' },
  dark: { backgroundColor: '#121212' },
  textLight: { color: '#000000' },
  textDark: { color: '#ffffff' },
  lightItem: { backgroundColor: '#f9f9f9' },
  darkItem: { backgroundColor: '#1e1e1e' },
});

export default HistoryScreen;