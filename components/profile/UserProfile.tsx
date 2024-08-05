import {
  useGetUserInfoQuery,
  useUpdateUserDayMutation,
} from "@/redux/api/authApi";
import {
  useDeletePostMutation,
  useGetPostsByUserIdQuery,
  useUpdatePostMutation,
} from "@/redux/api/postApi";
import { useUpdateUserPasswordMutation } from "@/redux/api/userApi";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal, Portal, Provider } from "react-native-paper";
import { WebView } from "react-native-webview";

function ProfilePage() {
  const { data: getUserInfoData } = useGetUserInfoQuery();
  const [updateUserDay] = useUpdateUserDayMutation();
  const [updateUserPassword] = useUpdateUserPasswordMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isImageUploadModalVisible, setIsImageUploadModalVisible] =
    useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [valueEditor, setValueEditor] = useState("<p>Start writing...</p>");
  const [profileImage, setProfileImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const name = getUserInfoData?.username;
  const age = getUserInfoData?.age;
  const email = getUserInfoData?.email;
  const compliteDay = getUserInfoData?.compliteDay || 0;
  const userId = getUserInfoData?.id;
  const location = getUserInfoData?.country;
  const paid = getUserInfoData?.paid || false;

  const { data: posts } = useGetPostsByUserIdQuery({
    userId: userId || 0,
  });

  const postsByUser = posts?.data;

  const days = Array.from({ length: 40 }, (_, i) => i + 1);
  const progressData = days.map((day) => ({
    day,
    completed: day <= compliteDay,
  }));

  const handleRestart = async () => {
    Alert.alert("Restart Journey", "Do you want to restart?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            const result = await updateUserDay({
              currentDay: 1,
              compliteDay: 0,
              userId: userId,
            });
            console.log(result);
            localStorage.setItem(
              "AuthDay",
              JSON.stringify({
                video: false,
                kagel: false,
                quiz: false,
                Blog: false,
              })
            );
            console.log(result);
            if (result) {
              Alert.alert(
                "Success",
                "You have successfully started your journey again!"
              );
            } else {
              Alert.alert(
                "Error",
                "Something went wrong. Please try again later."
              );
            }
          } catch (error) {
            console.error(error);
            Alert.alert(
              "Error",
              "Something went wrong. Please try again later."
            );
          }
        },
      },
    ]);
  };

  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const handlePasswordOk = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match!");
      return;
    }
    try {
      const result = await updateUserPassword({
        userId: userId,
        password: newPassword,
      });
      setIsPasswordModalVisible(false);
      if (result) {
        Alert.alert("Success", "Password updated successfully!");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalVisible(false);
  };

  const showPostModal = (post: any) => {
    setCurrentPost(post);
    setValueEditor(post.attributes.description);
    setIsPostModalVisible(true);
  };

  const handlePostOk = async () => {
    console.log("hi", valueEditor);

    if (currentPost) {
      try {
        const result = await updatePost({
          body: {
            data: {
              description: valueEditor,
            },
          },
        });
        console.log(result);
        if (result) {
          Alert.alert("Success", "Post updated successfully!");
        } else {
          Alert.alert("Error", "Something went wrong. Please try again later.");
        }
        setIsPostModalVisible(false);
        setValueEditor("");
      } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    }
  };

  const handlePostCancel = () => {
    setValueEditor("");
    setIsPostModalVisible(false);
  };

  const showDeletePostModal = (post: any) => {
    setCurrentPost(post);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    try {
      const result = await deletePost({ id: currentPost });
      if (result) {
        Alert.alert("Success", "Post deleted successfully!");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
      setIsDeleteModalVisible(false);
      setCurrentPost(null);
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setCurrentPost(null);
  };

  const handleImageUploadModal = () => {
    setIsImageUploadModalVisible(true);
  };

  const handleImageUploadModalCancel = () => {
    setIsImageUploadModalVisible(false);
  };

  const handleImageUpload = async () => {
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (status !== "granted") {
    //   Alert.alert(
    //     "Permission Denied",
    //     "Camera roll permissions are required to upload images."
    //   );
    //   return;
    // }
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });
    // if (!result.canceled) {
    //   const selectedImage = result.assets[0];
    //   const isValidSize = selectedImage.fileSize / 1024 / 1024 < 2; // Check if image size is less than 2MB
    //   if (!isValidSize) {
    //     Alert.alert("Error", "Image must be smaller than 2MB!");
    //     return;
    //   }
    //   setProfileImage(selectedImage.uri); // Set the image URI
    //   console.log("Uploaded Image:", selectedImage.uri); // Log the image URI
    // }
  };

  const editorHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          height: 100%;
        }
        #editor {
          height: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      <div id="editor" contenteditable="true">${valueEditor}</div>
      <script>
        const editor = document.getElementById('editor');
        editor.addEventListener('input', function() {
          window.ReactNativeWebView.postMessage(editor.innerHTML);
        });
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event: any) => {
    setValueEditor(event.nativeEvent.data);
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Profile</Text>

        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Name: {name}</Text>
          <Text style={styles.userInfoText}>Age: {age}</Text>
          <Text style={styles.userInfoText}>Email: {email}</Text>
          <Text style={styles.userInfoText}>Location: {location}</Text>
          <Text style={styles.userInfoText}>Days Completed: {compliteDay}</Text>
          <Text style={styles.userInfoText}>Paid: {paid ? "Yes" : "No"}</Text>
        </View>

        <Button title="Restart Journey" onPress={handleRestart} />

        <TouchableOpacity
          style={styles.uploadImageButton}
          onPress={handleImageUploadModal}
        >
          <Text style={styles.uploadImageButtonText}>Upload Profile Image</Text>
        </TouchableOpacity>

        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text>No profile image uploaded</Text>
          )}
        </View>

        <View style={styles.postsContainer}>
          {postsByUser?.map((post) => (
            <View key={post.id} style={styles.post}>
              <Text>{post.attributes.description}</Text>
              <Button title="Edit" onPress={() => showPostModal(post)} />
              <Button
                title="Delete"
                onPress={() => showDeletePostModal(post.id)}
              />
            </View>
          ))}
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressHeader}>Progress</Text>
          {progressData.map(({ day, completed }) => (
            <View key={day} style={styles.progressItem}>
              <Text style={styles.progressDay}>Day {day}</Text>
              <Text style={styles.progressStatus}>
                {completed ? "Completed" : "Not Completed"}
              </Text>
            </View>
          ))}
        </View>

        <Portal>
          <Modal
            visible={isPostModalVisible}
            onDismiss={handlePostCancel}
            contentContainerStyle={styles.modalContainer}
          >
            <Text>Edit Post</Text>
            <WebView
              originWhitelist={["*"]}
              source={{ html: editorHTML }}
              style={{ height: 300, width: "100%" }}
              onMessage={handleWebViewMessage}
            />
            <Button title="Save" onPress={handlePostOk} />
            <Button title="Cancel" onPress={handlePostCancel} />
          </Modal>

          <Modal
            visible={isDeleteModalVisible}
            onDismiss={handleDeleteCancel}
            contentContainerStyle={styles.modalContainer}
          >
            <Text>Are you sure you want to delete this post?</Text>
            <Button title="Yes" onPress={handleDeleteOk} />
            <Button title="No" onPress={handleDeleteCancel} />
          </Modal>

          <Modal
            visible={isImageUploadModalVisible}
            onDismiss={handleImageUploadModalCancel}
            contentContainerStyle={styles.modalContainer}
          >
            <Button title="Choose Image" onPress={handleImageUpload} />
            <Button title="Cancel" onPress={handleImageUploadModalCancel} />
          </Modal>

          <Modal
            visible={isPasswordModalVisible}
            onDismiss={handlePasswordCancel}
            contentContainerStyle={styles.modalContainer}
          >
            <Text>Change Password</Text>
            <TextInput
              placeholder="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />
            <Button title="Save" onPress={handlePasswordOk} />
            <Button title="Cancel" onPress={handlePasswordCancel} />
          </Modal>
        </Portal>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 18,
  },
  uploadImageButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadImageButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  postsContainer: {
    marginBottom: 20,
  },
  post: {
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f8ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  progressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  progressDay: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  progressStatus: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007bff",
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    padding: 10,
  },
});

export default ProfilePage;
