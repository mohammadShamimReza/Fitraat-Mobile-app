import useSetNavigationTitle from "@/hooks/useCustomStackName";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import books from "./book.json"; // Importing the books JSON data

interface Book {
  id: number;
  name: string;
  author: string;
  genre: string;
  description: string;
  image: string;
  pdfUrl: string;
}

const BooksPage: React.FC = () => {
  useSetNavigationTitle("Books");
  const handleDownload = async (pdfPath: string) => {
    try {
      // Open PDF URL in a browser
      await Linking.openURL(pdfPath);
    } catch (error) {
      Alert.alert("Error", "Unable to download the book.");
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      {/* Book Image */}
      <Image source={{ uri: item.image }} style={styles.bookImage} />

      {/* Book Details */}
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.name}</Text>
        <Text style={styles.bookAuthor}>By {item.author}</Text>
        <Text style={styles.bookGenre}>Genre: {item.genre}</Text>
        <Text style={styles.bookDescription} numberOfLines={3}>
          {item.description}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.readButton]}
          onPress={() =>
            Linking.openURL(
              `/books/read?pdf=${encodeURIComponent(item.pdfUrl)}`
            )
          }
        >
          <AntDesign name="book" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Read</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.downloadButton]}
          onPress={() => handleDownload(item.pdfUrl)}
        >
          <AntDesign
            name="download"
            size={18}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Our Books</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    textDecorationLine: "underline",
    color: "#333",
  },
  list: {
    paddingBottom: 16,
  },
  bookCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  shadowRadius: 4,
    borderWidth: 0.3,
  },
  bookImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  bookDetails: {
    padding: 16,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  bookGenre: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
    fontStyle: "italic",
  },
  bookDescription: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  readButton: {
    backgroundColor: "#4A90E2",
  },
  downloadButton: {
    backgroundColor: "#50C878",
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
  },
});

export default BooksPage;
