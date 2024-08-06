import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RestartJourney = ({ handleRestart }: { handleRestart: () => void }) => {
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
