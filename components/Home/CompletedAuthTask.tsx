import { useUpdateUserDayMutation } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const CompletedAuthTask = () => {
  const navigation = useNavigation();
  const getUserInfoData = useAppSelector((state) => state.auth.userInfo);
  const [
    updateUserDay,
    {
      isError: updateUserDayError,
      isLoading: updateUserUpdateDayLoading,
      isSuccess: updateUserDaySuccess,
    },
  ] = useUpdateUserDayMutation();
  const userId = getUserInfoData?.id;

  const handleRestart = async () => {
    Alert.alert(
      "Restart Journey",
      "Do you want to restart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const result = await updateUserDay({
                currentDay: 1,
                compliteDay: 0,
                userId: userId,
              });

              await AsyncStorage.setItem(
                "AuthDay",
                JSON.stringify({
                  video: false,
                  kagel: false,
                  quiz: false,
                  Blog: false,
                })
              );


              if (updateUserDaySuccess) {
                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "You have successfully started your journey again!",
                });
              } else if (updateUserDayError) {
                Toast.show({
                  type: "info",
                  text1: "Info",
                  text2: "Something went wrong. Please try again later.",
                });
              }
            } catch (error) {
              console.error(error);
            }
            redirectToMembership();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const redirectToMembership = () => {
    router.replace("Home"); // Replace "Home" with the actual screen name you want to navigate to
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.message}>
          You've completed your Task. We're thrilled to have you on this
          journey!
        </Text>
        <Button title="Restart Journey" onPress={handleRestart} />
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  card: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
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
});

export default CompletedAuthTask;
