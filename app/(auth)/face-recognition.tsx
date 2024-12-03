import * as FaceDetector from "expo-face-detector";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { database, ref, set } from "@/app/(api)/firebaseConfig"; // Import database tools
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";

const FaceDetection = () => {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [facesDetected, setFacesDetected] = useState(false);

  // Save image data to Firebase Realtime Database
  const saveToDatabase = async (uri: string, filename: string) => {
    try {
      console.log("Preparing to save image to Firebase Realtime Database...");

      // Sanitize the filename for Realtime Database
      const sanitizedFilename = filename.replace(/\./g, "_");

      // Convert the image to Base64
      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const imageRef = ref(database, `images/${sanitizedFilename}`); // Use sanitized filename
      await set(imageRef, {
        filename: sanitizedFilename,
        imageData: base64String,
      });

      console.log("Image saved successfully to Firebase Realtime Database.");
      return `https://profile-29971-default-rtdb.asia-southeast1.firebasedatabase.app/images/${sanitizedFilename}`;
    } catch (error) {
      console.error("Error saving image to Firebase Realtime Database:", error);
      throw new Error("Failed to save image.");
    }
  };

  // Capture image using the camera
  const handleCapture = async () => {
    try {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Required", "Camera access is required.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use the predefined MediaTypeOptions.Images
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        if (!uri) throw new Error("No image URI found.");

        setImageUri(uri);
        console.log("Captured Image URI:", uri);

        await detectFace(uri);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "An error occurred while capturing the image.");
    }
  };

  // Detect face in the captured image
  const detectFace = async (uri: string) => {
    try {
      const options = {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
      };
      const result = await FaceDetector.detectFacesAsync(uri, options);

      if (result.faces?.length > 0) {
        setFacesDetected(true);
        Alert.alert("Face Detected", "Face detected successfully.");
      } else {
        setFacesDetected(false);
        Alert.alert("No Face Detected", "Please try again.");
      }
    } catch (error) {
      console.error("Face detection error:", error);
      Alert.alert("Error", "Face detection failed.");
    }
  };

  // Handle Done button press
  const handleDone = async () => {
    if (!imageUri || !facesDetected) {
      Alert.alert(
        "Error",
        "Ensure a face is detected and an image is captured.",
      );
      return;
    }

    try {
      const filename = `face_${Date.now()}.jpg`;
      const imageUrl = await saveToDatabase(imageUri, filename);

      console.log("Navigating to Sign-Up with Image URL:", imageUrl);
      router.push({
        pathname: "/sign-up",
        params: {
          imageUri: imageUrl,
        },
      });
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Failed to save image. Please try again.");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Set up Face ID</Text>
        <Text>Scan the face to verify identity</Text>
      </View>

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 300,
            height: 300,
            marginTop: 20,
            borderWidth: 2,
            borderColor: facesDetected ? "green" : "red",
          }}
        />
      ) : (
        <Image
          source={images.face}
          style={{ width: 200, height: 200, marginTop: 20 }}
          resizeMode="contain"
        />
      )}

      {!imageUri ? (
        <CustomButton
          title="Capture Image"
          onPress={handleCapture}
          style={{ marginTop: 20, width: 250, backgroundColor: "black" }}
        />
      ) : (
        <>
          <CustomButton
            title="Try Again"
            onPress={handleCapture}
            style={{ marginTop: 20, width: 250, backgroundColor: "orange" }}
          />
          {facesDetected && (
            <CustomButton
              title="Done"
              onPress={handleDone}
              style={{ marginTop: 20, width: 250, backgroundColor: "green" }}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default FaceDetection;
