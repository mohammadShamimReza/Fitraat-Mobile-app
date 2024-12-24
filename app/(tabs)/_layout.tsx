import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getTokenFromSecureStore } from "@/lib/auth/token";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { storeAuthToken, storeUserInfo } from "@/redux/slice/authSlice";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const { data: userData, isSuccess } = useGetUserInfoQuery();
  const userInfo = useAppSelector((store) => store.auth.userInfo);
  const userToken = useAppSelector((store) => store.auth.authToken);

  // Fetch Token from Secure Store
  useEffect(() => {
    const fetchTokenAndUser = async () => {
      try {
        const tokenFromSecureStore = await getTokenFromSecureStore();
        if (tokenFromSecureStore) {
          dispatch(storeAuthToken(tokenFromSecureStore));
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchTokenAndUser();
  }, [dispatch]);

  // Store User Info in Redux
  useEffect(() => {
    if (isSuccess && userData) {
      dispatch(storeUserInfo(userData));
    }
  }, [isSuccess, userData, dispatch]);

  // Define Tab Configuration
  const tabs = [
    {
      name: "index",
      title: "Home",
      icon: (focused: boolean) => (focused ? "home" : "home-outline"),
    },
    {
      name: "feed",
      title: "Feed",
      icon: (focused: boolean) => (focused ? "albums" : "albums-outline"),
    },
    {
      name: "blog",
      title: "Blog",
      icon: (focused: boolean) => (focused ? "book" : "book-outline"),
    },
    {
      name: "profile",
      title: userToken ? "Profile" : "Login",
      icon: (focused: boolean) =>
        focused
          ? userToken
            ? "person"
            : "log-in"
          : userToken
          ? "person-outline"
          : "log-in-outline",
    },
    {
      name: "menu",
      title: "Menu",
      icon: (focused: boolean) => (focused ? "menu" : "menu-outline"),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#4B5563",
          tabBarInactiveTintColor: "#A0A3B1",
          headerShown: false,
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ focused }) => (
                <TabBarIcon name={tab.icon(focused)} color={"#4B5563"} />
              ),
            }}
          />
        ))}
      </Tabs>
    </SafeAreaView>
  );
}
