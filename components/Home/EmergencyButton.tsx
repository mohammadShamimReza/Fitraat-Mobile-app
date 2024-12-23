import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

interface EmergencyButtonProps {
  onPress: () => void;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  // Create pulsing animation for border and scale without native driver
  useEffect(() => {
    const animationLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: false, // Disabled native driver to avoid conflicts
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    animationLoop.start();

    // Cleanup animation on unmount
    return () => animationLoop.stop();
  }, [scaleAnim, borderAnim]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF6B6B", "#FFD700"], // Colors for the pulsing border effect
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleAnim }], borderColor },
        ]}
      >
        <Text style={styles.text}> Emergency</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EmergencyButton;
