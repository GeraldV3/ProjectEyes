import { useRouter, Href } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";

const SuccessScreen: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/start" as Href);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] items-center justify-center">
      <View className="items-center px-6">
        <View className="w-20 h-20 rounded-full bg-[#E6F4EA] items-center justify-center mb-5">
          <Image
            source={images.check}
            className="w-10 h-10 tint-[#34A853]"
            resizeMode="contain"
          ></Image>
        </View>
        <Text className="text-2xl font-bold text-black mb-2">
          Congratulations
        </Text>
        <Text className="text-center text-base text-[#4B5563] mb-10">
          Your account is ready to use. You will be redirected to the home page
          in a few seconds.
        </Text>
        <CustomButton
          title="Back to Start"
          onPress={() => router.replace("/(auth)/start" as Href)}
          className="bg-black w-64"
        ></CustomButton>
      </View>
    </SafeAreaView>
  );
};

export default SuccessScreen;
