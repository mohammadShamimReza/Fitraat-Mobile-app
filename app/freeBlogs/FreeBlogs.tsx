import ShowBLog from "@/components/Blog/ShowBlog";
import { useGetFreeBlogsQuery } from "@/redux/api/freeBlogApi";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

// Define the validation schema using Zod
const validationSchema = z.object({
  searchTerm: z.string().optional(),
});

const FreeBlogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]); // Store blogs separately
  const [refreshing, setRefreshing] = useState<boolean>(false); // State for pull-to-refresh

  // Adjust the query to fetch data with the page and search term
  const {
    data: blogData,
    isLoading,
    isSuccess,
    refetch, // Function to manually trigger refetching
  } = useGetFreeBlogsQuery({ searchTerm, pageCount });

  useEffect(() => {
    console.log(blogs);
    if (isSuccess && blogData?.data) {
      // Filter out duplicates before appending
      const newBlogs = blogData.data.filter(
        (newBlog) =>
          !blogs.some((existingBlog) => existingBlog.id === newBlog.id)
      );

      if (pageCount === 1) {
        setBlogs(newBlogs); // Reset blogs on new search
      } else {
        setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]); // Append new unique blogs
      }
    }
  }, [blogData, isSuccess, pageCount, searchTerm, refetch]);

  const handleSearchTermChange = (text: string) => {
    setSearchTerm(text);
  };

  const handleSearch = () => {
    try {
      validationSchema.parse({ searchTerm });
      setPageCount(1); // Reset page count on new search
      // setBlogs([]); // Clear existing blogs for new search
      refetch(); // Trigger a refetch on search
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.message);
      }
    }
  };

  const loadMoreBlogs = useCallback(() => {
    if (
      !isLoading &&
      isSuccess &&
      pageCount < (blogData.meta.pagination.pageCount || 0)
    ) {
      setPageCount((prevPage) => prevPage + 1); // Increment page count to fetch next page if available
      console.log(pageCount);
    }
  }, [isLoading, isSuccess, blogData, pageCount]);

  const handleRefresh = useCallback(() => {
    console.log("refetch");
    setSearchTerm("");
    setPageCount(1); // Reset page count to start from the first page
    // setBlogs([]); // Clear current blogs
    setRefreshing(true);
    refetch(); // Trigger a refetch
  }, [refetch]);

  useEffect(() => {
    if (!isLoading && refreshing) {
      setRefreshing(false);
    }
  }, [isLoading, refreshing]);

  const total = blogData?.meta?.pagination?.total || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search here"
          value={searchTerm}
          onChangeText={handleSearchTermChange}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      {isLoading && !isSuccess && !refreshing ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={blogs}
          renderItem={({ item }) => <ShowBLog blog={item} />}
          keyExtractor={(item, index) => {
            // Generate a unique key based on item.id and index
            return item.id ? `blog-${item.id}-${index}` : `index-${index}`;
          }}
          onEndReached={loadMoreBlogs}
          onEndReachedThreshold={0.5} // Trigger loadMoreBlogs when 50% from end
          ListFooterComponent={
            isLoading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : null
          }
          ListEmptyComponent={
            // If blogs exist but not displayed, render a "No blogs found" message
            <Text style={styles.notFoundText}>
              {blogs.length === 0 ? "No blogs found" : "Loading more blogs..."}
            </Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#75787d",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  searchButton: {
    backgroundColor: "#75787d",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 8,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 8,
  },
  notFoundText: {
    textAlign: "center",
  },
});

export default FreeBlogs;
