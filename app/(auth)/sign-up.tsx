import { useSignUp } from "@clerk/clerk-expo";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import { useForm } from "@/app/(auth)/FormContext";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { form, setForm } = useForm();

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const imageUri = searchParams?.imageUri as string | undefined;

    if (imageUri) {
      const filename = imageUri.split("/").pop(); // Extract filename
      console.log("Extracted filename:", filename); // Debug log

      if (filename && form.profilePicture !== filename) {
        setForm((prev) => ({ ...prev, profilePicture: filename }));
        console.log("Updated form.profilePicture:", filename);
      }
    } else {
      console.log("No imageUri found in searchParams");
    }
  }, [searchParams, form.profilePicture, setForm]);

  const handleSignUp = async () => {
    if (!isLoaded) {
      return Alert.alert("Error", "Sign-up functionality is not loaded yet.");
    }
    if (!form.parentName || !form.childName || !form.email || !form.password) {
      return Alert.alert(
        "Incomplete Information",
        "All fields must be completed.",
      );
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification((prev) => ({ ...prev, state: "pending" }));
      Alert.alert(
        "Verification Sent",
        "A verification code has been sent to your email.",
      );
    } catch (error: any) {
      console.error("Sign-up error:", error);
      const errorMessage =
        error.errors?.[0]?.longMessage || "An unknown error occurred.";
      Alert.alert("Error", errorMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        const payload = {
          parentName: form.parentName,
          childName: form.childName,
          email: form.email,
          clerkId: completeSignUp.createdUserId,
          profilePictureFilename: form.profilePicture, // Key that stores the profile picture filename
        };

        console.log("Payload being sent to backend:", payload); // Log the payload

        const response = await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("API Response:", response);

        await setActive({ session: completeSignUp.createdSessionId });
        setShowSuccessModal(true);
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerification({
        ...verification,
        error: "Verification failed. Please try again.",
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image
            source={images.signUpCar}
            className="z-0 w-full h-[250px] mt-5"
            resizeMode="cover"
          />
        </View>
        <Text className="text-2xl text-black font-bold absolute top-[240px] left-5">
          Create Your Account
        </Text>
        <View className="p-5">
          <InputField
            label="Parent Name"
            placeholder="Enter parent name"
            icon={icons.person}
            value={form.parentName}
            onChangeText={(value) =>
              setForm((prev) => ({ ...prev, parentName: value }))
            }
          />
          <InputField
            label="Child Name"
            placeholder="Enter child name"
            icon={icons.person}
            value={form.childName}
            onChangeText={(value) =>
              setForm((prev) => ({ ...prev, childName: value }))
            }
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) =>
              setForm((prev) => ({ ...prev, email: value }))
            }
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry
            textContentType="password"
            value={form.password}
            onChangeText={(value) =>
              setForm((prev) => ({ ...prev, password: value }))
            }
          />
          {}
          <CustomButton
            title={form.profilePicture ? "Done Scanning" : "Child Face Scan"}
            onPress={() => router.push("/(auth)/face-recognition")}
            className="mt-6"
          />
          <CustomButton
            title="Sign Up"
            onPress={handleSignUp}
            className="mt-6"
          />

          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal isVisible={verification.state === "pending"}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-bold text-2xl mb-2">Verification</Text>
            <Text className="mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label="Verification Code"
              placeholder="Enter code"
              icon={icons.lock}
              keyboardType="numeric"
              value={verification.code}
              onChangeText={(value) =>
                setVerification((prev) => ({ ...prev, code: value }))
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              style={{ width: 110, height: 110, alignSelf: "center" }}
            />
            <Text className="text-3xl font-bold text-center">Verified</Text>
            <Text className="text-base text-gray-400 text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Go back to Home"
              className="mt-5"
              onPress={() => router.push("/(auth)/success")}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
