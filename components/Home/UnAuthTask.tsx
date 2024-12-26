import toastConfig from "@/lib/ToastConfig";
import { useGetDaysByDayIdQuery } from "@/redux/api/dayApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearDayData } from "@/redux/slice/daySlice";
import { storeCurrentTask } from "@/redux/slice/taskSlice";
import { getUserDayData, saveUserDayData } from "@/shared/StoreDayData";
import { KegelTimes, Quizzes } from "@/types/contantType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Link, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import CompletedFreeTask from "./CompletedFreeTask";
import TaskPage from "./TaskPage";

type TabParamList = {
  index: undefined;
  feed: undefined;
  blog: undefined;
  profile: undefined;
  menu: undefined;
};

function UnAuthTask({
  paid,
  daysLeft,
}: {
  paid: boolean | undefined;
  daysLeft: number;
}) {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [unAuthDayId, setUnAuthDayId] = useState("1");

  const { data: unAuthenticatedDayData } = useGetDaysByDayIdQuery(
    parseInt(unAuthDayId)
  );

  useEffect(() => {
    const loadDayId = async () => {
      const dayId = (await AsyncStorage.getItem("unAuthDayId")) || "1";
      if (parseInt(dayId) > 3) {
        // router.replace("CompletedFreeTask" as Href<"CompletedFreeTask">);
        await AsyncStorage.setItem("unAuthDayId", "1");
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
      setLocalStorageData((prevState: typeof localStorageData) => ({
        ...prevState,
        [selectedTask]: true,
      }));
      setLocalStorageData(defaultLocalStorageData);
      setSelectedTaskIndex(selectedTaskIndex + 1);
      dispatch(storeCurrentTask(tasks[selectedTaskIndex + 1]));
      dispatch(clearDayData());
      setSelectedTaskIndex(0);
      setIsFinishModalOpen(true);

      dispatch(storeCurrentTask(tasks[0]));
      AsyncStorage.setItem(
        "UnAuthDay",
        JSON.stringify(defaultLocalStorageData)
      );
      const unAuthDayId = await AsyncStorage.getItem("unAuthDayId");
      if (unAuthDayId === null) {
        // First-time setup for unAuthDayId
        await AsyncStorage.setItem("unAuthDayId", "1");
      } else {
        await AsyncStorage.setItem(
          "unAuthDayId",
          (parseInt(unAuthDayId) + 1).toString()
        );
        const newDayData = parseInt(unAuthDayId) + 1;
        setUnAuthDayId(newDayData.toString());
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
    navigation.navigate("blog"); // Navigate to blog
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

  return (
    <>
      <Toast config={toastConfig} />
      <Modal visible={isFinishModalOpen} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {parseInt(unAuthDayId) === 3
              ? "This is your last day of free task. For farther become pro!"
              : parseInt(unAuthDayId) > 3
              ? "Congratulations! You have successfully completed all free tasks."
              : "Hurray! You have finished another Day! Congratulations!"}
          </Text>
          <Image
            source={require("../../assets/images/dayFinish.gif")}
            style={styles.finishImage}
          />
          <Text>
            {parseInt(unAuthDayId) >= 3
              ? "Celebrate your achievement! You are unstoppable!"
              : "Read some blogs and continue your journey of growth!"}
          </Text>
          {parseInt(unAuthDayId) === 3 && (
            <Link to="/payment" style={styles.button}>
              <Text style={styles.buttonText}>Pro Member</Text>
            </Link>
          )}

          <Button title="OK" onPress={handleOk} />
        </View>
      </Modal>
      {DayCount >= 4 ? (
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
          paid={paid}
          daysLeft={daysLeft}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    top: 150,
    borderWidth: 1,
    borderColor: "#000",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  finishImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#818385",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default UnAuthTask;
