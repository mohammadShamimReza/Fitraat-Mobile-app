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

   const icons = [
     <MaterialCommunityIcons name="video" size={20} />,
     <MaterialCommunityIcons name="yoga" size={20} />,
     <FontAwesome name="check-circle" size={20} />,
     <FontAwesome name="reddit" size={20} />,
   ];

   return (
     <View style={{ flex: 1, backgroundColor: colors.background }}>
       <View style={{ flexDirection: "row", borderRadius: 8, flex: 1 }}>
         {/* Sidebar */}

         {collapsed === false && (
           <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
             <TouchableOpacity
               onPress={toggleSidebar}
               style={styles.closeButton}
             >
               <Ionicons name={collapsed ? "menu" : "close"} size={24} />
             </TouchableOpacity>
             <Text style={styles.sidebarTitle}>Tasks</Text>

             {/* Render tasks */}
             {tasks.map((task, index) => {
               const isUnlocked = localStorageData[task];
               return (
                 <TouchableOpacity
                   key={index}
                   style={[
                     styles.taskItem,
                     {
                       backgroundColor:
                         selectedTask === task ? "#f0f8ff" : "#fff",
                       opacity: isUnlocked ? 1 : 0.5,
                     },
                   ]}
                   onPress={() => isUnlocked && handleTaskClick(index)}
                   disabled={!isUnlocked}
                 >
                   <View style={styles.taskTextContainer}>
                     <Text style={styles.taskText}>{icons[index]}</Text>
                     <Text>{task.charAt(0).toUpperCase() + task.slice(1)}</Text>
                   </View>
                   <FontAwesome
                     name="check-circle"
                     size={20}
                     color={isUnlocked ? "#0578EA" : "gray"}
                   />
                 </TouchableOpacity>
               );
             })}

             <Text style={styles.sidebarTitle}>Days</Text>
             <ScrollView>
               {allDays.map((day) => {
                 const isUnlocked = DayCount >= day;
                 const isPaidLocked = !paid && day > 3;

                 return (
                   <TouchableOpacity
                     key={day}
                     style={[
                       styles.dayItem,
                       {
                         backgroundColor: DayCount === day ? "#f0f8ff" : "#fff",
                         opacity: isUnlocked && !isPaidLocked ? 1 : 0.5,
                       },
                     ]}
                     onPress={() =>
                       isUnlocked && !isPaidLocked && handleTaskClick(day)
                     }
                     disabled={!isUnlocked || isPaidLocked}
                   >
                     <Text style={styles.dayText}>Day: {day}</Text>
                     <FontAwesome
                       name={isPaidLocked ? "lock" : "check-circle"}
                       size={20}
                       color={isUnlocked ? "#0578EA" : "gray"}
                     />
                   </TouchableOpacity>
                 );
               })}
             </ScrollView>
           </Animated.View>
         )}

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
    paddingLeft: 30,
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignContent: "center",
  },

  closeButton: {
    paddingRight: 12,
    alignItems: "center",
  },
  sidebarTitle: {
    padding: 10,
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
  taskTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    marginBottom: 26,
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
    // maxHeight: 500,
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
