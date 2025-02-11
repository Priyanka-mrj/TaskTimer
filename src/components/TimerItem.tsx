import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, Alert, Switch } from "react-native";
import { Timer } from "../types/Timer";
import ProgressBar from "./ProgressBar";
import { loadTimers, saveTimers } from "../utils/storage";

interface TimerItemProps {
  timer: Timer;
  onUpdate: (updatedTimer: Timer) => void;
}

const TimerItem: React.FC<TimerItemProps> = ({ timer, onUpdate }) => {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [showModal, setShowModal] = useState(false);
  const [halfwayAlertTriggered, setHalfwayAlertTriggered] = useState(false);
  const [enableHalfwayAlert, setEnableHalfwayAlert] = useState(timer.enableHalfwayAlert || false);

  const toggleHalfwayAlert = () => {
    setEnableHalfwayAlert(!enableHalfwayAlert);
    onUpdate({ ...timer, enableHalfwayAlert: !enableHalfwayAlert });
  };
  useEffect(() => {
    setRemainingTime(timer.remainingTime);
  }, [timer.remainingTime]);

  const handleSaveCompletedTimer = async (completedTimer: Timer) => {

    const timers = await loadTimers();

    const updatedTimers = timers.map((t) => (t.id === completedTimer.id ? completedTimer : t));

    await saveTimers(updatedTimers);

  };
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.status === "Running") {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            const updatedTimer = { ...timer, status: "Completed" as "Completed", remainingTime: 0 };
            onUpdate(updatedTimer);
            handleSaveCompletedTimer(updatedTimer);
            setShowModal(true);
            return 0;
          }

          if (timer.enableHalfwayAlert && !halfwayAlertTriggered && prev === Math.floor(timer.duration / 2)) {
            Alert.alert(`⏳ Halfway There! ${timer.name} is at 50% completion.`);
            setHalfwayAlertTriggered(true);
          }

          const updatedTime = prev - 1;
          onUpdate({ ...timer, remainingTime: updatedTime });
          return updatedTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.status]);

  const handleStart = () => onUpdate({ ...timer, remainingTime: remainingTime, status: "Running" });
  const handlePause = () => onUpdate({ ...timer, remainingTime: remainingTime, status: "Paused" });
  const handleReset = () => {
    setRemainingTime(timer.duration);
    setHalfwayAlertTriggered(false);
    onUpdate({ ...timer, remainingTime: timer.duration, status: "Not Started" });
  };

  return (
    <View style={styles.container}>
      <Text>{timer.name}</Text>
      <Text>{remainingTime}s remaining</Text>
      <Text style={[styles.status, getStatusStyle(timer.status)]}>
        {timer.status}
      </Text>
      <View style={styles.row}>
        <Text>Halfway Notify</Text>
        <Switch value={enableHalfwayAlert} onValueChange={toggleHalfwayAlert} />
      </View>


      <ProgressBar progress={remainingTime / timer.duration} />
      <View style={styles.buttons}>
        <Button title="Start" onPress={handleStart} />
        <Button title="Pause" onPress={handlePause} />
        <Button title="Reset" onPress={handleReset} />
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>🎉 Timer Completed! 🎉</Text>
            <Text style={styles.modalTimerName}>{timer.name}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Running":
      return { color: "red" };
    case "Paused":
      return { color: "orange" };
    case "Not Started":
      return { color: "gray" };
    default:
      return { color: "green" };
  }
};

const styles = StyleSheet.create({
  container: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  buttons: { flexDirection: "row", justifyContent: "space-around", paddingTop: 6 },
  status: {
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalTimerName: { fontSize: 16, marginBottom: 20 },
  closeButton: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5 },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
});

export default TimerItem;

