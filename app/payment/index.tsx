import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const index = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: "payment",
    });
  });
  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
