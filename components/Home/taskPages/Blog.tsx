import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function SuggestedBlog({
  selectedTask,
  blog,
  paid,
}: {
  selectedTask: string;
  blog: {
    id: number | undefined;
    title: string | undefined;
    content: string | undefined;
  };
  paid: boolean | undefined;
}) {
  const handleReadFullBlog = () => {
    if (paid === true) {
      router.push(`/authBlogs/${blog.id}`);
    } else {
      router.push(`/freeBlogs/${blog.id}`);
    }
  };

  return (
    <View>
      {selectedTask === "Blog" && (
        <View style={styles.blogContainer}>
          <Text style={styles.title}>Blog</Text>

          <Text style={styles.blogTitle}>{blog?.title}</Text>
          <Text style={styles.content}>
            {blog?.content?.split(" ").slice(0, 50).join(" ")}
          </Text>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleReadFullBlog}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Read Full Blog</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default SuggestedBlog;

const styles = StyleSheet.create({
  blogContainer: {
    borderWidth: 0.2,
    padding: 5,
    borderRadius: 10,
  },
  blogTitle: {
    textAlign: "center",

    fontSize: 24,
    textDecorationLine: "underline",
  },
  content: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: "justify",
    marginTop: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4a4a4a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 20,
    textAlign: "center",
  },
});
