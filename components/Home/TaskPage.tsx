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
  const [sidebarWidth] = useState(new Animated.Value(55)); // Initial width

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    Animated.timing(sidebarWidth, {
      toValue: collapsed ? 300 : 55, // Change the width accordingly
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
                    <>
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
                    </>
                  )}
                  {!collapsed && (
                    <FontAwesome
                      name="check-circle"
                      size={20}
                      color={DayCount >= day ? "blue" : "gray"}
                    />
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

            <ScrollView contentContainerStyle={styles.taskContainer}>
              <Text style={[styles.taskHeader, { color: colors.text }]}>
                {tasks[selectedTaskIndex].replace(/^\w/, (c) =>
                  c.toUpperCase()
                )}
              </Text>
              {/* Render the appropriate component based on selectedTask */}
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
            </ScrollView>

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
    padding: 8,
    borderRadius: 8,
  },
  sidebarContent: {
    justifyContent: "space-between",
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  closeButton: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  taskItem: {
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  dayItem: {
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    justifyContent: "space-between",
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleButton: {
    marginRight: 16,
  },
  dayText: {
    fontSize: 24,
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
  taskHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  taskContainer: {
    flex: 1,
    marginTop: 16,
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
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default TaskPage;