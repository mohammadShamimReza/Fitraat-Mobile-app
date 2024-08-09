import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CompletedFreeTask = () => {
  const navigation = useNavigation();

  const redirectToMembership = () => {
    router.push("/promember"); // Replace "ProMember" with the actual name of your target screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.message}>
          You've completed your free access period. We're thrilled to have you
          on this journey!
        </Text>

        <TouchableOpacity style={styles.button} onPress={redirectToMembership}>
          <Text style={styles.buttonText}>Upgrade to Pro Membership</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6", // Light gray background
  },
  card: {
    padding: 20,
    backgroundColor: "#FFFFFF", // White background
    borderRadius: 10,
    shadowColor: "#000", // Black shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4B5563", // Gray background
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // White text
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CompletedFreeTask;
