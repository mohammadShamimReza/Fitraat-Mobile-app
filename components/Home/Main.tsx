import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AuthMyTask from "./AuthMyTask";
import CompletedAuthTask from "./CompletedAuthTask";
import CompletedFreeTask from "./CompletedFreeTask";
import UnAuthTask from "./UnAuthTask";

const Main = () => {
  const {
    data: authenticatedUserInfoData,
    isLoading,
    isError: authenticatedUserInfoDataError,
  } = useGetUserInfoQuery();

  const userToken = useAppSelector((state) => state.auth.authToken);

  // Extract values from authenticatedUserInfoData
  const authDayDataId = authenticatedUserInfoData?.currentDay;
  const userId = authenticatedUserInfoData?.id;
  const paid = authenticatedUserInfoData?.paid;
  const DayCount = authDayDataId || 0;

  // Handle loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  // Handle unauthenticated users
  if (!userToken) {
    if (paid !== true && DayCount > 4) {
      return <CompletedFreeTask />;
    }
    return <UnAuthTask paid={paid} />;
  }

  // Handle authenticated users
  if (userToken) {
    if (paid === true && DayCount > 40) {
      return <CompletedAuthTask />;
    }

    if (paid === true && authDayDataId && userId && DayCount <= 40) {
      return (
        <AuthMyTask authDayDataId={authDayDataId} userId={userId} paid={paid} />
      );
    }

    // If no other condition matches, render the UnAuthTask
    return <UnAuthTask paid={paid} />;
  }

  // Fallback rendering (should not normally reach here)
  return (
    <View style={styles.container}>
      <ActivityIndicator
        style={styles.loadingIndicator}
        size="large"
        color="#0000ff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    marginTop: 40,
  },
});

export default Main;
