import { Stack } from "expo-router";

import { FormProvider } from "@/app/(auth)/FormContext"; // Import your FormProvider

const AuthLayout = () => {
  return (
    <FormProvider>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="start" options={{ headerShown: false }} />
        <Stack.Screen
          name="face-recognition"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="success" options={{ headerShown: false }} />
        <Stack.Screen name="auth-context" options={{ headerShown: false }} />
      </Stack>
    </FormProvider>
  );
};

export default AuthLayout;
