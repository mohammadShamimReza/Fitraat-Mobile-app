import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

/**
 * Custom hook to set the navigation title.
 *
 * @param {string} title - The title to set for the navigation bar.
 */
const useSetNavigationTitle = (title: string) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);
};

export default useSetNavigationTitle;
