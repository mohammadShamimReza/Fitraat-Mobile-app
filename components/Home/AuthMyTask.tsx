import { useGetDaysByDayIdQuery } from "@/redux/api/dayApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { storeCurrentTask } from "@/redux/slice/taskSlice";
import { KegelTimes, Quizzes } from "@/types/contantType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, Modal, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import TaskPage from "./TaskPage";

function AuthMyTask({
  authDayDataId,
  userId,
  paid,
}: {
  authDayDataId: number;
  userId: number;
  paid: boolean | undefined;
}) {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [dayId, setDayId] = useState(authDayDataId);

  const tasks = ["video", "kagel", "quiz", "Blog"];

  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
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
      setIsFinishModalOpen(true);
      dispatch(storeCurrentTask(tasks[0]));
      setLocalStorageData({
        video: false,
        kagel: false,
        quiz: false,
        Blog: false,
      });

      const nextDayId = authDayDataId + 1;

      if (nextDayId === 40) {
        Toast.show({
          type: "success",
          text1: "Hurray! This is your last day of tasks.",
          text2: "You become a Spartan!",
        });
        await AsyncStorage.setItem("AuthDayId", nextDayId.toString());
        router.replace("/FreeBlogs");
      } else if (nextDayId > 40) {
        Toast.show({
          type: "success",
          text1: "Congratulations!",
          text2: "You have successfully completed all tasks.",
        });
        router.replace("/CompletedTask");
      } else {
        await AsyncStorage.setItem("AuthDayId", nextDayId.toString());
        router.replace("/FreeBlogs");
      }
    } else {
      setLocalStorageData((prevState) => ({
        ...prevState,
        [selectedTask]: true,
      }));
    }

    if (selectedTaskIndex < tasks.length - 1) {
      setSelectedTaskIndex(selectedTaskIndex + 1);
      dispatch(storeCurrentTask(tasks[selectedTaskIndex + 1]));
    }
  };

  const handleOk = () => {
    setIsFinishModalOpen(false);
    router.replace("/FreeBlogs");
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
      {authDayDataId > 40 ? (
        <View style={styles.container}>
          <Text style={styles.congratulationsText}>
            Congratulations, you have completed all your tasks!
          </Text>
        </View>
      ) : (
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
          DayCount={authDayDataId}
          handleDayid={handleDayid}
          paid={paid}
        />
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
});

export default AuthMyTask;
