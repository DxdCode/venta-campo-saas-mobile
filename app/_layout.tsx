import "../global.css"; 

import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "./src/store/useAuthStore";

export default function RootLayout() {
  const { user, loading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        user.role === "admin" ? (
          <Stack.Screen name="admin/index" />
        ) : (
          <Stack.Screen name="index" />
        )
      ) : (
        <Stack.Screen name="login" />
      )}
    </Stack>
  );
}
