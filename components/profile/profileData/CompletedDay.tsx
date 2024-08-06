import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CompletedDay = ({
  progressData,
}: {
  progressData: {
    day: number;
    completed: boolean;
  }[];
}) => {
  return (
    <View>
      <Text style={styles.mainTexts}>Days I completed</Text>
      <View style={styles.progressSection}>
        {progressData.map((item) => (
          <View
            key={item.day}
            style={[
              styles.progressItem,
              item.completed ? styles.completed : styles.incomplete,
            ]}
          >
            <Text>{item.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CompletedDay;

const styles = StyleSheet.create({
  progressSection: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  progressItem: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 15,
  },
  completed: {
    backgroundColor: "#4caf50",
  },
  incomplete: {
    backgroundColor: "#ccc",
  },
  mainTexts: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
});
