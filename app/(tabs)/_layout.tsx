import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getTokenFromSecureStore } from "@/lib/auth/token";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { storeAuthToken, storeUserInfo } from "@/redux/slice/authSlice";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const {
    data: userData,
    isError,
    isFetching,
    isLoading,
    isSuccess,
  } = useGetUserInfoQuery();

  const userInfo = useAppSelector((store) => store.auth.userInfo);
  const userToken = useAppSelector((store) => store.auth.authToken);

  useEffect(() => {
    const fetchToken = async () => {
      const tokenFromSecureStore = await getTokenFromSecureStore();
      if (tokenFromSecureStore) {
        dispatch(storeUserInfo(userData));
        setToken(tokenFromSecureStore);
        dispatch(storeAuthToken(tokenFromSecureStore));
      }
    };

    fetchToken(); // Fetch the token on component mount
  }, []);
  console.log(userInfo);

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
                    ? token
                      ? "person"
                      : "log-in"
                    : token
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
