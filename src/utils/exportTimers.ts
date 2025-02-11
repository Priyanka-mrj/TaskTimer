// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';
// import { Alert } from "react-native";

// export const exportTimers = async (timers: any) => {
//   try {
//     const filePath = `${RNFS.DocumentDirectoryPath}/timers.json`;

//     // Convert timers to JSON format
//     const jsonData = JSON.stringify(timers, null, 2);

//     // Write data to file
//     await RNFS.writeFile(filePath, jsonData, 'utf8');
//     console.log('File written to:', filePath);

//     // Share the file
//     await Share.open({
//       url: `file://${filePath}`,
//       type: 'application/json',
//       failOnCancel: false,
//     });
//   } catch (error) {
//     console.error('Error exporting timers:', error);
//     Alert.alert('Failed to export timers.');
//   }
// };

import { PermissionsAndroid, Alert } from "react-native";
import RNFS from "react-native-fs";

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission Required",
        message:
          "This app needs access to your storage to save the file.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const exportTimers = async (timers: any) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Storage permission is required to save the file.");
      return;
    }

    const filePath = `/storage/emulated/0/Download/timers.json`;

    // Convert timers to JSON format
    const jsonData = JSON.stringify(timers, null, 2);

    await RNFS.writeFile(filePath, jsonData, "utf8");
    Alert.alert("Success", `File saved at: ${filePath}`);
    console.log("File saved at:", filePath);
  } catch (error) {
    console.error("Error exporting timers:", error);
    Alert.alert("Failed to export timers.");
  }
};
