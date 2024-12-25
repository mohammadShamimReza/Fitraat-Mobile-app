import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PostHeader = ({
  postUserId,
  postUserName,
  postAt,
  varifiedSine,
}: {
  postUserId: number;
  postUserName: string;
  postAt: string;
  varifiedSine: boolean | undefined;
}) => {
  const router = useRouter();

  const handlePress = () => {
    // router.push(`/postUser/${postUserId}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.link}>
        <View style={styles.userContainer}>
          <Text style={styles.userName}>
            {postUserName}
            {varifiedSine && (
              <Ionicons
                name="checkmark-circle"
                size={15}
                color="#3b82f6"
                style={styles.checkIcon}
              />
            )}
          </Text>
          <Text style={styles.postTime}>{postAt}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  link: {
    flexDirection: "row",
  },
  userContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    color: "#3b82f6",
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // Adjusted gap between elements
  },
  checkIcon: {
    marginLeft: 4, // Ensures there is space between the name and icon
  },
  postTime: {
    color: "#4b5563",
    fontSize: 14,
    marginBottom: 4,
  },
});

export default PostHeader;
