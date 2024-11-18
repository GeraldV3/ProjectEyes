import * as FaceDetector from "expo-face-detector"; // Import face detector
import * as ImagePicker from "expo-image-picker"; // Import before React
import { Href, Link, useRouter } from "expo-router"; // Import Href type
import React, { useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/app/(auth)/auth-context";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";

const FaceDetection = () => {
  // const router = useRouter();
  // const { setFormData, formData } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [facesDetected, setFacesDetected] = useState(false);

  const handleCapture = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Camera access is required.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await detectFace(uri);
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert("Error", "An error occurred while launching the camera.");
    }
  };

  const detectFace = async (uri: string) => {
    try {
      const options = {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
      };
      const result = await FaceDetector.detectFacesAsync(uri, options);

      if (result.faces && result.faces.length > 0) {
        setFacesDetected(true);
        Alert.alert("Face Detected", "Face detected successfully.");
      } else {
        setFacesDetected(false);
        Alert.alert("No Face Detected", "Please try again.");
      }
    } catch (error) {
      console.error("Face detection error:", error);
      Alert.alert("Error", "Could not detect face.");
    }
  };

  /* const handleContinue = async () => {
    try {
      if (imageUri) {
        const uploadedImageUrl = await uploadImageToDb(imageUri);
        setFormData({ ...formData, faceImageUrl: uploadedImageUrl });
        router.replace("/(auth)/start" as Href);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "An error occurred while uploading the image.");
    }
  }; */

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <View className="items-center justify-end mb-6">
        <Text className="text-2xl font-bold">Set up Face ID</Text>
        <Text>Scan the child face to verify the identity</Text>
      </View>

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 350,
            height: 350,
            marginTop: 50,
            marginBottom: 20,
            borderColor: facesDetected ? "green" : "red",
            borderWidth: 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <View className="items-center justify-center mt-10">
          <Image
            source={images.face}
            className="w-50 h-110 mt-10 mb-10"
            resizeMode="contain"
          />
        </View>
      )}

      {facesDetected ? (
        <Text style={{ marginTop: 20, fontSize: 16, color: "green" }}>
          Face detected in the image!
        </Text>
      ) : (
        <Text style={{ marginTop: 20, fontSize: 16, color: "red" }}>
          No face detected in the image!
        </Text>
      )}

      <View className="flex-row space-x-4 mt-6 justify-center items-center">
        {facesDetected ? (
          <CustomButton
            title="Continue"
            onPress={handleCapture}
            className="bg-black w-[250px] mt-0 mb-2"
          />
        ) : (
          <CustomButton
            title="Capture Image"
            onPress={handleCapture}
            className="bg-black w-[250px] mb-2"
          />
        )}
      </View>

      <View className="flex-row space-x-4 mt-6 justify-center items-center">
        {facesDetected ? (
          <CustomButton
            title="Try Again"
            onPress={handleCapture}
            className="text-gray-500 text-[18px] w-[250px] mt-0 mb-2 bg-white"
            textColorClass="text-black"
          ></CustomButton>
        ) : (
          <Link href={"/sign-up" as Href} className="text-gray-500">
            <Text className="text-[18px]">Not now</Text>
          </Link>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FaceDetection;

// const uploadImageToStorage = async (uri: string) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", {
//       uri,
//       name: "faceImage.jpg",
//       type: "image/jpeg",
//     } as any);

//     // Replace 'https://your-api-url.com/upload' with your actual upload endpoint
//     const response = await fetch("https://your-api-url.com/upload", {
//       method: "POST",
//       body: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     const data = await response.json();
//     return data.url; // Assuming the response returns the uploaded image URL
//   } catch (error) {
//     console.error("Upload error:", error);
//     throw new Error("Failed to upload image");
//   }
// };
