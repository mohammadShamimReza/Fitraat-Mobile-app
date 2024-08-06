import { Post } from "@/types/contantType";
import React from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const UserPostWebView = ({ post }: { post: Post }) => {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body {
                    font-size: 18px;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    color: #333;
                    overflow-y: auto; /* Allow vertical scrolling */
                  }
                </style>
              </head>
              <body>
                ${post.attributes.description}
              </body>
            </html>
          `,
        }}
        style={styles.webView}
        scrollEnabled={true} // Enable scrolling in WebView
        nestedScrollEnabled={true} // Ensure nested scrolling works
      />
    </View>
  );
};

export default UserPostWebView;

const styles = StyleSheet.create({
  container: {
    height: 150, // Fixed height for the container
    marginBottom: 10,
  },
  webView: {
    flex: 1, // Allow WebView to take full height of the container
    borderWidth: 0.2,
  },
});
