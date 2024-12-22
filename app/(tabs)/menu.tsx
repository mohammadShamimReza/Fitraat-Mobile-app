import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MenuWithFooter = () => {
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Error opening URL:", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Menu Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <View style={styles.buttonRow}>
          <Link href="/payment" style={styles.button}>
            <Text style={styles.buttonText}>Pro Member</Text>
          </Link>
          <Link style={styles.button} href="/books">
            <Text style={styles.buttonText}>Books</Text>
          </Link>
          <Link style={styles.button} href="/about">
            <Text style={styles.buttonText}>About Us</Text>
          </Link>
        </View>
        <View style={styles.buttonRow}>
          <Link style={styles.button} href="/privecy">
            <Text style={styles.buttonText}>Privacy Policy</Text>
          </Link>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footerSection}>
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Fitraat</Text>
          <Text style={styles.text}>
            FItraat is a solution for addicted adult content consumers. This is
            a 40-day marathon solution. Every day users have some tasks,
            emergency section for emergency excited section. Users can post
            their questions and get answers through comments. A lot of
            informational blogs are also available.
          </Text>
        </View>

        {/* Quick Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>

          <Link href="/payment" style={styles.link}>
            <Text>Payment</Text>
          </Link>
          <Link href="/books" style={styles.link}>
            <Text>Books</Text>
          </Link>

          <Link href="/about" style={styles.link}>
            <Text>About Us</Text>
          </Link>

          <Link href="/freeBlogs/FreeBlogs" style={styles.link}>
            <Text>Blogs</Text>
          </Link>

          <Link href="/books" style={styles.link}>
            <Text>Books</Text>
          </Link>

          <Link href="/privecy" style={styles.link}>
            <Text>Privacy Policy</Text>
          </Link>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactRow}>
            <MaterialIcons name="location-on" size={16} color="#aaa" />
            <Text style={styles.text}>
              152/3 kolopara, Simoltoli, Gazipur, Dhaka, Bangladesh
            </Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesome name="phone" size={16} color="#aaa" />
            <Text style={styles.text}>+880 1719-357307</Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesome5 name="envelope" size={16} color="#aaa" />
            <Text style={styles.text}>mohammadshamimrez23393@gmail.com</Text>
          </View>
        </View>

        {/* Stay Connected Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stay Connected</Text>
          <Text style={styles.text}>
            Follow us on social media for updates, tips, and insights.
          </Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity
              onPress={() => handleLinkPress("https://www.facebook.com")}
            >
              <Ionicons name="logo-facebook" size={24} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinkPress("https://www.twitter.com")}
            >
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinkPress("https://www.instagram.com")}
            >
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinkPress("https://www.linkedin.com")}
            >
              <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>
            &copy; 2024 Fitraat. All rights reserved.
          </Text>
          <View style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => handleLinkPress("/terms")}>
              <Text style={styles.link}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress("/cookies")}>
              <Text style={styles.link}>Cookie Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  menuSection: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#818385",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  footerSection: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 25,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: "#aaa",
    lineHeight: 20,
  },
  link: {
    fontSize: 14,
    color: "#1DA1F2",
    textDecorationLine: "underline",
    marginVertical: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: "#555",
    paddingTop: 20,
    alignItems: "center",
  },
  bottomText: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 10,
  },
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
});

export default MenuWithFooter;
