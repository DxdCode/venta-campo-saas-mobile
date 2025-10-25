import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "./src/store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      router.replace("/"); 
    } catch (e) {
      console.log("Error login:", e);
      Alert.alert("Error", "Credenciales incorrectas");
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-gray-100">
      <Text className="text-3xl font-bold text-center mb-6">Iniciar sesión</Text>
      <TextInput
        placeholder="Email"
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 rounded-lg p-3 mb-6 bg-white"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
