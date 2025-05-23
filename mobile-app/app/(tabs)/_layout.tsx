import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// Reusable tab bar icon component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable static header rendering on web to prevent hydration errors
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      {/* Events tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ), // Changed icon to calendar for events
        }}
      />

      {/* Details tab */}
      <Tabs.Screen
        name="details"
        options={{
          title: "Details",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="info-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
