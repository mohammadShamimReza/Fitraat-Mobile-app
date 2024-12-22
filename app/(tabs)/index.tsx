import Main from "@/components/Home/Main";
import SupportPalastine from "@/components/Home/SupportPalastine";
import React from "react";
import { StyleSheet } from "react-native";

const index = () => {
  return (
    <>
      <SupportPalastine />
      <Main />
    </>
  );
};

export default index;

const styles = StyleSheet.create({});
