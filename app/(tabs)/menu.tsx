// screens/Menu.tsx
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Menu: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* First Row of Buttons */}
      <View style={styles.buttonRow}>
        <Link href="/promember" style={styles.button}>
          <Text style={styles.buttonText}>Pro Member</Text>
        </Link>
        <Link href="/about" style={styles.button}>
          <Text style={styles.buttonText}>About Us</Text>
        </Link>
      </View>

      {/* Second Row of Buttons */}
      <View style={styles.buttonRow}>
        <Link href="/privecy" style={styles.button}>
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </Link>
      </View>

      {/* Bottom Section with Copyright, Email, and Social Media Links */}
      <View style={styles.bottomSection}>
        <Text style={styles.copyrightText}>
          &copy; 2024 Fitraat. All rights reserved.
        </Text>
        <View style={styles.socialMediaContainer}>
          <Link href="https://www.facebook.com">
            <Ionicons
              name="logo-facebook"
              size={24}
              color="blue"
              style={styles.icon}
            />
          </Link>
          <Link href="https://www.twitter.com">
            <Ionicons
              name="logo-twitter"
              size={24}
              color="skyblue"
              style={styles.icon}
            />
          </Link>
          <Link href="https://www.instagram.com">
            <Ionicons
              name="logo-instagram"
              size={24}
              color="purple"
              style={styles.icon}
            />
          </Link>
          <Link href="https://www.linkedin.com">
            <Ionicons
              name="logo-linkedin"
              size={24}
              color="blue"
              style={styles.icon}
            />
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    gap: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#818385",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  bottomSection: {
    marginTop: 20,
    alignItems: "center",
  },
  copyrightText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default Menu;
