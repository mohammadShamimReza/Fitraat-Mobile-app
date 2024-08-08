import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function SuggestedBlog({
  selectedTask,
  blog,
}: {
  selectedTask: string;
  blog: {
    id: number | undefined;
    title: string | undefined;
    content: string | undefined;
  };
}) {
  const [hoveredWords, setHoveredWords] = useState<number[]>([]);
  const navigation = useNavigation();

  const handleWordHover = (index: number) => {
    if (!hoveredWords.includes(index)) {
      setHoveredWords([...hoveredWords, index]);
    }
  };

  //   const resetHoveredWord = () => {
  //     setHoveredWords([]);
  //   };

  const handleReadFullBlog = () => {
    // navigation.navigate("BlogDetail", { blogId: blog.id });
  };

  return (
    <View>
      {selectedTask === "Blog" && (
        <>
          <Text style={styles.title}>{blog?.title}</Text>
          <Text style={styles.content}>
            {blog?.content?.split(" ").map((word, index) => (
              <Text
                key={index}
                onPress={() => handleWordHover(index)}
                // onMouseLeave={resetHoveredWord}
                style={{
                  color: hoveredWords.includes(index) ? "red" : "inherit",
                  cursor: "pointer",
                }}
              >
                {word}{" "}
              </Text>
            ))}
          </Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleReadFullBlog}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Read Full Blog</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

export default SuggestedBlog;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    margin: 7,
    fontSize: 24,
    textDecorationLine: "underline",
  },
  content: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: "justify",
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
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
