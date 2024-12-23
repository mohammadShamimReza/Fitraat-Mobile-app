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

  useEffect(() => {
    if (isSuccess && userData) {
      dispatch(storeUserInfo(userData));
    }
  }, [isSuccess, userData, dispatch]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#4B5563", // Set active tab text color
          tabBarInactiveTintColor: "#A0A3B1", // Optional: Set inactive tab text color
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={"#4B5563"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: "Feed",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "albums" : "albums-outline"}
                color={"#4B5563"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="blog"
          options={{
            title: "Blog",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "book" : "book-outline"}
                color={"#4B5563"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: userToken ? "Profile" : "Login",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={
                  focused
                    ? userToken
                      ? "person"
                      : "log-in"
                    : userToken
                    ? "person-outline"
                    : "log-in-outline"
                }
                color={"#4B5563"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "menu" : "menu-outline"}
                color={"#4B5563"}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
