import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, Text, View, TextInput } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";

const SignIn = () => {
  const signInInstance = useSignIn();
  const { signIn, setActive, isLoaded } = signInInstance || {};
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStage, setResetStage] = useState<"sendEmail" | "resetPassword">(
    "sendEmail",
  );

  const onSignInPress = useCallback(async () => {
    if (!isLoaded || !signIn) {
      return Alert.alert("Error", "Sign-in functionality is not available.");
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive?.({ session: signInAttempt.createdSessionId });
        router.replace("/(auth)/success");
      } else {
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      Alert.alert(
        "Error",
        err.errors?.[0]?.longMessage ||
          "Invalid credentials. Please try again.",
      );
    }
  }, [isLoaded, form, setActive, signIn, router]);

  const onForgotPasswordPress = useCallback(async () => {
    if (!resetEmail) {
      return Alert.alert(
        "Error",
        "Please enter your email to reset your password.",
      );
    }

    if (!signIn) {
      return Alert.alert(
        "Error",
        "Password reset functionality is not available.",
      );
    }

    try {
      await signIn.create({
        identifier: resetEmail,
        strategy: "reset_password_email_code",
      });

      Alert.alert(
        "Reset Email Sent",
        "A password reset code has been sent to your email.",
      );
      setResetStage("resetPassword"); // Move to the reset password stage
    } catch (err: any) {
      console.error("Error sending reset email:", err);
      Alert.alert(
        "Error",
        err.errors?.[0]?.longMessage ||
          "Unable to send reset link. Please try again.",
      );
    }
  }, [resetEmail, signIn]);

  const onResetPasswordPress = useCallback(async () => {
    if (!resetCode || !newPassword) {
      return Alert.alert(
        "Error",
        "Please enter the reset code and your new password.",
      );
    }

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
        password: newPassword,
      });

      if (result?.status === "complete") {
        Alert.alert(
          "Success",
          "Your password has been reset successfully. You are now signed in.",
        );
        setModalVisible(false); // Close modal on success
      } else {
        Alert.alert(
          "Error",
          "Password reset failed. Please check the code and try again.",
        );
      }
    } catch (err: any) {
      console.error("Error resetting password:", err);
      Alert.alert(
        "Error",
        err.errors?.[0]?.longMessage ||
          "Something went wrong. Please try again.",
      );
    }
  }, [resetCode, newPassword, signIn]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image
            source={images.signUpCar}
            className="z-0 w-full h-[250px] mt-5"
          />
        </View>

        <Text className="text-5xl text-black font-JakartaBold absolute left-5 mt-[250px]">
          Login
        </Text>

        <View className="p-5 mt-[30px]">
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          <Text
            onPress={() => {
              setModalVisible(true);
              setResetStage("sendEmail");
            }} // Open modal and start at email stage
            className="text-gray-500 text-center mt-4"
          >
            Forgot Password?
          </Text>

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Don't have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>

      {/* Forgot Password Modal */}
      <ReactNativeModal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)} // Close modal when clicking outside
        backdropOpacity={0.5}
      >
        <View className="bg-white px-6 py-8 rounded-lg">
          {resetStage === "sendEmail" && (
            <>
              <Text className="text-2xl font-bold mb-4">Forgot Password</Text>
              <Text className="text-base text-gray-500 mb-6">
                Enter your email to receive a password reset code.
              </Text>

              <TextInput
                placeholder="Enter your email"
                value={resetEmail}
                onChangeText={setResetEmail}
                className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
                keyboardType="email-address"
              />

              <CustomButton
                title="Send Reset Code"
                onPress={onForgotPasswordPress}
                className="mb-4"
              />
            </>
          )}

          {resetStage === "resetPassword" && (
            <>
              <Text className="text-2xl font-bold mb-4">Reset Password</Text>
              <TextInput
                placeholder="Enter the reset code"
                value={resetCode}
                onChangeText={setResetCode}
                className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
              />

              <TextInput
                placeholder="Enter your new password"
                value={newPassword}
                onChangeText={setNewPassword}
                className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
                secureTextEntry
              />

              <CustomButton
                title="Reset Password"
                onPress={onResetPasswordPress}
                className="mb-4"
              />
            </>
          )}

          <CustomButton
            title="Cancel"
            onPress={() => setModalVisible(false)}
            className="bg-gray-300"
          />
        </View>
      </ReactNativeModal>
    </ScrollView>
  );
};

export default SignIn;
