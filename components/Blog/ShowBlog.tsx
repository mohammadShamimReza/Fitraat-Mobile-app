import { useUpdateFreeBlogMutation } from "@/redux/api/freeBlogApi";
import { Blog } from "@/types/contantType";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import Markdown from "react-native-markdown-display";

// Define the prop types for the Blogs component
interface BlogsProps {
  blog: Blog;
}

const ShowBlog: React.FC<BlogsProps> = ({ blog }) => {
  const blogData = blog.attributes;
  const blogUpdatedAt = new Date(blogData.updatedAt).toDateString();
  const [updateBlog] = useUpdateFreeBlogMutation();
  const BlogCOunt = parseInt(blogData.viewCount);

  const updateViewCount = async (blogId: number) => {
    try {
      const result = await updateBlog({
        id: blogId,
        updatedFields: { viewCount: BlogCOunt + 1 },
      }).unwrap();
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  return (
    <View style={styles.blogContainer}>
      <Text style={styles.blogTitle}>{blogData.title}</Text>

      <View style={styles.blogContent}>
        {blogData?.content && (
          <Markdown style={markdownStyles}>
            {blogData.content.slice(0, 200) + "..."}
          </Markdown>
        )}
      </View>
      <Link
        href={`/freeBlogs/${blog.id}`}
        onPress={() => updateViewCount(blog.id)}
        style={styles.blogLink}
      >
        Read More...
      </Link>
      <View style={styles.blogFooter}>
        <Text style={styles.blogUpdatedAt}>
          Updated At:{" "}
          <Text style={styles.blogUpdatedAtDate}>{blogUpdatedAt}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  blogContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blogLink: {
    fontWeight: "bold",
    borderWidth: 1,
    padding: 3,
    width: 120,
    textAlign: "center",
    borderRadius: 4,
    borderColor: "black",
  },
  blogTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  blogContent: {
    marginVertical: 10,
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
  authorName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
});

const markdownStyles: { [key: string]: TextStyle } = {
  body: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold" as TextStyle["fontWeight"], // Explicit type for fontWeight
    color: "#000",
  },
  link: {
    color: "#1e90ff",
  },
};

export default ShowBlog;
