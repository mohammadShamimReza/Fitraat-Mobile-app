import { useGetUserInfoQuery } from "@/redux/api/authApi";
import {
  useGetPostsByUserIdQuery,
  useUpdatePostMutation,
} from "@/redux/api/postApi";
import { useUpdateUserPasswordMutation } from "@/redux/api/userApi";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Modal, Portal, Provider } from "react-native-paper";
import ChengePassword from "./profileData/ChengePassword";
import CompletedDay from "./profileData/CompletedDay";
import MyPosts from "./profileData/MyPosts";
import RestartJourney from "./profileData/RestartJourney";
import UserInfo from "./profileData/UserInfo";

function ProfilePage() {
  const { data: getUserInfoData } = useGetUserInfoQuery();
  const [updateUserPassword] = useUpdateUserPasswordMutation();
  const [updatePost] = useUpdatePostMutation();
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isImageUploadModalVisible, setIsImageUploadModalVisible] =
    useState(false);
  const [currentPost, setCurrentPost] = useState(null);

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
  const membership = getUserInfoData?.paid || false;
  const paid = getUserInfoData?.paid || false;
  const startData = getUserInfoData?.startDate || Date.now();
  const today = new Date();
  const start = new Date(getUserInfoData?.startDate || new Date());
  const differenceInTime = today.getTime() - start.getTime();
  const daysLeft = Math.floor(differenceInTime / (1000 * 60 * 60 * 24)) + 1;

  const { data: posts } = useGetPostsByUserIdQuery({
    userId: userId || 0,
  });

  const postsByUser = posts?.data;

  const days = Array.from({ length: 40 }, (_, i) => i + 1);
  const progressData = days.map((day) => ({
    day,
    completed: day <= compliteDay,
  }));

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
        data: {
          currentPassword: currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        },
      });
      setIsPasswordModalVisible(false);
      if (result && "error" in result) {
        Alert.alert("Error", "current password is incorrect.");
      } else {
        Alert.alert("Success", "Password updated successfully!");
        resetPasswordForm();
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };
  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalVisible(false);
    resetPasswordForm();
  };

  // const handlePostOk = async () => {
  //   if (currentPost) {
  //     try {
  //       const result = await updatePost({
  //         body: {
  //           data: {
  //             description: valueEditor,
  //           },
  //         },
  //       });
  //       if (result) {
  //         Alert.alert("Success", "Post updated successfully!");
  //       } else {
  //         Alert.alert("Error", "Something went wrong. Please try again later.");
  //       }
  //       setIsPostModalVisible(false);
  //       setValueEditor("");
  //     } catch (error) {
  //       Alert.alert("Error", "Something went wrong. Please try again later.");
  //     }
  //   }
  // };

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
    // }
  };

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
            membership={membership || false}
          />
          <RestartJourney userId={userId || 0} />
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

          <Link href="/payment" style={styles.button}>
            <Text style={styles.buttonText}>Become Pro</Text>
          </Link>

          <CompletedDay progressData={progressData} />
        </View>
        <Text style={styles.mainTexts}>My Posts</Text>
        <MyPosts postsByUser={postsByUser} />
      </ScrollView>

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
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
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
