import useSetNavigationTitle from "@/hooks/useCustomStackName";
import { useGetFreeBlogsByIdQuery } from "@/redux/api/freeBlogApi"; // Adjust import based on your setup
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Page = ({ params }: { params: { slug: string } }) => {
  const { slug } = useLocalSearchParams();
  useSetNavigationTitle("Blog");

  // Ensure slug is a string or handle undefined case
  if (typeof slug !== "string") {
    return (
      <View style={styles.container}>
        <Text>Error: Invalid slug</Text>
      </View>
    );
  }

  const { data, isLoading } = useGetFreeBlogsByIdQuery(slug);
  const blogData = data?.data.attributes;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>{blogData?.title} free</Text>
        <Image
          source={
            blogData?.imageURL
              ? { uri: blogData.imageURL }
              : require("../../assets/images/stopPorn.png")
          }
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.contentText}>{blogData?.content}</Text>
        </View>
        <Text style={styles.viewCount}>
          Total view:{" "}
          <Text style={styles.viewCountNumber}>{blogData?.viewCount || 1}</Text>
        </Text>
        <Text style={styles.thankYou}>Thanks for reading this Blog</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  textContainer: {
    maxWidth: "100%",
    paddingHorizontal: 16,
  },
  contentText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  viewCount: {
    fontSize: 16,
    color: "#000",
    textAlign: "right",
    marginVertical: 16,
  },
  viewCountNumber: {
    color: "red",
  },
  thankYou: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#407ced",
    textAlign: "center",
  },
});

export default Page;
