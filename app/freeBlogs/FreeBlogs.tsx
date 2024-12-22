import ShowBlog from "@/components/Blog/ShowBlog";
import useSetNavigationTitle from "@/hooks/useCustomStackName";
import { useGetFreeBlogsQuery } from "@/redux/api/freeBlogApi";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PaginationButtons from "./Pagination";

const FreeBlogs: React.FC = () => {
  useSetNavigationTitle("Blogs");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [blogs, setBlogs] = useState<any[]>([]);
  const paginationSize = 25;

  const {
    data: blogData,
    isLoading,
    isFetching,
    isSuccess,
  } = useGetFreeBlogsQuery({ searchTerm, pageCount, paginationSize });

  // Append new blogs to the existing blogs
  useEffect(() => {
    if (pageCount === 1) {
      setBlogs(blogData?.data || []); // Reset blogs on the first page
    } else if (blogData?.data) {
      setBlogs((prevBlogs) => [...blogData.data]);
    }
  }, [blogData, pageCount]);

  const handleSearchTermChange = (text: string) => {
    setSearchTerm(text);
    setPageCount(1); // Reset to first page on a new search
  };

  const loadMoreBlogs = () => {
    if (isFetching || !blogData?.meta.pagination.total) return;

    const hasMoreBlogs =
      pageCount * blogData.meta.pagination.pageSize <
      blogData.meta.pagination.total;
    if (hasMoreBlogs) {
      setPageCount((prev) => prev + 1);
    }
  };

  const total: number = blogData?.meta.pagination.total || 0;
  const totalPages = Math.ceil(total / paginationSize);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search here"
          value={searchTerm}
          onChangeText={handleSearchTermChange}
        />
      </View>

      {isLoading && pageCount === 1 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={blogs}
          renderItem={({ item }) => <ShowBlog blog={item} />}
          keyExtractor={(item, index) =>
            item.id ? `blog-${item.id}-${index}` : `index-${index}`
          }
          onEndReached={loadMoreBlogs}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching ? (
              <ActivityIndicator
                size="small"
                color="#0000ff"
                style={{ margin: 16 }}
              />
            ) : blogs.length > 0 ? (
              <PaginationButtons
                totalPages={totalPages}
                currentPage={pageCount}
                onPageChange={(page) => setPageCount(page)}
              />
            ) : null // Ensure `null` is returned when no footer is needed
          }
          ListEmptyComponent={
            blogs.length === 0 ? (
              <Text style={styles.notFoundText}>No blogs found.</Text>
            ) : null // Ensure `null` is returned when no empty component is needed
          }
        />
      )}

      {/* Pagination Buttons */}
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
  notFoundText: {
    textAlign: "center",
    marginTop: 16,
  },
});

export default FreeBlogs;
