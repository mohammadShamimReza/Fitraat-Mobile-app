import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PaginationButtonsProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const getPaginationRange = () => {
    const pageLinks = [];
    const siblingCount = 1; // Number of pages to show around the current page

    if (totalPages <= 5) {
      // Show all pages if total pages are less than or equal to 5
      for (let i = 1; i <= totalPages; i++) {
        pageLinks.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - siblingCount);
      const endPage = Math.min(totalPages, currentPage + siblingCount);

      if (startPage > 2) {
        pageLinks.push(1, "...");
      } else {
        for (let i = 1; i < startPage; i++) {
          pageLinks.push(i);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageLinks.push(i);
      }

      if (endPage < totalPages - 1) {
        pageLinks.push("...", totalPages);
      } else {
        for (let i = endPage + 1; i <= totalPages; i++) {
          pageLinks.push(i);
        }
      }
    }

    return pageLinks;
  };

  const paginationRange = getPaginationRange();

  return (
    <View style={styles.paginationContainer}>
      {paginationRange.map((page, index) =>
        page === "..." ? (
          <Text key={index} style={styles.ellipsis}>
            ...
          </Text>
        ) : (
          <TouchableOpacity
            key={page}
            style={[
              styles.button,
              currentPage === page
                ? styles.activeButton
                : styles.inactiveButton,
            ]}
            onPress={() => onPageChange(page as number)}
          >
            <Text
              style={[
                styles.buttonText,
                currentPage === page
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: "#3b82f6", // Blue
  },
  inactiveButton: {
    backgroundColor: "#e5e7eb", // Light gray
  },
  buttonText: {
    fontSize: 16,
  },
  activeButtonText: {
    color: "#ffffff", // White
  },
  inactiveButtonText: {
    color: "#374151", // Gray
  },
  ellipsis: {
    fontSize: 16,
    color: "#374151",
    marginHorizontal: 8,
    textAlignVertical: "center",
  },
});

export default PaginationButtons;
