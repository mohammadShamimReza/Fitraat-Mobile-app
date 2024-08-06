import React from "react";
import { StyleSheet, Text } from "react-native";

const UserInfo = ({
  name,
  age,
  email,
  location,
  compliteDay,
}: {
  name: string;
  age: number;
  email: string;
  location: string;
  compliteDay: number;
}) => {
  return (
    <>
      <Text style={styles.profileText}>Name: {name}</Text>
      <Text style={styles.profileText}>Age: {age}</Text>
      <Text style={styles.profileText}>Email: {email}</Text>
      <Text style={styles.profileText}>Location: {location}</Text>
      <Text style={styles.profileText}>Days Completed: {compliteDay}</Text>
    </>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  profileSection: {
    marginBottom: 20,
  },
  profileBigText: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  mainTexts: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 8,
  },

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
