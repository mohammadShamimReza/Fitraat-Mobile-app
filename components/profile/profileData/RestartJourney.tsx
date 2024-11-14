import { useUpdateUserDayMutation } from "@/redux/api/authApi";
import { saveUserDayData } from "@/shared/StoreDayData";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RestartJourney = ({ userId }: { userId: number }) => {
  const [updateUserDay] = useUpdateUserDayMutation();

  const handleRestart = async () => {
    Alert.alert("Restart Journey", "Do you want to restart?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            const result = await updateUserDay({
              currentDay: 1,
              compliteDay: 0,
              userId: userId,
            });
            saveUserDayData("AuthDay", {
              video: false,
              kagel: false,
              quiz: false,
              Blog: false,
            });

            if (result) {
              Alert.alert(
                "Success",
                "You have successfully started your journey again!"
              );
            } else {
              Alert.alert(
                "Error",
                "Something went wrong. Please try again later."
              );
            }
          } catch (error) {
            console.error(error);
            Alert.alert(
              "Error",
              "Something went wrong. Please try again later."
            );
          }
        },
      },
    ]);
  };
  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleRestart}>
        <Text style={styles.buttonText}>Restart Journey</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RestartJourney;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#676c73",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
