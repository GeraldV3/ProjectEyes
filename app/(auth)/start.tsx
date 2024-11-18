import { useRouter, Href, Link } from "expo-router"; // Move this to the top as per the ESLint rule
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";

const Start: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      {/* Image Section */}
      <View className="items-center justify-center mt-10">
        <Image
          source={images.startBg}
          className="w-50 h-110 mt-10"
          resizeMode="contain"
        />
      </View>

      <View className="flex-row space-x-4 mt-6 justify-center items-center mt-20">
        <CustomButton
          title="Sign In"
          onPress={() => router.replace("/(auth)/sign-in" as Href)}
          className="bg-black w-1/3"
        />
        <CustomButton
          title="Register"
          onPress={() => router.replace("/(auth)/sign-up" as Href)}
          className="border bg-white w-1/3"
          textColorClass="text-black"
        />
      </View>

      <View className="flex">
        {/* The scanning page, to follow */}
        {/* <Text className="text-gray-500 mt-4">Scan First</Text> */}
        <Link href={"/(root)/scan" as Href} className="text-gray-500 mt-4">
          <Text className="text-[18px]">Scan First</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Start;