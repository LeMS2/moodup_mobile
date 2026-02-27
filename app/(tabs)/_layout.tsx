import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#2dd4bf",
        tabBarStyle: { backgroundColor: "#0B0F19", borderTopColor: "rgba(255,255,255,.08)" },
        headerStyle: { backgroundColor: "#0B0F19" },
        headerTintColor: "#E5E7EB",
      }}
    >
      <Tabs.Screen
        name="moods/index"
        options={{
          title: "Moods",
          tabBarLabel: "Moods",
          tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="moods/create"
        options={{
          title: "Criar Mood",
          tabBarLabel: "Criar",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          title: "IA",
          tabBarLabel: "IA",
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="ajuda"
        options={{
          title: "Auxílio",
          tabBarLabel: "Auxílio",
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}