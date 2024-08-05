import { Blog } from "@/types/contantType";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import myPic from "../assets/myPic.png";

// Define the prop types for the Blogs component
interface BlogsProps {
  blog: Blog;
}

const ShowBLog: React.FC<BlogsProps> = ({ blog }) => {
  const blogData = blog.attributes;
  const blogUpdatedAt = new Date(blogData.updatedAt).toDateString();

  return (
    <View style={styles.blogContainer}>
      <View style={styles.blogContent}>
        <Text style={styles.blogTitle}>{blogData.title}</Text>
        <Text style={styles.blogDescription}>
          {blogData?.content && (
            <Text style={styles.blogContentText}>{blogData.content}</Text>
          )}
        </Text>
        <View style={styles.blogFooter}>
          <Text style={styles.blogUpdatedAt}>
            Updated At:{" "}
            <Text style={styles.blogUpdatedAtDate}>{blogUpdatedAt}</Text>
          </Text>
          <View style={styles.blogAuthor}>
            {/* <Image source={myPic} style={styles.authorImage} /> */}
            <Text style={styles.authorName}>Author Name</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  blogContainer: {
    marginBottom: 20,
  },
  blogContent: {
    paddingHorizontal: 16,
  },
  blogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  blogDescription: {
    marginVertical: 10,
    fontSize: 16,
    color: "#666666",
  },
  blogContentText: {
    fontSize: 14,
    color: "#808080",
  },
  blogFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blogUpdatedAt: {
    fontSize: 14,
    color: "#999999",
  },
  blogUpdatedAtDate: {
    fontSize: 14,
    color: "#555555",
  },
  blogAuthor: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    color: "#333333",
  },
});

export default ShowBLog;
