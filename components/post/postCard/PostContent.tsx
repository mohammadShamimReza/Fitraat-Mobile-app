import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const PostContent = ({ postDescription }: { postDescription: string }) => {
  const [expanded, setExpanded] = useState(false);

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
                    overflow: hidden; /* Hide overflow to manage scroll */
                  }
                </style>
              </head>
              <body>
                ${postDescription}
              </body>
            </html>
          `,
        }}
        style={[styles.webView, { height: expanded ? undefined : 160 }]} // Adjust height dynamically
        scrollEnabled={expanded} // Allow scroll when expanded
        nestedScrollEnabled={true} // Ensure nested scrolling works
      />
      <Button
        title={expanded ? "Show Less" : "See More"}
        onPress={() => setExpanded(!expanded)}
        color="#1e3a8a" // Change the color to match your design
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
  },
  webView: {
    width: "100%",
    borderWidth: 0.2,
    borderColor: "#ddd",
  },
});

export default PostContent;
