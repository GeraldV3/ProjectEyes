import React from "react";
import { View, Text } from "react-native";

const Insights = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF", // Optional: Add a background color
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>
        Insights
      </Text>
    </View>
  );
};

export default Insights;
