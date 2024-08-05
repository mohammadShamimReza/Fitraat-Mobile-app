import { useAppSelector } from "@/redux/hooks";
import React from "react";
import { StyleSheet } from "react-native";
import FreeBlogs from "../freeBlogs/FreeBlogs";

const Blog = () => {
  const userInfo = useAppSelector((store) => store.auth.userInfo);
  return <FreeBlogs />;
};

export default Blog;

const styles = StyleSheet.create({});
