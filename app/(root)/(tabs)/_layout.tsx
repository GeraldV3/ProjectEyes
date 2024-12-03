import { Tabs } from "expo-router";
import { Image, View, ImageSourcePropType, StyleSheet } from "react-native";

import { icons } from "@/constants";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    style={[
      styles.iconContainer,
      focused && styles.focusedIconContainer, // Apply highlight for the active tab
    ]}
  >
    <Image
      source={source}
      style={[
        styles.icon,
        { tintColor: focused ? "#FFF" : "#AAA" }, // Change color based on focus
      ]}
    />
  </View>
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false, // Hide labels
        tabBarStyle: styles.tabBarStyle, // Custom styles for the tab bar
        tabBarActiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.home} />
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.chat} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.profile} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#333", // Set a gray background similar to the image
    height: 70,
    marginBottom: 20,
    borderRadius: 50, // Apply consistent roundness for the entire tab bar
    paddingHorizontal: 20,
    position: "absolute", // Ensure the tab bar stays at the bottom
    bottom: 0,
    left: 5, // Add margin on the sides for rounded edges to show
    right: 5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "transparent", // Transparent by default
    marginTop: 30,
  },
  focusedIconContainer: {
    backgroundColor: "red", // Highlight active tab
  },
  icon: {
    width: 24,
    height: 24,
  },
});
