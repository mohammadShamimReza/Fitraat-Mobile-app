import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";

const useCustomHeader = ({
  title,
  onBackPress,
}: {
  title: string;
  onBackPress?: () => void;
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title, // Set the page title dynamically
      headerLeft: () => (
        <TouchableOpacity
          onPress={onBackPress || (() => navigation.goBack())}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, onBackPress]);
};

export default useCustomHeader;
