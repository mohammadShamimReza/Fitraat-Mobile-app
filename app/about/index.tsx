import useCustomHeader from "@/hooks/useCustomHeader";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

function Page() {
  useCustomHeader({ title: "About" });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Detox-Dopamine by Fitraat</Text>
      <Text style={styles.description}>
        Detox-Dopamine is your companion on the journey towards digital
        well-being from an Islamic perspective. Developed by Fitraat, we strive
        to provide holistic solutions that align with Islamic values and promote
        spiritual growth in the digital age.
      </Text>
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Islamic Perspective:</Text> Our app
            integrates Islamic teachings and values into addiction recovery,
            offering spiritual guidance and support.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Behavioral Science:</Text> Utilizes
            evidence-based techniques to help users understand and overcome
            addictive behaviors effectively.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Daily Reflections:</Text> Receive daily
            inspirations from Quranic verses and Hadiths, fostering a deeper
            connection to faith during recovery.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Community Support:</Text> Engage with a
            supportive community of fellow users, sharing experiences and
            finding solidarity in the journey towards digital well-being.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Expert Guidance:</Text> Access guidance
            from Islamic scholars and mental health professionals specialized in
            addiction recovery.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Personalized Progress Tracking:</Text>{" "}
            Track your progress, set goals, and celebrate achievements along
            your digital detox journey.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Islamic Mindfulness Exercises:</Text>{" "}
            Practice mindfulness rooted in Islamic tradition to cultivate inner
            peace and spiritual growth.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Halal Recreation:</Text> Discover halal
            recreational activities to engage in healthy, wholesome leisure
            pursuits.
          </Text>
        </View>
      </View>
      <Text style={styles.footerText}>
        At Fitraat, we believe in empowering individuals to lead fulfilling
        lives in harmony with their faith. Join us on the path to digital
        well-being with Detox-Dopamine, and embark on a journey of
        self-discovery and spiritual growth.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginBottom: 24,
  },
  featuresContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  list: {
    paddingLeft: 16,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 12,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginTop: 32,
  },
});

export default Page;
