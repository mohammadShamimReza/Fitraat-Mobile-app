import { getTokenFromSecureStore } from "@/lib/auth/token";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const tasks = () => {
  const userInfo = useAppSelector((store) => store.auth.userInfo);
  const tokenFronSecureStore = getTokenFromSecureStore();
  console.log(tokenFronSecureStore, "this is token from secure store ");
  console.log(userInfo, "this is user info");
  return (
    <View>
      <Text>tasks</Text>
    </View>
  );
};

export default tasks;

const styles = StyleSheet.create({});
