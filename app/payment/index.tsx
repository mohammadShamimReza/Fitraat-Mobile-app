import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { usePaymentInitMutation } from "@/redux/api/payment";
import { router } from "expo-router";
import React, { useState } from "react";
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
  const [paymentInit] = usePaymentInitMutation();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("BDT");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Get user info from Redux store
  const userData = useGetUserInfoQuery();
  const userInfo = userData.data;

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

  if (paymentUrl) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("redirectSuccess")) {
            setPaymentUrl(null); // Close WebView on success
            Alert.alert("Payment Successful", "Thank you for your payment!");
            router.replace("/");
          } else if (navState.url.includes("payment-failure")) {
            setPaymentUrl(null); // Close WebView on failure
            Alert.alert("Payment Failed", "Please try again.");
          }
        }}
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
    backgroundColor: "#1c1c1c",
  },
  card: {
    backgroundColor: "#2c2c2c",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  label: {
    color: "#fff",
  },
  input: {
    borderColor: "#444",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
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
