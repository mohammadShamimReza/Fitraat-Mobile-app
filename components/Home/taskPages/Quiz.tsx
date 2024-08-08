import { Quizzes } from "@/types/contantType";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuizProps {
  selectedTask: string;
  quiz: Quizzes[] | undefined;
}

function Quiz({ selectedTask, quiz }: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

  function getQuizOptions(text: string) {
    const optionsArray = text.split(/,\s*/);
    return optionsArray.map(String);
  }

  const [quizOptions, setQuizOptions] = useState<string[] | null>(null);

  useEffect(() => {
    if (
      quiz &&
      quiz.length > 0 &&
      quiz[currentQuizIndex]?.attributes.quizOptions
    ) {
      const newOptions = getQuizOptions(
        quiz[currentQuizIndex].attributes.quizOptions
      );
      setQuizOptions(newOptions);
      setSelectedAnswer(null); // Reset selected answer on quiz change
      setShowAnswer(false); // Reset show answer on quiz change
    }
  }, [quiz, currentQuizIndex]);

  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleShowAnswer = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer); // Toggle showAnswer state
  };

  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  const handleNext = () => {
    if (quiz && currentQuizIndex < quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  return (
    <View style={styles.quizContainer}>
      {selectedTask === "quiz" && (
        <View style={styles.container}>
          <Text style={styles.title}>Quiz</Text>
          <Text style={styles.question}>
            {quiz && quiz[currentQuizIndex]?.attributes.question}
          </Text>
          <View style={styles.optionsContainer}>
            {quizOptions?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedAnswer === option && styles.selectedOption,
                ]}
                onPress={() => handleOptionClick(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: showAnswer || selectedAnswer ? "white" : "black" },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedAnswer && (
            <View style={styles.answerContainer}>
              <TouchableOpacity
                style={styles.showAnswerButton}
                onPress={handleShowAnswer}
              >
                <Text style={styles.showAnswerText}>
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                </Text>
                <Ionicons
                  name={showAnswer ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {showAnswer && (
                <Text style={styles.answerText}>
                  {quiz && quiz[currentQuizIndex]?.attributes.question} :{" "}
                  <Text style={styles.answer}>
                    {quiz && quiz[currentQuizIndex]?.attributes.answer}
                  </Text>
                </Text>
              )}
            </View>
          )}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                (currentQuizIndex === 0 || !quiz || quiz.length === 0) &&
                  styles.disabledButton,
              ]}
              onPress={handlePrevious}
              disabled={currentQuizIndex === 0 || !quiz || quiz.length === 0}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                (!quiz || currentQuizIndex === quiz.length - 1) &&
                  styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={!quiz || currentQuizIndex === quiz.length - 1}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default Quiz;

const styles = StyleSheet.create({
  quizContainer: {
    borderWidth: 0.2,
    padding: 5,
    borderRadius: 10,
  },
  container: {
    maxWidth: 600,
    marginHorizontal: "auto",
    padding: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  option: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#4a4a4a",
  },
  optionText: {
    color: "#000",
  },
  answerContainer: {
    marginTop: 16,
  },
  showAnswerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#616161",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  showAnswerText: {
    color: "white",
    fontWeight: "bold",
  },
  answerText: {
    marginTop: 16,
    color: "#1b5e20",
    textAlign: "center",
  },
  answer: {
    fontWeight: "bold",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#757575",
    borderRadius: 8,
    width: 100,
    justifyContent: "center",
  },
  navButtonText: {
    color: "white",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#bdbdbd",
  },
});
