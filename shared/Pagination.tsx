import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Define the prop types for the Pagination component
interface PaginationProps {
  pageCount: number;
  setPageCount: (page: number) => void;
  total: number;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  setPageCount,
  total,
}) => {
  const totalPages = Math.ceil(total / 10);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;
    const halfMaxButtonsToShow = Math.floor(maxButtonsToShow / 2);

    if (totalPages <= maxButtonsToShow) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <TouchableOpacity
            key={i}
            onPress={() => setPageCount(i)}
            style={[styles.button, pageCount === i && styles.activeButton]}
          >
            <Text
              style={[
                styles.buttonText,
                pageCount === i && styles.activeButtonText,
              ]}
            >
              {i}
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      if (pageCount <= halfMaxButtonsToShow + 1) {
        for (let i = 1; i <= maxButtonsToShow; i++) {
          buttons.push(
            <TouchableOpacity
              key={i}
              onPress={() => setPageCount(i)}
              style={[styles.button, pageCount === i && styles.activeButton]}
            >
              <Text
                style={[
                  styles.buttonText,
                  pageCount === i && styles.activeButtonText,
                ]}
              >
                {i}
              </Text>
            </TouchableOpacity>
          );
        }
        buttons.push(
          <View key="ellipsis1" style={styles.ellipsisContainer}>
            <Text style={styles.ellipsisText}>...</Text>
          </View>
        );
        buttons.push(
          <TouchableOpacity
            key={totalPages}
            onPress={() => setPageCount(totalPages)}
            style={[
              styles.button,
              pageCount === totalPages && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                pageCount === totalPages && styles.activeButtonText,
              ]}
            >
              {totalPages}
            </Text>
          </TouchableOpacity>
        );
      } else if (pageCount >= totalPages - halfMaxButtonsToShow) {
        buttons.push(
          <TouchableOpacity
            key={1}
            onPress={() => setPageCount(1)}
            style={[styles.button, pageCount === 1 && styles.activeButton]}
          >
            <Text
              style={[
                styles.buttonText,
                pageCount === 1 && styles.activeButtonText,
              ]}
            >
              1
            </Text>
          </TouchableOpacity>
        );
        buttons.push(
          <View key="ellipsis2" style={styles.ellipsisContainer}>
            <Text style={styles.ellipsisText}>...</Text>
          </View>
        );
        for (let i = totalPages - maxButtonsToShow + 3; i <= totalPages; i++) {
          buttons.push(
            <TouchableOpacity
              key={i}
              onPress={() => setPageCount(i)}
              style={[styles.button, pageCount === i && styles.activeButton]}
            >
              <Text
                style={[
                  styles.buttonText,
                  pageCount === i && styles.activeButtonText,
                ]}
              >
                {i}
              </Text>
            </TouchableOpacity>
          );
        }
      } else {
        buttons.push(
          <TouchableOpacity
            key={1}
            onPress={() => setPageCount(1)}
            style={[styles.button, pageCount === 1 && styles.activeButton]}
          >
            <Text
              style={[
                styles.buttonText,
                pageCount === 1 && styles.activeButtonText,
              ]}
            >
              1
            </Text>
          </TouchableOpacity>
        );
        buttons.push(
          <View key="ellipsis3" style={styles.ellipsisContainer}>
            <Text style={styles.ellipsisText}>...</Text>
          </View>
        );
        for (
          let i = pageCount - halfMaxButtonsToShow;
          i <= pageCount + halfMaxButtonsToShow;
          i++
        ) {
          buttons.push(
            <TouchableOpacity
              key={i}
              onPress={() => setPageCount(i)}
              style={[styles.button, pageCount === i && styles.activeButton]}
            >
              <Text
                style={[
                  styles.buttonText,
                  pageCount === i && styles.activeButtonText,
                ]}
              >
                {i}
              </Text>
            </TouchableOpacity>
          );
        }
        buttons.push(
          <View key="ellipsis4" style={styles.ellipsisContainer}>
            <Text style={styles.ellipsisText}>...</Text>
          </View>
        );
        buttons.push(
          <TouchableOpacity
            key={totalPages}
            onPress={() => setPageCount(totalPages)}
            style={[
              styles.button,
              pageCount === totalPages && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                pageCount === totalPages && styles.activeButtonText,
              ]}
            >
              {totalPages}
            </Text>
          </TouchableOpacity>
        );
      }
    }
    return buttons;
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={() => setPageCount(pageCount === 1 ? 1 : pageCount - 1)}
        style={styles.navigationButton}
      >
        <Text style={styles.navigationButtonText}>{"<"}</Text>
      </TouchableOpacity>
      {renderPaginationButtons()}
      <TouchableOpacity
        onPress={() =>
          setPageCount(pageCount === totalPages ? totalPages : pageCount + 1)
        }
        style={styles.navigationButton}
      >
        <Text style={styles.navigationButtonText}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  button: {
    paddingHorizontal: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#D3D3D3",
  },
  buttonText: {
    fontSize: 18,
    color: "#808080",
  },
  activeButtonText: {
    color: "#505050",
  },
  navigationButton: {
    paddingHorizontal: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  navigationButtonText: {
    fontSize: 18,
    color: "#808080",
  },
  ellipsisContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginHorizontal: 5,
  },
  ellipsisText: {
    fontSize: 18,
    color: "#808080",
  },
});

export default Pagination;
