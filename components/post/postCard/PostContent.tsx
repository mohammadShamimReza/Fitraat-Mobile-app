import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";

const PostContent = ({ postDescription }: { postDescription: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [height, setHeight] = useState(0);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    // Set up the WebView to calculate height once content is loaded
    const calculateContentHeight = () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(
          `window.ReactNativeWebView.postMessage(document.body.scrollHeight.toString());`
        );
      }
    };

    calculateContentHeight();
  }, [postDescription]);

  const handleMessage = (event: any) => {
    const contentHeight = parseInt(event.nativeEvent.data, 10);
    setHeight(contentHeight);
    setIsExpandable(contentHeight > 100);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
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
                    background-color: transparent;

                  }
                </style>
              </head>
              <body>
                ${postDescription}
              </body>
            </html>
          `,
        }}
        style={[styles.webView, { height: expanded ? height : 100 }]} // Adjust height dynamically
        scrollEnabled={false} // Disable scrolling in WebView
        nestedScrollEnabled={false} // Disable nested scrolling
        onMessage={handleMessage}
        onLoadEnd={() => {
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(
              `window.ReactNativeWebView.postMessage(document.body.scrollHeight.toString());`
            );
          }
        }}
        javaScriptEnabled={true} // Ensure JavaScript is enabled for scrollHeight calculation
      />

      {isExpandable && (
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.linkText}>
              {expanded ? "Show Less" : "See More"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    // backgroundColor: "transparent",
  },
  webView: {
    width: "100%",
    // borderWidth: 0.2,
    // borderColor: "#ddd",
    backgroundColor: "transparent",
  },
  linkContainer: {
    padding: 10,
    alignItems: "flex-start", // Align text to the left
  },
  linkText: {
    color: "#1e3a8a", // Link color
    fontWeight: "bold", // Make the link bold
  },
});

export default PostContent;
