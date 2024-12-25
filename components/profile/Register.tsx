import toastConfig from "@/lib/ToastConfig";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Add this import

import { storeTokenInSecureStore } from "@/lib/auth/token";
import { storeAuthToken, storeUserInfo } from "@/redux/slice/authSlice";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

// Zod schema for form validation
const registerSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  age: z.string().nonempty("Age is required"),
  phone: z.string().nonempty("Phone number is required"),
  gender: z.string().nonempty("Gender is required"),
  language: z.string().nonempty("Language is required"),
  currentDay: z.number(),
});

function RegisterPage({
  handleLoginRegister,
}: {
  handleLoginRegister: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [isGenderDropdownVisible, setIsGenderDropdownVisible] = useState(false);
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] =
    useState(false);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const languageOptions = [
    { label: "English", value: "English" },
    { label: "Bangla", value: "Bangla" },
  ];

  interface DropdownItem {
    label: string;
    value: string;
  }

  const renderDropdownItem = (item: DropdownItem, field: string) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        handleChange(field, item.value);
        field === "gender"
          ? setIsGenderDropdownVisible(false)
          : setIsLanguageDropdownVisible(false);
      }}
    >
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentDate = new Date().toISOString();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    gender: "",
    language: "",
    currentDay: 1,
    startDate: currentDate,
  });
  const [registerUser] = useRegisterUserMutation();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    console.log(formData, "this is form data");
    try {
      // Validate form data with Zod
      registerSchema.parse(formData);

      const result: any = await registerUser(formData);
      setLoading(true);

      if (result?.error) {
        if (result?.error?.error?.message === "This attribute must be unique") {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Phone is already in use.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: result?.error?.error?.message,
          });
        }
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "User created successfully",
        });
        storeTokenInSecureStore(result?.data?.jwt);
        dispatch(storeAuthToken(result?.data?.jwt));
        dispatch(storeUserInfo(result?.data?.user));
        router.push("/");
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((e) =>
          Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: e.message,
          })
        );
      } else {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An unexpected error occurred",
        });
      }
    } finally {
      // Ensure loading stops even if validation fails
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View>
            <Text style={styles.title}>Register</Text>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Username<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                onChangeText={(value) => handleChange("username", value)}
                value={formData.username}
              />
            </View>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Email<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                onChangeText={(value) => handleChange("email", value)}
                value={formData.email}
              />
            </View>
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Password <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  onChangeText={(value) => handleChange("password", value)}
                  value={formData.password}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Icon
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Age Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Age<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                keyboardType="numeric"
                onChangeText={(value) => handleChange("age", value)}
                value={formData.age}
              />
            </View>
            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Phone<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                onChangeText={(value) => handleChange("phone", value)}
                value={formData.phone}
              />
            </View>
            {/* Gender Dropdown */}
            <View style={styles.container}>
              {/* Gender Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Gender<Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setIsGenderDropdownVisible(true)}
                >
                  <Text style={styles.dropdownText}>
                    {formData.gender || "Select Gender"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Gender Modal */}
              <Modal
                transparent
                visible={isGenderDropdownVisible}
                animationType="fade"
                onRequestClose={() => setIsGenderDropdownVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <FlatList
                      data={genderOptions}
                      keyExtractor={(item) => item.value}
                      renderItem={({ item }) =>
                        renderDropdownItem(item, "gender")
                      }
                    />
                  </View>
                </View>
              </Modal>

              {/* Language Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Language<Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setIsLanguageDropdownVisible(true)}
                >
                  <Text style={styles.dropdownText}>
                    {formData.language || "Select Language"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Language Modal */}
              <Modal
                transparent
                visible={isLanguageDropdownVisible}
                animationType="fade"
                onRequestClose={() => setIsLanguageDropdownVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <FlatList
                      data={languageOptions}
                      keyExtractor={(item) => item.value}
                      renderItem={({ item }) =>
                        renderDropdownItem(item, "language")
                      }
                    />
                  </View>
                </View>
              </Modal>
            </View>
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Loading..." : "Register"} {/* Show loading text */}
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.link} onPress={() => handleLoginRegister()}>
                Login
              </Text>
            </Text>
            <Toast config={toastConfig} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  required: {
    color: "red",
  },
  inputPassword: {
    height: 40,
    paddingHorizontal: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  pickerItem: {
    color: "#000", // Ensure the text is visible
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    // paddingHorizontal: 8,
  },
  togglePassword: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "#007bff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#666",
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
  },
  picker: {
    // height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default RegisterPage;
