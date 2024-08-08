import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { storeInitialRender } from "@/redux/slice/initialRenderSlice";
import { KegelTimes } from "@/types/contantType";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar, useTheme } from "react-native-paper";

const squizze = require("../../../assets/audio/squizze.mp3");
const stop = require("../../../assets/audio/stop.mp3");

function Kagel({
  selectedTask,
  kegel,
}: {
  selectedTask: string;
  kegel: KegelTimes[] | undefined;
}) {
  function getKegelTimes(text: string) {
    const numbersArray = text.split(/,\s*/);
    return numbersArray.map(Number);
  }

  const [times, setTimes] = useState<number>(0);
  const [kegelTimes, setKegelTimes] = useState<number[]>([2, 3]);
  const { colors } = useTheme();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    if (kegel && kegel.length > 0 && kegel[times]?.attributes.times) {
      const newTimes = getKegelTimes(kegel[times]?.attributes.times);
      setKegelTimes(newTimes);
    }
  }, [kegel, times]); // Run this effect only when `kegel` changes

  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(
    kegelTimes[currentTimeIndex] * 1000
  );

  const [timeLeft, setTimeLeft] = useState(currentTime);
  const [progressBarPercent, setProgressBarPercent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [type, setType] = useState("");

  const timerId = useRef<NodeJS.Timeout | undefined | number>(undefined);
  const isInitialRender = useRef(true);

  const initialRender = useAppSelector((state) => state.initialRenderSlice);
  const dispatch = useAppDispatch();
  const isMounted = useRef(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (initialRender.initialRender) {
      dispatch(storeInitialRender(false));
      return;
    } else if (!initialRender.initialRender && isMounted.current) {
      playSound(type === "Squizze" ? squizze : stop);
    }
  }, [dispatch, initialRender.initialRender, type]);

  const playSound = async (audioFile: any) => {
    const { sound } = await Audio.Sound.createAsync(audioFile);
    setSound(sound);
    await sound.playAsync();
  };

  const startTimer = () => {
    playSound(type === "Squizze" ? squizze : stop);
    isMounted.current = true;
    if (progressBarPercent === 100) {
      setTimeLeft(currentTime);
      setProgressBarPercent(0);
    }
    setIsRunning(true);
  };

  const stopTimer = () => {
    clearInterval(timerId.current);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning) {
      timerId.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 100);
      }, 100);

      return () => clearInterval(timerId.current);
    }
  }, [isRunning]);

  useEffect(() => {
    currentTimeIndex % 2 === 0 ? setType("Squizze") : setType("Stop");

    if (progressBarPercent < 100) {
      let updateProgressPercent = Math.round(
        ((currentTime - timeLeft) / currentTime) * 100
      );
      setProgressBarPercent(updateProgressPercent);
    } else if (progressBarPercent === 100) {
      if (currentTimeIndex + 1 === kegelTimes.length) {
        clearInterval(timerId.current);
        setIsRunning(false);
      } else {
        setCurrentTimeIndex(currentTimeIndex + 1);
        setCurrentTime(kegelTimes[currentTimeIndex] * 1000);
        setProgressBarPercent(0);

        setTimeLeft(kegelTimes[currentTimeIndex] * 1000);
      }
    }
  }, [
    currentTime,
    currentTimeIndex,
    timeLeft,
    isRunning,
    kegelTimes,
    progressBarPercent,
  ]);

  const handlePrevious = () => {
    if (kegel && kegel.length > 0 && times > 0) {
      setTimes(times - 1);
      setCurrentTimeIndex(0);
      setCurrentTime(kegelTimes[currentTimeIndex] * 1000);
      setProgressBarPercent(0);

      setTimeLeft(kegelTimes[currentTimeIndex] * 1000);
    }
  };

  const handleNext = () => {
    if (kegel && times < kegel.length - 1) {
      setTimes(times + 1);
      setCurrentTimeIndex(0);
      setCurrentTime(kegelTimes[currentTimeIndex] * 1000);
      setProgressBarPercent(0);

      setTimeLeft(kegelTimes[currentTimeIndex] * 1000);
    }
  };

  return (
    <View style={styles.container}>
      {selectedTask === "kagel" && (
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Kagel</Text>

          <Text style={styles.taskText}>
            <Text style={{ color: "red" }}>{type}</Text>, {times + 1}/
            {kegel?.length}
          </Text>
          <View style={styles.kegelTimesContainer}>
            {kegelTimes.map((time, index) => (
              <Text
                key={index}
                style={{
                  color: index === currentTimeIndex ? "red" : "black",
                  marginRight: 10,
                  fontSize: index === currentTimeIndex ? 25 : 16,
                }}
              >
                {time}s
              </Text>
            ))}
          </View>
          <ProgressBar
            progress={progressBarPercent / 100}
            color={colors.primary}
            style={styles.progressBar}
          />
          <View style={styles.buttonContainer}>
            <Button title="Start" onPress={startTimer} />
            <Button title="Stop" onPress={stopTimer} />
          </View>
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                (times === 0 || !kegel || kegel.length === 0) &&
                  styles.disabledButton,
              ]}
              onPress={handlePrevious}
              disabled={times === 0 || !kegel || kegel.length === 0}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                (!kegel || times === kegel.length - 1) && styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={!kegel || times === kegel.length - 1}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default Kagel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderWidth: 0.2,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskText: {
    fontSize: 20,
    marginBottom: 20,
  },
  kegelTimesContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  progressBar: {
    width: 200,
    height: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  navButtonText: {
    color: "white",
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: "lightgray",
  },
});
