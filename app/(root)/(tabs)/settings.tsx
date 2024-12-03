import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from "react-native";

const Settings = () => {
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  const toggleSwitch = () =>
    setIsPushEnabled((previousState) => !previousState);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-black py-6 px-5">
        <Text className="text-white text-3xl font-bold">Settings</Text>
      </View>

      {/* Profile Section */}
      <View className="bg-white mx-4 -mt-10 rounded-3xl shadow-lg">
        <View className="flex-row items-center p-5">
          <Image
            source={{
              uri: "https://example.com/profile-image.jpg", // Replace with actual image URI
            }}
            className="w-16 h-16 rounded-full mr-4"
          />
          <Text className="text-lg font-semibold">Yennefer Doe</Text>
        </View>
      </View>

      {/* Account Settings Section */}
      <View className="bg-white mx-4 mt-4 rounded-3xl shadow-lg">
        <Text className="text-gray-400 font-semibold px-5 pt-5">
          Account Settings
        </Text>
        <TouchableOpacity className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
          <Text className="text-base text-gray-800">Edit profile</Text>
          <Text className="text-gray-400">{">"}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
          <Text className="text-base text-gray-800">Change password</Text>
          <Text className="text-gray-400">{">"}</Text>
        </TouchableOpacity>
        <View className="flex-row justify-between items-center px-5 py-4">
          <Text className="text-base text-gray-800">Push notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#E74C3C" }}
            thumbColor={isPushEnabled ? "#FFF" : "#FFF"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isPushEnabled}
          />
        </View>
      </View>

      {/* More Section */}
      <View className="bg-white mx-4 mt-4 rounded-3xl shadow-lg">
        <Text className="text-gray-400 font-semibold px-5 pt-5">More</Text>
        <TouchableOpacity className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
          <Text className="text-base text-gray-800">About Us</Text>
          <Text className="text-gray-400">{">"}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row justify-between items-center px-5 py-4">
          <Text className="text-base text-gray-800">Privacy policy</Text>
          <Text className="text-gray-400">{">"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
