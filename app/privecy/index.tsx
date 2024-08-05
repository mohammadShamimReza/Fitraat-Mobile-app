import useSetNavigationTitle from "@/hooks/useCustomStackName";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const index = () => {
  useSetNavigationTitle("Privacy policy");
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Privacy Policy</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Last updated:</Text> 3 August 2024
        </Text>

        <Text style={styles.paragraph}>
          Welcome to Detox-Dopamine, a digital well-being platform developed by
          Fitraat. We are committed to protecting your privacy and ensuring the
          security of your personal information. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you
          use our app and website.
        </Text>

        <Text style={styles.paragraph}>
          By using Detox-Dopamine, you consent to the data practices described
          in this policy. If you do not agree with our policies and practices,
          please do not use our services.
        </Text>

        <Text style={styles.subheading}>1. Information We Collect</Text>

        <Text style={styles.paragraph}>
          We may collect and process the following types of information about
          you:
        </Text>

        <Text style={styles.subsubheading}>1.1 Personal Information</Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Contact Information:</Text> Name, email
            address, and other information you provide when you register or
            communicate with us.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Account Information:</Text> Information
            related to your account, such as username and password.
          </Text>
        </View>

        <Text style={styles.subsubheading}>1.2 Usage Data</Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Device Information:</Text> Information
            about your device, including IP address, browser type, operating
            system, and device identifiers.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Log Information:</Text> Details of your
            interactions with our app and website, such as pages visited, time
            spent, and features used.
          </Text>
        </View>

        <Text style={styles.subsubheading}>1.3 Sensitive Data</Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Behavioral Data:</Text> Information
            related to your addiction recovery journey, which may include
            sensitive data regarding your mental health and spiritual practices.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Community Interactions:</Text> Any data
            you voluntarily share in community forums or groups within the app.
          </Text>
        </View>

        <Text style={styles.subheading}>2. How We Use Your Information</Text>

        <Text style={styles.paragraph}>
          We use the information we collect for various purposes, including:
        </Text>

        <Text style={styles.subsubheading}>
          2.1 Providing and Improving Services
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            To deliver and maintain our app and website.
          </Text>
          <Text style={styles.listItem}>
            To personalize your experience and improve our offerings.
          </Text>
          <Text style={styles.listItem}>
            To monitor usage patterns and analyze trends to enhance user
            experience.
          </Text>
        </View>

        <Text style={styles.subsubheading}>2.2 Communication</Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            To send you notifications, updates, and other communications related
            to your account and our services.
          </Text>
          <Text style={styles.listItem}>
            To respond to your inquiries and provide customer support.
          </Text>
        </View>

        <Text style={styles.subsubheading}>2.3 Research and Development</Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            To conduct research and analysis to improve our services and develop
            new features.
          </Text>
          <Text style={styles.listItem}>
            To ensure our app aligns with Islamic teachings and values,
            promoting spiritual growth and well-being.
          </Text>
        </View>

        <Text style={styles.subheading}>3. Sharing Your Information</Text>

        <Text style={styles.paragraph}>
          We do not sell or rent your personal information to third parties.
          However, we may share your information with:
        </Text>

        <Text style={styles.subsubheading}>3.1 Service Providers</Text>

        <Text style={styles.paragraph}>
          Third-party vendors and service providers who assist us in operating
          our app and website, such as hosting services and analytics providers.
        </Text>

        <Text style={styles.subsubheading}>3.2 Legal Obligations</Text>

        <Text style={styles.paragraph}>
          To comply with legal obligations, respond to lawful requests, and
          protect our rights and the safety of our users.
        </Text>

        <Text style={styles.subheading}>4. Security of Your Information</Text>

        <Text style={styles.paragraph}>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          disclosure, alteration, or destruction. However, no method of
          transmission over the Internet or electronic storage is completely
          secure, and we cannot guarantee absolute security.
        </Text>

        <Text style={styles.subheading}>5. Your Rights</Text>

        <Text style={styles.paragraph}>
          You have certain rights regarding your personal information,
          including:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Access and Correction:</Text> You can
            request access to and correction of your personal data.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Data Portability:</Text> You can request a
            copy of your personal data in a structured, machine-readable format.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Withdrawal of Consent:</Text> You can
            withdraw your consent to the processing of your data at any time.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Deletion:</Text> You can request the
            deletion of your personal data, subject to legal obligations.
          </Text>
        </View>

        <Text style={styles.subheading}>6. Children's Privacy</Text>

        <Text style={styles.paragraph}>
          Our services are not intended for individuals under the age of 13. We
          do not knowingly collect personal information from children under 13.
          If you become aware that a child has provided us with personal
          information, please contact us immediately.
        </Text>

        <Text style={styles.subheading}>7. International Data Transfers</Text>

        <Text style={styles.paragraph}>
          Your information may be transferred to and processed in countries
          other than your own. By using our services, you consent to the
          transfer of your information to countries outside of your residence,
          which may have different data protection laws.
        </Text>

        <Text style={styles.subheading}>8. Changes to This Privacy Policy</Text>

        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date. Your continued use of our services
          after any changes to the Privacy Policy will constitute your
          acknowledgment of the modifications and your consent to abide by the
          revised policy.
        </Text>

        <Text style={styles.subheading}>9. Contact Us</Text>

        <Text style={styles.paragraph}>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at:
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Email:</Text> support@fitraat.com
          {"\n"}
          <Text style={styles.bold}>Address:</Text> Bangladesh
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    maxWidth: 768,
    alignSelf: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  subsubheading: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  list: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default index;
