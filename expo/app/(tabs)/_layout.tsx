import Ionicons from "@expo/vector-icons/Ionicons";
import { ImageBackground } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "../../constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarActiveTintColor: Colors.text,
        tabBarActiveBackgroundColor: Colors.backgroundSecondary,
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: Colors.backgroundSecondary,
        },
        sceneStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="event"
        options={{
          title: "Event",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          title: "Match",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
