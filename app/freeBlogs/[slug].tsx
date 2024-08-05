import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const page = () => {
  const { slug } = useLocalSearchParams();
  console.log(slug);
  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: slug ? `Page for ${slug}` : "Default Title",
    });
  }, [navigation, slug]);
  return (
    <View style={styles.container}>
      <Text>page</Text>
    </View>
  );
};

export default page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
