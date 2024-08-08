import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

interface VideoProps {
  selectedTask: string;
  video: {
    videoUrl: string | undefined;
  };
}

const VideoComponent: React.FC<VideoProps> = ({ selectedTask, video }) => {
  const videoUrl =
    video?.videoUrl || "https://www.youtube.com/embed/7WUKdCV8J34"; // Use your default URL here

  return (
    <View style={styles.container}>
      {selectedTask === "video" && (
        <View style={styles.videoContainer}>
          <Text style={styles.title}>Video</Text>

          <WebView
            style={styles.video}
            source={{ uri: videoUrl }}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      )}
    </View>
  );
};

export default VideoComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.2,
    padding: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  videoContainer: {
    width: "100%",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 300,
  },
});
