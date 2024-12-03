import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import RegisterPage from "@/components/profile/Register";
import { storeTokenInSecureStore } from "@/lib/auth/token";
import toastConfig from "@/lib/ToastConfig";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { storeAuthToken, storeUserInfo } from "@/redux/slice/authSlice";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Add this import
import { z } from "zod";

// types.ts
export type RootTabParamList = {
  index: undefined;
  feed: undefined;
  blog: undefined;
  login: undefined;
  menu: undefined;
};

// Zod schema for form validation
const loginSchema = z.object({
  identifier: z.string().nonempty("Email or Username is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

function Login() {
  const [login, setLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      identifier: "",
      password: "",
    });
    const [loginUser] = useLoginUserMutation();

    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };

    const handleChange = (name: string, value: string) => {
      setFormData({
        ...formData,
        [name]: value,
      });
    };
    const handleLoginRegister = () => {
      setLogin(!login);
    };

    const authTokenFromRedux = useAppSelector((state) => state.auth.authToken);

    const handleSubmit = async () => {
      try {
        // Validate form data with Zod
        loginSchema.parse(formData);

        if (formData.identifier !== "" && formData.password !== "") {
          try {
            setLoading(true);
            const result: any | Error = await loginUser(formData);
            if (result?.error) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "User is not valid",
              });
            } else {
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Login successful",
              });
              await storeTokenInSecureStore(result?.data?.jwt);
              dispatch(storeAuthToken(result?.data?.jwt));
              dispatch(storeUserInfo(result?.data?.user));
              // router.push("/");
            }
          } catch (error) {
            console.log(error);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "An error occurred during login",
            });
          } finally {
            // Stop loading after the request completes
            setLoading(false);
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please fill in all fields",
          });
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.log(error);
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

    return login ? (
      <View style={styles.container}>
        <Toast config={toastConfig} />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Email or Username <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email or username"
              onChangeText={(value) => handleChange("identifier", value)}
              value={formData.identifier}
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
          {/* Login Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Loading..." : "Login"} {/* Show loading text */}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.link} onPress={() => handleLoginRegister()}>
              Register here
            </Text>
          </Text>
        </View>
      </View>
    ) : (
      <RegisterPage handleLoginRegister={handleLoginRegister} />
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
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
    marginBottom: 16,
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

  togglePassword: {
    // marginLeft: 8,
    color: "#007bff",
    fontWeight: "bold",
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
});

export default Login;
