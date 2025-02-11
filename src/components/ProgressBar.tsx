import React from "react";
import { View, StyleSheet } from "react-native";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${progress * 100}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 10, backgroundColor: "#e0e0e0", borderRadius: 5, overflow: "hidden", marginTop: 5 },
  progress: { height: "100%", backgroundColor: "#76c7c0" },
});

export default ProgressBar;