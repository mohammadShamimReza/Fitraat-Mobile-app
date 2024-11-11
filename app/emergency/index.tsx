import useSetNavigationTitle from "@/hooks/useCustomStackName";
import { useGetEnergencyContantQuery } from "@/redux/api/emergencyApi";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";

interface VideoProps {
  videoUrl: string;
}

const VideoComponent: React.FC<VideoProps> = ({ videoUrl }) => {
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
    <View style={styles.videoContainer}>
      <WebView
        style={styles.video}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        javaScriptEnabled
        domStorageEnabled
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};


const EmergencyService: React.FC = () => {
  useSetNavigationTitle("Emergency");

  const { data } = useGetEnergencyContantQuery(undefined);
  const total = data?.meta.pagination.total;

  const [current, setCurrent] = useState(0);
  const [emergencyNumber, setEmergencyNumber] = useState<number | null>(null);

  useEffect(() => {
    if (total && typeof total === "number") {
      const randomNumber = Math.floor(Math.random() * total);
      setEmergencyNumber(randomNumber);
    } else {
      console.log("Total is not a valid number");
    }
  }, [total]);

  const steps = [
    {
      title: "Emergency Video",
      content:
        emergencyNumber !== null ? (
          <VideoComponent
            videoUrl={data?.data[emergencyNumber]?.attributes.vedio_url || ""}
          />
        ) : (
          <Text>Loading video...</Text>
        ),
    },
    {
      title: "Important Information",
      content: emergencyNumber !== null && (
        <Text style={styles.infoText}>
          {data?.data[emergencyNumber]?.attributes.message}
        </Text>
      ),
    },
    {
      title: "Completion & Congratulations",
      content: (
        <Text style={styles.congratulationsText}>
          🎉 Congratulations! You have successfully completed the emergency
          service steps.
        </Text>
      ),
    },
  ];

  const next = () => setCurrent((prev) => (prev + 1) % steps.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + steps.length) % steps.length);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Help</Text>
      <View style={styles.contentWrapper}>
        {/* Vertical Step Indicator */}
        <View style={styles.stepIndicator}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  current === index && styles.activeCircle,
                ]}
              >
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              {/* <Text style={styles.stepTitle}>{step.title}</Text> */}
              {index < steps.length - 1 && <View style={styles.line} />}
            </View>
          ))}
        </View>

        {/* Step Content */}
        <ScrollView style={styles.contentContainer}>
          {steps[current].content}
        </ScrollView>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {current > 0 && (
          <TouchableOpacity style={styles.button} onPress={prev}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {current < steps.length - 1 ? (
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={next}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.finishButton]}
            onPress={() => Alert.alert("Emergency Service Completed!")}
          >
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxHeight: 500,
    width: "100%",
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 15,
  },
  stepItem: {
    alignItems: "center",
    marginVertical: 10,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#aaaaaa",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircle: {
    backgroundColor: "#4aae4f",
  },
  stepNumber: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  stepTitle: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    marginVertical: 5,
  },
  line: {
    width: 2,
    height: 30,
    backgroundColor: "#aaaaaa",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 15,
  },
 
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  congratulationsText: {
    fontSize: 18,
    textAlign: "center",
    color: "#4CAF50",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#888",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
  },
  finishButton: {
    backgroundColor: "#FF5722",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  videoContainer: {
    width: "100%",
    height: 250, // Limiting the height to avoid overflow
    overflow: "hidden",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  video: {
    flex: 1, // Ensures the video takes up the container's full height and width
  },
});

export default EmergencyService;
