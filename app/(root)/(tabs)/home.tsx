import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      {/* Header Section */}
      <View className="flex-row justify-between items-center mt-5">
        <Text className="text-2xl font-bold text-gray-800">
          Welcome, {user?.firstName || "John"}
        </Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex justify-center items-center w-10 h-10 rounded-full bg-white shadow-md"
        >
          <Image
            source={images.history} // Replace with a clock icon
            className="w-6 h-6 tint-gray-800"
          />
        </TouchableOpacity>
      </View>

      {/* Scanner Section */}
      <View className="flex-1 justify-center items-center my-12">
        <Image
          source={images.face} // Replace with the face scan icon
          className="w-36 h-36 mb-5"
        />
        <TouchableOpacity className="bg-gray-200 py-3 px-10 rounded-full shadow-md">
          <Text className="text-lg font-bold text-gray-800">Scan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
