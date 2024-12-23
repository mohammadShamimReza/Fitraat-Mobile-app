import { useGetDaysByDayIdQuery } from "@/redux/api/dayApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearDayData } from "@/redux/slice/daySlice";
import { storeCurrentTask } from "@/redux/slice/taskSlice";
import { KegelTimes, Quizzes } from "@/types/contantType";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Href, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import CompletedAuthTask from "./CompletedAuthTask";
import TaskPage from "./TaskPage";

function AuthMyTask({
  authDayDataId,
  userId,
  paid,
  daysLeft,
}: {
  authDayDataId: number;
  userId: number;
  paid: boolean | undefined;
  daysLeft: number;
}) {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [dayId, setDayId] = useState(authDayDataId);

  const tasks = ["video", "kagel", "quiz", "Blog"];

  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const defaultLocalStorageData = {
    video: false,
    kagel: false,
    quiz: false,
    Blog: false,
  };
  const selectedTask =
    useAppSelector((state) => state.taskSlice.currentTask) ||
    tasks[selectedTaskIndex];
  const [localStorageData, setLocalStorageData] = useState({
    video: false,
    kagel: false,
    quiz: false,
    Blog: false,
  });

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const { data: authenticatedDayData } = useGetDaysByDayIdQuery(authDayDataId);

  useEffect(() => {
    const loadLocalStorageData = async () => {
      const data = await AsyncStorage.getItem("AuthDay");
      if (data) {
        setLocalStorageData(JSON.parse(data));
      }
    };

    loadLocalStorageData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("AuthDay", JSON.stringify(localStorageData));
  }, [localStorageData]);

  const handleTaskClick = (index: number) => {
    setSelectedTaskIndex(index);
    dispatch(storeCurrentTask(tasks[index]));
  };

  const handlePrevious = () => {
    if (selectedTaskIndex > 0) {
      setSelectedTaskIndex(selectedTaskIndex - 1);
      dispatch(storeCurrentTask(tasks[selectedTaskIndex - 1]));
    }
  };

  const handleNext = async () => {
    if (selectedTask === "Blog") {
      setLocalStorageData((prevState: typeof localStorageData) => ({
        ...prevState,
        [selectedTask]: true,
      }));
      setLocalStorageData(defaultLocalStorageData);
      setSelectedTaskIndex(0);
      dispatch(clearDayData());

      setIsFinishModalOpen(true);
      dispatch(storeCurrentTask(tasks[0]));

      if (authDayDataId === 40) {
        setLocalStorageData((prevState: typeof localStorageData) => ({
          ...prevState,
          [selectedTask]: true,
        }));
      } else {
        AsyncStorage.setItem("AuthDay", JSON.stringify(localStorageData));
      }
      const nextDayId = authDayDataId + 1;

      if (nextDayId === 40) {
        Toast.show({
          type: "success",
          text1: "Hurray! This is your last day of tasks.",
          text2: "You become a Spartan!",
        });
        await AsyncStorage.setItem("AuthDayId", nextDayId.toString());
        router.replace("/FreeBlogs" as Href<"/FreeBlogs">);
      } else if (nextDayId > 40) {
        Toast.show({
          type: "success",
          text1: "Congratulations!",
          text2: "You have successfully completed all tasks.",
        });
        router.replace("/CompletedTask" as Href<"/CompletedTask">);
      } else {
        console.log("this is data");
        await AsyncStorage.setItem("AuthDayId", nextDayId.toString());
        router.replace("/CompletedTask" as Href<"/CompletedTask">);
      }
    } else {
      setLocalStorageData((prevState: typeof localStorageData) => ({
        ...prevState,
        [selectedTask]: true,
      }));
      setSelectedTaskIndex(selectedTaskIndex + 1);
      dispatch(storeCurrentTask(tasks[selectedTaskIndex + 1]));
    }
  };

  const handleOk = () => {
    setIsFinishModalOpen(false);
    router.replace("/FreeBlogs" as Href<"/FreeBlogs">);
  };

  const [blog, setBlog] = useState<{
    id: number | undefined;
    title: string | undefined;
    content: string | undefined;
  }>({
    id: 1,
    title: "",
    content: "",
  });

  const [kegel, setKegel] = useState<KegelTimes[] | undefined>(undefined);
  const [quiz, setQuiz] = useState<Quizzes[] | undefined>(undefined);
  const [video, setVideo] = useState<{ videoUrl: string | undefined }>({
    videoUrl: "",
  });

  useEffect(() => {
    if (
      authenticatedDayData &&
      authenticatedDayData.data &&
      authenticatedDayData.data.length > 0
    ) {
      const authDayData = authenticatedDayData?.data[0].attributes;
      if (authDayData) {
        setBlog({
          id: authDayData.blog.data.id,
          title: authDayData.blog.data.attributes.title,
          content: authDayData.blog.data.attributes.content,
        });
        setQuiz(authDayData?.quizzes.data);
        setVideo({ videoUrl: authDayData.video.data.attributes.VideoUrl });
        setKegel(authDayData?.kegel.data.attributes.kegel_times.data);
      }
    }
  }, [authenticatedDayData]);
  const handleDayid = (id: string) => {
    setDayId(parseInt(id));
  };
  const DayCount = authDayDataId;

  return (
    <View style={styles.container}>
      <Modal visible={isFinishModalOpen} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Hurray! You have finished another Day! Congratulations
          </Text>
          <Image
            source={require("../../assets/images/dayFinish.gif")}
            style={styles.finishImage}
          />
          <Button title="OK" onPress={handleOk} />
        </View>
      </Modal>
      {DayCount > 40 ? (
        <CompletedAuthTask auth={true} daysCompleted={40} />
      ) : authDayDataId <= daysLeft ? (
        <TaskPage
          localStorageData={localStorageData}
          handleTaskClick={handleTaskClick}
          selectedTask={selectedTask}
          selectedTaskIndex={selectedTaskIndex}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          blog={blog}
          quiz={quiz}
          video={video}
          kegel={kegel}
          DayCount={DayCount}
          paid={paid}
          daysLeft={daysLeft}
        />
      ) : (
        <View style={styles.containerComplete}>
          {/* Congratulations Message */}
          <View style={styles.messageContainer}>
            <FontAwesome5
              name="smile-beam"
              size={48}
              color="#FBBF24"
              style={styles.icon}
            />
            <Text style={styles.title}>Congratulations!</Text>
            <Text style={styles.description}>
              You've successfully completed your tasks for the day. 🎉
            </Text>
            <Text style={styles.tip}>
              Pro Tip: Stay on track by exploring a blog or a book to keep
              yourself motivated.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.blogButton]}>
              <Text style={styles.buttonText}>Explore Blogs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.booksButton]}>
              <Text style={styles.buttonText}>Browse Books</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  finishImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  congratulationsText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  containerComplete: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  tip: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16, // Adjust spacing for older React Native versions
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  blogButton: {
    backgroundColor: "#3B82F6", // Blue button
  },
  booksButton: {
    backgroundColor: "#10B981", // Green button
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default AuthMyTask;
