import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

interface VideoProps {
  selectedTask: string;
  video: {
    videoUrl: string | undefined;
  };
}

const VideoComponent: React.FC<VideoProps> = ({ selectedTask, video }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      // Check if the status is loaded before accessing isPlaying
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          videoRef.current.pauseAsync();
        } else {
          videoRef.current.playAsync();
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {selectedTask === "video" && (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{
              uri:
                video?.videoUrl ||
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            }}
            shouldPlay
            resizeMode={ResizeMode.CONTAIN} // Use the ResizeMode enum
            isLooping
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            useNativeControls
          />
          <View style={styles.controlsContainer}>
            <Button
              title={isPlaying ? "Pause" : "Play"}
              onPress={togglePlayPause}
            />
          </View>
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
  },
  videoContainer: {
    width: "100%",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 300,
  },
  controlsContainer: {
    marginTop: 10,
  },
});
