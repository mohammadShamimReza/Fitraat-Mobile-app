import Login from "@/components/profile/Login";
import UserProfile from "@/components/profile/UserProfile";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import { StyleSheet } from "react-native";

const profile = () => {
  const userInfo = useAppSelector((store) => store.auth.userInfo);
  const userToken = useAppSelector((store) => store.auth.authToken);
  console.log(userToken);
  return userToken ? <UserProfile /> : <Login />;
};

export default profile;

const styles = StyleSheet.create({});
