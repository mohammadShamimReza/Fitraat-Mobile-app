import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AuthMyTask from "./AuthMyTask";
import UnAuthTask from "./UnAuthTask";

const Main = () => {
  const {
    data: authenticatedUserInfoData,
    isLoading,
    isError: authenticatedUserInfoDataError,
  } = useGetUserInfoQuery();

  const authDayDataId = authenticatedUserInfoData?.currentDay;
  const userId = authenticatedUserInfoData?.id;
  const paid = authenticatedUserInfoData?.paid;
  const userToken = useAppSelector((state) => state.auth.authToken);

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

  if (
    authenticatedUserInfoDataError ||
    authenticatedUserInfoData === undefined
  ) {
    return <UnAuthTask paid={paid} />;
  }

  if (
    userToken &&
    paid === true &&
    authDayDataId !== undefined &&
    userId !== undefined
  ) {
    return (
      <AuthMyTask authDayDataId={authDayDataId} userId={userId} paid={paid} />
    );
  }

  return <UnAuthTask paid={paid} />;
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
