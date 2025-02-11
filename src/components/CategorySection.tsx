import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Category, Timer } from "../types/Timer";
import TimerItem from "./TimerItem";

interface CategorySectionProps {
  category: Category;
  onUpdateTimer: (updatedTimers: Timer[]) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, onUpdateTimer }) => {
  const [expanded, setExpanded] = useState(false);

  const handleStartAll = () => {
    const updatedTimers: Timer[] = category.timers.map((timer) => {
      if (timer.status !== "Running") {
        return { ...timer, status: "Running", remainingTime: timer.remainingTime };
      }
      return timer;
    });

    onUpdateTimer(updatedTimers);
  };

  const handlePauseAll = () => {
    const updatedTimers: Timer[] = category.timers.map((timer) => ({
      ...timer,
      status: "Paused",
    }));
    onUpdateTimer(updatedTimers);
  };

  const handleResetAll = () => {
    const updatedTimers: Timer[] = category.timers.map((timer) => ({
      ...timer,
      remainingTime: timer.duration,
      status: "Not Started",
    }));
    onUpdateTimer(updatedTimers);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.toggleButton}>{expanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {expanded && (
        <>
          <View style={styles.buttons}>
            <Button title="Start All" onPress={handleStartAll} />
            <Button title="Pause All" onPress={handlePauseAll} />
            <Button title="Reset All" onPress={handleResetAll} />
          </View>

          {category.timers.map((timer) => (
            <TimerItem
              key={timer.id}
              timer={timer}
              onUpdate={(updatedTimer) => onUpdateTimer([updatedTimer])} // Update individual timers as well
            />
          ))}
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleButton: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});

export default CategorySection;

