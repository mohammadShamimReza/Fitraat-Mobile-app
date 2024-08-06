import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const EditPost = ({ defaultValue }: { defaultValue: string }) => {
  const [content, setContent] = useState(defaultValue);
  const richText = useRef<RichEditor>(null);

  const handleSave = () => {
    if (richText.current) {
      // Retrieve the current content from the editor
      richText.current.getContentHtml().then((html) => {
        console.log("Current content:", html);
        setContent(html);
      });
    }
  };

  return (
    <View style={styles.container}>
      <RichEditor
        ref={richText}
        initialContentHTML={defaultValue}
        style={styles.editor}
        onChange={(text) => setContent(text)}
      />
      <RichToolbar
        editor={richText}
        actions={[
          "bold",
          "italic",
          "underline",
          "unorderedList",
          "orderedList",
          "insertImage",
          "insertVideo",
        ]}
        style={styles.toolbar}
      />
      <Button title="Save Content" onPress={handleSave} />
      <Text style={styles.contentPreview}>Content Preview:</Text>
      <Text>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  editor: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  toolbar: {
    backgroundColor: "#f1f1f1",
  },
  contentPreview: {
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default EditPost;
