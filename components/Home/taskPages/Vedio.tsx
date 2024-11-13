import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

interface VideoProps {
  selectedTask?: string;
  video: {
    videoUrl: string | undefined;
  };
}

const VideoComponent: React.FC<VideoProps> = ({ selectedTask, video }) => {
  const videoUrl =
    video?.videoUrl || "https://www.youtube.com/embed/7WUKdCV8J34"; // Default URL

  // HTML string with an iframe
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
       body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
        iframe { width: 100%; height: 100%; max-width: 100%; max-height: 100%; border: 1px solid black; border-radius: 8px; }
      </style>
    </head>
    <body>
      <iframe 
        src="${videoUrl}" 
        title="Video" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
      ></iframe>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {selectedTask === "video" && (
        <View style={styles.videoContainer}>
          <Text style={styles.title}>Video</Text>
          <WebView
            style={styles.video}
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false} // Allow media playback without user action
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    padding: 10,
    borderWidth: 0.2,
    borderRadius: 10,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default VideoComponent;
