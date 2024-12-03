import { useGetDaysByDayIdQuery } from "@/redux/api/dayApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { storeCurrentTask } from "@/redux/slice/taskSlice";
import { getUserDayData, saveUserDayData } from "@/shared/StoreDayData";
import { KegelTimes, Quizzes } from "@/types/contantType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Href, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import CompletedFreeTask from "./CompletedFreeTask";
import TaskPage from "./TaskPage";

function UnAuthTask({ paid }: { paid: boolean | undefined }) {
  const navigation = useNavigation();
  const [unAuthDayId, setUnAuthDayId] = useState("1");

  const { data: unAuthenticatedDayData } = useGetDaysByDayIdQuery(
    parseInt(unAuthDayId)
  );

  useEffect(() => {
    const loadDayId = async () => {
      const dayId = (await AsyncStorage.getItem("unAuthDayId")) || "1";
      if (parseInt(dayId) > 3) {
        router.replace("/CompletedFreeTask" as Href<"/CompletedFreeTask">);
      }
      setUnAuthDayId(dayId);
    };

    loadDayId();
  }, []);

  const tasks = ["video", "kagel", "quiz", "Blog"];

  const currentTask = useAppSelector((state) => state.taskSlice.currentTask);
  const dispatch = useAppDispatch();

  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const selectedTask = currentTask || tasks[selectedTaskIndex];

  const defaultLocalStorageData = {
    video: false,
    kagel: false,
    quiz: false,
    Blog: false,
  };

  const [localStorageData, setLocalStorageData] = useState(
    defaultLocalStorageData
  );
  useEffect(() => {
    const loadLocalStorageData = async () => {
      const data = await getUserDayData("UnAuthDay");
      setLocalStorageData(data || defaultLocalStorageData);
    };

    loadLocalStorageData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      await saveUserDayData("UnAuthDay", localStorageData);
    };
    storeData();
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

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

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

      let parsedUnAuthDayId = parseInt(unAuthDayId);
      if (parsedUnAuthDayId >= 3) {
        Toast.show({
          type: "success",
          text1: "Congratulations",
          text2: "You have completed your tasks for the free days.",
        });
        router.replace("/CompletedFreeTask" as Href<"/CompletedFreeTask">);
      } else {
        parsedUnAuthDayId += 1;
        if (parsedUnAuthDayId === 3) {
          Toast.show({
            type: "success",
            text1: "This is your last day of free task.",
            text2: "Upgrade membership to access pro content.",
          });
        }
        await AsyncStorage.setItem("unAuthDayId", parsedUnAuthDayId.toString());
        setUnAuthDayId(parsedUnAuthDayId.toString());
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
    router.replace("/freeBlogs" as Href<"/freeBlogs">);
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
      unAuthenticatedDayData &&
      unAuthenticatedDayData.data &&
      unAuthenticatedDayData.data.length > 0
    ) {
      const unAuthDayData = unAuthenticatedDayData.data[0].attributes;
      if (unAuthDayData) {
        setBlog({
          id: unAuthDayData.blog.data.id,
          title: unAuthDayData.blog.data.attributes.title,
          content: unAuthDayData.blog.data.attributes.content,
        });
        setQuiz(unAuthDayData.quizzes.data);
        setVideo({
          videoUrl: unAuthDayData.video.data.attributes.VideoUrl,
        });
        setKegel(unAuthDayData.kegel.data.attributes.kegel_times.data);
      }
    }
  }, [unAuthenticatedDayData, unAuthDayId]);
  const DayCount = parseInt(unAuthDayId) || 0;

  const handleDayid = (id: string) => {
    setUnAuthDayId(id.toString());
  };

  return (
    <>
      {isFinishModalOpen && (
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Hurra! You have finished another Day! Congratulations
          </Text>
          <Image
            source={require("../../assets/images/dayFinish.gif")}
            style={styles.finishImage}
            resizeMode="contain"
          />
          <Button title="OK" onPress={handleOk} />
        </View>
      )}
      {DayCount > 4 ? (
        <CompletedFreeTask />
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
          DayCount={DayCount}
          handleDayid={handleDayid}
          paid={paid}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  finishImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default UnAuthTask;
