import { useForgetPasswordMutation } from "@/redux/api/authApi";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgetPassword] = useForgetPasswordMutation();

  const validateEmail = (email: string) => {
    const regex = /^\S+@\S+$/i;
    return regex.test(email);
  };

  const onSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    } else if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    } else {
      setError("");
    }

    setIsLoading(true);
    const result = await forgetPassword({ email });

    // Simulate sending reset password email
    // setTimeout(() => {
    //   setIsLoading(false);
    //   navigation.navigate("ResetPassword"); // Replace with your reset password screen
    // }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Sorry, this feature is not available now. It will come soon. Thanks!
      </Text>
      <Text style={styles.heading}>Forgot Password</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        disabled={true} // Disable input as per original code
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={isLoading}
        disabled={true} // Disable button as per original code
        style={styles.button}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white", // Ensures background color is consistent with TextInput styling
  },
  button: {
    marginTop: 16,
    backgroundColor: "black",
  },
});
