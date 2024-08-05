import { Blog } from "@/types/contantType";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Define the prop types for the Blogs component
interface BlogsProps {
  blog: Blog;
}

const ShowBlog: React.FC<BlogsProps> = ({ blog }) => {
  const blogData = blog.attributes;
  const blogUpdatedAt = new Date(blogData.updatedAt).toDateString();

  return (
    <View style={styles.blogContainer}>
      <Link href={`/freeBlogs/${blog.id}`} style={styles.blogLink}>
        <Text style={styles.blogTitle}>{blogData.title}</Text>
      </Link>
      <Link href={`/freeBlogs/${blog.id}`} style={styles.blogLink}>
        <Text style={styles.blogDescription}>
          {blogData?.content && (
            <Text style={styles.blogContentText}>
              {blogData.content.slice(0, 200)}...{" "}
              {/* Show a preview of 100 characters */}
            </Text>
          )}
        </Text>
      </Link>
      <View style={styles.blogFooter}>
        <Text style={styles.blogUpdatedAt}>
          Updated At:{" "}
          <Text style={styles.blogUpdatedAtDate}>{blogUpdatedAt}</Text>
        </Text>
        <View style={styles.blogAuthor}>
          {/* <Image source={myPic} style={styles.authorImage} /> */}
          <Text style={styles.authorName}>
            {blogData?.authorName.split(" ").slice(0, 2).join(" ")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  blogContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#f9f9f9", // Light background for contrast
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blogLink: {
    textDecorationLine: "none",
  },
  blogTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  blogDescription: {
    marginVertical: 10,
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  blogContentText: {
    fontSize: 16,
    color: "#555",
  },
  blogFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
    marginTop: 10,
  },
  blogUpdatedAt: {
    fontSize: 14,
    color: "#555",
  },
  blogUpdatedAtDate: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
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
    color: "#333",
    fontWeight: "bold",
  },
});

export default ShowBlog;
