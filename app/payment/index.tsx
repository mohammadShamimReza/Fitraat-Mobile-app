import useCustomHeader from "@/hooks/useCustomHeader";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { usePaymentInitMutation } from "@/redux/api/payment";
import { useAppDispatch } from "@/redux/hooks";
import { storeUserInfo } from "@/redux/slice/authSlice";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const PaymentPage = () => {
  const navigation = useNavigation();
  useCustomHeader({
    title: "Make Payment",
    onBackPress: () => {
      Alert.alert(
        "Exit Payment",
        "Are you sure you want to go back? Your payment session will be lost.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => navigation.goBack() },
        ]
      );
    },
  });

  const dispatch = useAppDispatch();

  const [paymentInit] = usePaymentInitMutation();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("BDT");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Get user info from Redux store
  const { data: userInfo, refetch } = useGetUserInfoQuery();

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  const handleSubmit = async () => {
    const data = {
      cus_name: userInfo?.username,
      cus_email: userInfo?.email,
      currency,
      total_amount: currency === "USD" ? 20 : 2000,
      userId: userInfo?.id.toString(),
      product_name: "Detox-dopamine",
      product_category: "Mental & physical",
      product_profile: "Fitraat",
      cus_add1: "Dhaka",
      cus_country: userInfo?.country || "",
      cus_phone: userInfo?.phone || "",
    };

    try {
      setLoading(true);
      const result = await paymentInit(data).unwrap();
      console.log(result, "from payment");
      if (result?.url) {
        setPaymentUrl(result.url); // Save the payment URL to render WebView
      } else {
        Alert.alert("Error", "Please try again later");
      }
    } catch (error) {
      Alert.alert("Error", "Server has some issues, please try again later");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePaymentSuccess = async () => {
    try {
      await refetch(); // Refetch the user data
      if (userInfo) {
        dispatch(storeUserInfo(userInfo)); // Update Redux store with the latest user data
        Alert.alert(
          "Payment Successful",
          "Thank you for your payment! Enjoy your course."
        );
        router.replace("/"); // Navigate to the home screen
      }
    } catch (error) {
      console.error("Error updating user data after payment:", error);
      Alert.alert(
        "Error",
        "Failed to update user data. Please refresh manually."
      );
    }
  };
  console.log(paymentUrl, "PaymentUrl");
  if (paymentUrl) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("redirectSuccess")) {
            setPaymentUrl(null);
            Alert.alert("Payment Successful", "Thank you for your payment!");
            router.replace("/");
          } else if (navState.url.includes("payment-failure")) {
            setPaymentUrl(null);
            Alert.alert("Payment Failed", "Please try again.");
          } else if (navState.url.includes("error")) {
            setPaymentUrl(null);
            Alert.alert("Error", "There was an issue processing the payment.");
          }
        }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Payment Details</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          style={styles.input}
          value={userInfo?.username}
          editable={false}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={userInfo?.email}
          editable={false}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Total Amount</Text>
        <TextInput
          style={styles.input}
          value={currency === "USD" ? "20" : "2000"}
          editable={false}
        />

        <Text style={styles.label}>Currency</Text>
        <Text style={styles.input}>{currency}</Text>

        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Pay Now With sslcommerz</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    // backgroundColor: "#1c1c1c",
  },
  card: {
    // backgroundColor: "#2c2c2c",
    padding: 20,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    // color: "#fff",
  },
  label: {
    // color: "#fff",
  },
  input: {
    // borderColor: "#444",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    // color: "#fff",
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default PaymentPage;

// const navigation = useNavigation();
// useEffect(() => {
//   navigation.setOptions({
//     title: "payment",
//   });
// });
