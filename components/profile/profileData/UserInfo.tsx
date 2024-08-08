import { removeTokenFromSecureStore } from "@/lib/auth/token";
import { useAppDispatch } from "@/redux/hooks";
import { removeAuthToken } from "@/redux/slice/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    removeTokenFromSecureStore();
    dispatch(removeAuthToken(null));

    // Reset the navigation stack and navigate to the login screen
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.nameLogout}>
        <Text style={styles.profileText}>Name: {name}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.profileText}>Age: {age}</Text>
      <Text style={styles.profileText}>Email: {email}</Text>
      <Text style={styles.profileText}>Location: {location}</Text>
      <Text style={styles.profileText}>Days Completed: {compliteDay}</Text>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  nameLogout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 8,
  },
});
