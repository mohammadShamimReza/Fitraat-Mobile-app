import ShowBlog from "@/components/Blog/ShowBlog";
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
  const [blogs, setBlogs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    data: blogData,
    isLoading,
    isSuccess,
    isFetching,
    refetch,
  } = useGetFreeBlogsQuery({ searchTerm, pageCount });

  // Append new blogs to the existing blogs
  useEffect(() => {
    if (pageCount === 1) {
      setBlogs(blogData?.data || []); // Reset blogs if pageCount is 1 (initial load or refresh)
    } else if (blogData?.data) {
      setBlogs((prevBlogs) => [...prevBlogs, ...blogData.data]);
    }
  }, [blogData, pageCount]);

  const handleSearchTermChange = (text: string) => {
    setSearchTerm(text);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPageCount(1); // Reset page count to 1 for a fresh load
    refetch().finally(() => setRefreshing(false)); // Re-fetch data and stop refreshing
  }, [refetch]);

  const loadMoreBlogs = useCallback(() => {
    if (isFetching || !blogData?.meta.pagination.total) return;

    const hasMoreBlogs =
      pageCount * blogData.meta.pagination.pageSize <
      blogData.meta.pagination.total;
    if (hasMoreBlogs) {
      setPageCount((prev) => prev + 1);
    }
  }, [isFetching, blogData, pageCount]);

  useEffect(() => {
    if (!isLoading && refreshing) {
      setRefreshing(false);
    }
  }, [isLoading, refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search here"
          value={searchTerm}
          onChangeText={handleSearchTermChange}
        />

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      {isLoading && !isSuccess && !refreshing ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={blogs}
          renderItem={({ item }) => <ShowBlog blog={item} />}
          keyExtractor={(item, index) => {
            // Generate a unique key based on item.id and index
            return item.id ? `blog-${item.id}-${index}` : `index-${index}`;
          }}
          onEndReached={loadMoreBlogs}
          onEndReachedThreshold={0.5} // Trigger loadMoreBlogs when 50% from end
          ListFooterComponent={
            isFetching ? (
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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#0000ff"]}
            />
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
