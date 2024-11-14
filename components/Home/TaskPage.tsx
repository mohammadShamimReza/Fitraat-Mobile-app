import { KegelTimes, Quizzes } from "@/types/contantType";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EmergencyButton from "./EmergencyButton";
import SuggestedBlog from "./taskPages/Blog";
import Kagel from "./taskPages/Kagel";
import Quiz from "./taskPages/Quiz";
import VideoComponent from "./taskPages/Vedio";

type TaskPageProps = {
  localStorageData: {
    video: boolean;
    kagel: boolean;
    quiz: boolean;
    Blog: boolean;
  };
  handleTaskClick: (index: number) => void;
  selectedTask: string;
  selectedTaskIndex: number;
  handlePrevious: () => void;
  handleNext: () => void;
  blog: {
    id: number | undefined;
    title: string | undefined;
    content: string | undefined;
  };
  quiz: Quizzes[] | undefined;
  video: {
    videoUrl: string | undefined;
  };
  kegel: KegelTimes[] | undefined;
  DayCount: number; // Explicitly typed
  handleDayid: (id: string) => void;
  paid: boolean | undefined;
};

// AsyncStorage keys
const ALLOWED_KEYS = {
  AUTH_DAY: "AuthDay",
  UNAUTH_DAY: "UnAuthDay",
};

const TaskPage: React.FC<TaskPageProps> = ({
  localStorageData,
  handleTaskClick,
  selectedTask,
  selectedTaskIndex,
  handlePrevious,
  handleNext,
  blog,
  quiz,
  video,
  kegel,
  DayCount,
  handleDayid,
  paid,
}) => {
  const handleEmergencyPress = () => {
    router.push("/emergency");
  };
  const { colors } = useTheme();
  const tasks: (keyof typeof localStorageData)[] = [
    "video",
    "kagel",
    "quiz",
    "Blog",
  ];
  const [collapsed, setCollapsed] = useState(true); // Sidebar starts collapsed
  const [sidebarWidth] = useState(new Animated.Value(0)); // Initial width

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    Animated.timing(sidebarWidth, {
      toValue: collapsed ? 300 : 0, // Change the width accordingly
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Define icons with dynamic color based on selection state
  const getIconColor = (task: string) =>
    selectedTask === task ? "#0578EA" : "black";

  const allDays = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <View
      style={{ flex: 1, paddingTop: 40, backgroundColor: colors.background }}
    >
      <View style={{ flexDirection: "row", borderRadius: 8, flex: 1 }}>
        {/* Sidebar */}

        <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
          <View>
            {/* Close/Open Button */}

            {/* Render the rest of the sidebar content only if not collapsed */}
            {!collapsed && (
              <>
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name={collapsed ? "menu" : "close"}
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
                {/* Sidebar Title */}
                <Text style={[styles.sidebarTitle, { color: colors.text }]}>
                  Tasks
                </Text>

                {/* Task Items */}
                {tasks.map((task, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.taskItem,
                      {
                        backgroundColor:
                          selectedTask === task ? colors.primary : colors.card,
                        opacity: localStorageData[task] === false ? 0.5 : 1,
                      },
                    ]}
                    onPress={() =>
                      localStorageData[task] === true && handleTaskClick(index)
                    }
                    disabled={localStorageData[task] === false}
                  >
                    <Text
                      style={[
                        styles.taskText,
                        {
                          color: selectedTask === task ? "white" : "black",
                        },
                      ]}
                    >
                      {task.replace(/^\w/, (c) => c.toUpperCase())}
                    </Text>
                    <FontAwesome
                      name="check-circle"
                      size={20}
                      color={localStorageData[task] ? "#0578EA" : "gray"}
                    />
                  </TouchableOpacity>
                ))}

                {/* Days Title */}
                <Text
                  style={[
                    styles.sidebarTitle,
                    { marginTop: 32, color: colors.text },
                  ]}
                >
                  Days
                </Text>

                {/* Day Items */}
                <ScrollView style={{ maxHeight: 200, marginTop: "auto" }}>
                  {allDays.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayItem,
                        {
                          backgroundColor:
                            DayCount === day ? colors.primary : colors.card,
                          opacity: DayCount >= day ? 1 : 0.5,
                        },
                      ]}
                      onPress={() =>
                        DayCount >= day && handleDayid(day.toString())
                      }
                      disabled={DayCount < day}
                    >
                      <View
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color:
                              DayCount === day
                                ? colors.background
                                : colors.text,
                          }}
                        >
                          Day: {day}
                        </Text>
                        <Text
                          style={{
                            color: DayCount === day ? "white" : "black",
                          }}
                        >
                          {paid === undefined || paid === false
                            ? day > 3
                              ? "Paid"
                              : "Demo"
                            : ""}
                        </Text>
                        <FontAwesome
                          name="check-circle"
                          size={20}
                          color={DayCount >= day ? "blue" : "gray"}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </Animated.View>

        {/* Main Content */}
        {collapsed === true && (
          <View style={styles.mainContent}>
            <View style={styles.mainHeader}>
              <TouchableOpacity
                onPress={toggleSidebar}
                style={styles.closeButton}
              >
                <Ionicons
                  name={collapsed ? "menu" : "close"}
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
              <Text style={[styles.dayText, { color: colors.text }]}>
                Day: {DayCount}
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EmergencyButton onPress={handleEmergencyPress} />
              </View>
              <View style={styles.rankContainer}>
                <Text style={[styles.rankText, { color: colors.text }]}>
                  Rank:
                </Text>
                <MaterialCommunityIcons
                  name="numeric-1-circle"
                  size={24}
                  color="red"
                />
              </View>
            </View>
            <View style={styles.taksContainer}>
              {selectedTask === "Blog" && (
                <SuggestedBlog
                  blog={blog}
                  selectedTask={selectedTask}
                  paid={paid}
                />
              )}
              {selectedTask === "kagel" && (
                <Kagel kegel={kegel} selectedTask={selectedTask} />
              )}
              {selectedTask === "quiz" && (
                <Quiz quiz={quiz} selectedTask={selectedTask} />
              )}
              {selectedTask === "video" && (
                <VideoComponent video={video} selectedTask={selectedTask} />
              )}
            </View>
            <View
              style={[
                styles.navigationButtons,
                {
                  justifyContent:
                    selectedTask === "video" ? "flex-end" : "space-between",
                },
              ]}
            >
              {selectedTask !== "video" && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={[styles.navButton, { backgroundColor: "#4B5563" }]}
                >
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleNext}
                style={[styles.navButton, { backgroundColor: "#4B5563" }]}
              >
                <Text style={styles.navButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 55,
    borderRadius: 8,
    overflow: "hidden",
  },

  closeButton: {
    paddingRight: 12,
    alignItems: "center",
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  taskItem: {
    // padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  dayItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  mainHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rankContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankText: {
    fontSize: 16,
    marginRight: 4,
  },
  taksContainer: {
    flex: 1,
    maxHeight: 500,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default TaskPage;
