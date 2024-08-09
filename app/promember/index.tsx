import useSetNavigationTitle from "@/hooks/useCustomStackName";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Index = () => {
  useSetNavigationTitle("Pro member");
  const userInfo = useGetUserInfoQuery().data;
  const userToken = useAppSelector((state) => state.auth.authToken);

  const handleFree = () => {
    if (userToken) {
      alert("You are already using free access");
    } else {
      router.replace("/login");
    }
  };

  const handlePremium = () => {
    if (!userToken) {
      router.push("/profile");
    } else if (!userInfo?.paid) {
      router.push("/payment");
    } else if (userInfo?.paid) {
      alert("You are already Premium member");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Become <Text style={styles.highlight}>premium</Text> member
        </Text>
        {/* <Text style={styles.description}>
          &quot;We suggest not buying the premium membership right away. We
          offer a 40-day free trial of our app without requiring any login. We
          believe this 40-day trial is sufficient for most people. However, if
          you still lack confidence after this trial period, you can consider
          purchasing our premium membership. It&apos;s designed to help you
          maintain consistency over a 120-day period.&quot;{" "}
          <Text style={styles.bold}>
            Let&apos;s build <Text style={styles.highlight}>spartan</Text> habit
            and become
            <Text style={styles.highlight}> unbeatable</Text>.
          </Text>
        </Text> */}
      </View>
      <View style={styles.cardContainer}>
        {/* Freemium Membership Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Freemium Membership</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>Access to basic features</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>Limited access to content</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>Access to community forum</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Ability to save preferences
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>Access to basic analytics</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Ability to connect with social media
              </Text>
            </View>
            <View style={styles.featureUnavailable}>
              <Text style={styles.featureIcon}>❌</Text>
              <Text style={styles.featureText}>
                Customizable dashboard layout
              </Text>
            </View>
            <View style={styles.featureUnavailable}>
              <Text style={styles.featureIcon}>❌</Text>
              <Text style={styles.featureText}>120 day premium package</Text>
            </View>
            <View style={styles.featureUnavailable}>
              <Text style={styles.featureIcon}>❌</Text>
              <Text style={styles.featureText}>
                Latest update of premium content
              </Text>
            </View>
            <View style={styles.featureUnavailable}>
              <Text style={styles.featureIcon}>❌</Text>
              <Text style={styles.featureText}>
                Access career building workshop
              </Text>
            </View>
            <View style={styles.featureUnavailable}>
              <Text style={styles.featureIcon}>❌</Text>
              <Text style={styles.featureText}>
                Access career building support
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleFree}>
              <Text style={styles.buttonText}>Start Freemium</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pro Membership Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Pro Membership</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>Access to all features</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Unlimited access to premium content
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>Priority customer support</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Advanced analytics dashboard
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Personalized recommendations
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Exclusive webinars and workshops
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Customizable dashboard layout
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>120 day premium package</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Latest update of premium content
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Access career building workshop
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✔️</Text>
              <Text style={styles.featureText}>
                Access career building support
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePremium}>
              <Text style={styles.buttonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  highlight: {
    color: "#E03A3E", // Or your primary color
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "column", // Stack cards vertically
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    width: "100%", // Full width of the container
  },
  cardHeader: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardBody: {
    padding: 16,
    flex: 1,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 20,
    color: "#4CAF50",
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#333",
  },
  featureUnavailable: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    opacity: 0.5,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Index;
