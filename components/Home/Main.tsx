import { useGetUserInfoQuery } from "@/redux/api/authApi";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import UnAuthTask from "./UnAuthTask";

const Main = () => {
  const {
    data: authenticatedUserInfoData,
    isLoading,
    isError: authenticatedUserInfoDataError,
    isSuccess,
  } = useGetUserInfoQuery();

  const authDayDataId = authenticatedUserInfoData?.currentDay;
  const userId = authenticatedUserInfoData?.id;
  const paid = authenticatedUserInfoData?.paid;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#0000ff"
        />
      ) : authenticatedUserInfoData === undefined &&
        authenticatedUserInfoDataError === true &&
        paid === undefined ? (
        <UnAuthTask paid={paid} />
      ) : paid === false ? (
        <UnAuthTask paid={paid} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  loadingIndicator: {
    marginTop: 40,
  },
});

export default Main;
