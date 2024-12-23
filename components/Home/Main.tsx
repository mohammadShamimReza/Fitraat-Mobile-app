import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
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
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();
  const userToken = useAppSelector((state) => state.auth.authToken);
  const userData = useAppSelector((state) => state.auth.userInfo);

  // Extract values from authenticatedUserInfoData
  const authDayDataId = authenticatedUserInfoData?.currentDay;
  const userId = authenticatedUserInfoData?.id;
  const paid = authenticatedUserInfoData?.paid;
  const DayCount = authDayDataId || 0;

  const today = new Date();
  const start = new Date(userData?.startDate || new Date());
  const differenceInTime = today.getTime() - start.getTime(); // Difference in milliseconds
  const daysLeft = Math.floor(differenceInTime / (1000 * 60 * 60 * 24)) + 1;
  //  setDaysPassed(days);

  console.log(userData, "this is userData");

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
    return <UnAuthTask paid={paid} daysLeft={daysLeft} />;
  }

  // Handle authenticated users
  if (userToken) {
    if (paid === true && DayCount > 40) {
      return <CompletedAuthTask auth={true} daysCompleted={40} />;
    }

    if (paid === true && authDayDataId && userId && DayCount <= 40) {
      return (
        <AuthMyTask
          authDayDataId={authDayDataId}
          userId={userId}
          paid={paid}
          daysLeft={daysLeft}
        />
      );
    }

    // If no other condition matches, render the UnAuthTask
    return <UnAuthTask paid={paid} daysLeft={daysLeft} />;
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
