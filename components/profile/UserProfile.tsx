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
import React, { useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Modal, Portal, Provider } from "react-native-paper";
import { WebView } from "react-native-webview";
import ChengePassword from "./profileData/ChengePassword";
import CompletedDay from "./profileData/CompletedDay";
import EditPost from "./profileData/EditPost";
import RestartJourney from "./profileData/RestartJourney";
import UserInfo from "./profileData/UserInfo";

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
    userId: 13 || 0,
  });
  const richText = useRef();

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

  console.log(valueEditor);

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

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.profileBigText}> Profile</Text>
        <View style={styles.profileSection}>
          <UserInfo
            name={name || ""}
            email={email || ""}
            age={age || 0}
            compliteDay={compliteDay || 0}
            location={location || ""}
          />
          <RestartJourney handleRestart={handleRestart} />
          <ChengePassword
            showPasswordModal={showPasswordModal}
            confirmPassword={confirmPassword}
            currentPassword={currentPassword}
            handlePasswordCancel={handlePasswordCancel}
            handlePasswordOk={handlePasswordOk}
            isPasswordModalVisible={isPasswordModalVisible}
            newPassword={newPassword}
            setConfirmPassword={setConfirmPassword}
            setCurrentPassword={setCurrentPassword}
            setNewPassword={setNewPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleImageUploadModal}
          >
            <Text style={styles.buttonText}>Upload Profile Image</Text>
          </TouchableOpacity>
          <CompletedDay progressData={progressData} />
        </View>
        <Text style={styles.mainTexts}>My Posts</Text>
        {postsByUser &&
          postsByUser.map((post) => (
            <View key={post.id} style={styles.postContainer}>
              <WebView
                source={{
                  html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <style>
                        body {
                          font-size: 18px;
                          font-family: Arial, sans-serif;
                          margin: 0;
                          padding: 0;
                          color: #333;
                          overflow: hidden;
                        }
                      </style>
                    </head>
                    <body>
                      ${post.attributes.description
                        .split(" ")
                        .slice(0, 5)
                        .join(" ")}
                    
                    </body>
                  </html>
                `,
                }}
                style={styles.webView}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => showPostModal(post)}
              >
                <Text style={styles.buttonText}>Edit Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => showDeletePostModal(post.id)}
              >
                <Text style={styles.buttonText}>Delete Post</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={isPostModalVisible}
          onDismiss={handlePostCancel}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Edit Post</Text>
          <EditPost defaultValue="" />

          <Button mode="contained" onPress={handlePostOk}>
            Save
          </Button>
          <Button mode="text" onPress={handlePostCancel}>
            Cancel
          </Button>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={isDeleteModalVisible}
          onDismiss={handleDeleteCancel}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Delete Post</Text>
          <Text>Are you sure you want to delete this post?</Text>
          <Button mode="contained" onPress={handleDeleteOk}>
            Delete
          </Button>
          <Button mode="text" onPress={handleDeleteCancel}>
            Cancel
          </Button>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={isImageUploadModalVisible}
          onDismiss={handleImageUploadModalCancel}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Upload Profile Image</Text>
          {/* Include ImagePicker code or similar here */}
          <Button mode="contained" onPress={handleImageUpload}>
            Upload
          </Button>
          <Button mode="text" onPress={handleImageUploadModalCancel}>
            Cancel
          </Button>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  profileSection: {
    marginBottom: 20,
  },
  profileBigText: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  mainTexts: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#676c73",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },

  postContainer: {
    marginBottom: 20,
    borderWidth: 0.2,
    padding: 7,
    borderRadius: 5,
  },
  webView: {
    height: 150, // Adjust height as needed
    borderWidth: 0.2,
    marginBottom: 10,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  toolbar: {
    backgroundColor: "#f1f1f1",
  },
});

export default ProfilePage;
