import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SupportPalastine: React.FC = () => {
  const palestineHelpUrl = "https://example.com/support-palestine";

  const handleSupportPress = async () => {
    try {
      await Linking.openURL(palestineHelpUrl);
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stand with Palestine 🇧🇩</Text>
      <TouchableOpacity onPress={handleSupportPress}>
        <Text style={styles.link}>Support 🇵🇸</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#1F2937", // bg-gray-800
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16, // Spacing between text and button
  },
  text: {
    fontSize: 14, // Adjust for responsiveness (use 12 for smaller text)
    fontWeight: "600", // font-semibold
    color: "#FFFFFF", // text-white
  },
  link: {
    fontSize: 14, // Adjust for responsiveness
    fontWeight: "600", // font-semibold
    textDecorationLine: "underline",
    color: "#FFFFFF", // text-white
    opacity: 0.8, // Slightly dimmed for hover-like effect
  },
});

export default SupportPalastine;
