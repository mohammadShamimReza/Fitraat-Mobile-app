import { KegelTimes, Quizzes } from "@/types/contantType";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const { colors } = useTheme();
  const tasks: (keyof typeof localStorageData)[] = [
    "video",
    "kagel",
    "quiz",
    "Blog",
  ];
  const [collapsed, setCollapsed] = useState(true); // Sidebar starts collapsed
  const [sidebarWidth] = useState(new Animated.Value(60)); // Initial width

  console.log(localStorageData, "this is localStorageData");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    Animated.timing(sidebarWidth, {
      toValue: collapsed ? 300 : 60, // Change the width accordingly
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Define icons with dynamic color based on selection state
  const getIconColor = (task: string) =>
    selectedTask === task ? "#0578EA" : "black";

  const icons = [
    <Ionicons name="videocam" size={24} color={getIconColor("video")} />,
    <MaterialCommunityIcons
      name="yoga"
      size={24}
      color={getIconColor("kagel")}
    />,
    <MaterialCommunityIcons
      name="test-tube"
      size={24}
      color={getIconColor("quiz")}
    />,
    <FontAwesome
      name="pencil-square-o"
      size={24}
      color={getIconColor("Blog")}
    />,
  ];

  const allDays = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <View style={{ flex: 1, padding: 8, backgroundColor: colors.background }}>
      <View style={{ flexDirection: "row", borderRadius: 8, flex: 1 }}>
        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            { width: sidebarWidth, backgroundColor: colors.card },
          ]}
        >
          <View style={styles.sidebarContent}>
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
            {!collapsed && (
              <Text style={[styles.sidebarTitle, { color: colors.text }]}>
                Tasks
              </Text>
            )}
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {React.cloneElement(icons[index], {
                    color: selectedTask === task ? "white" : "black",
                  })}
                  {!collapsed && (
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
                  )}
                </View>
                {!collapsed && (
                  <FontAwesome
                    name="check-circle"
                    size={20}
                    color={localStorageData[task] ? "#0578EA" : "gray"}
                  />
                )}
              </TouchableOpacity>
            ))}
            {!collapsed && (
              <Text
                style={[
                  styles.sidebarTitle,
                  { marginTop: 32, color: colors.text },
                ]}
              >
                Days
              </Text>
            )}
            <ScrollView
              style={{
                maxHeight: 200,
                marginTop: collapsed === true ? 70 : "auto",
              }}
            >
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
                  onPress={() => DayCount >= day && handleDayid(day.toString())}
                  disabled={DayCount < day}
                >
                  {collapsed && (
                    <Text
                      style={{
                        color: DayCount === day ? "white" : colors.text,
                      }}
                    >
                      {day}
                    </Text>
                  )}
                  {!collapsed && (
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
                            DayCount === day ? colors.background : colors.text,
                        }}
                      >
                        Day: {day}
                      </Text>
                      <Text
                        style={{ color: DayCount === day ? "white" : "black" }}
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
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        {/* Main Content */}
        {collapsed === true && (
          <View style={styles.mainContent}>
            <View style={styles.mainHeader}>
              <Text style={[styles.dayText, { color: colors.text }]}>
                Day: {DayCount}
              </Text>
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
                <SuggestedBlog blog={blog} selectedTask={selectedTask} />
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
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                onPress={handlePrevious}
                style={[styles.navButton, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                style={[styles.navButton, { backgroundColor: colors.primary }]}
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
  sidebarContent: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
  closeButton: {
    padding: 8,
    alignItems: "center",
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  taskItem: {
    padding: 10,
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
    paddingLeft: 16,
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
