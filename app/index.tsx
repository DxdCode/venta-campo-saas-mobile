import { View, Text, Button } from "react-native";
import { useAuthStore } from "./src/store/useAuthStore";
import { router } from "expo-router";

export default function Index() {
  const logout = useAuthStore((s: any) => s.logout);
  const user = useAuthStore((s: any) => s.user);

    const handleLogout = async () => {
    try {
      await logout();            
      router.replace("/login");  
    } catch (e) {
      console.log("Error logout:", e);
    }
  };
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl mb-4">Hola {user?.name}</Text>
      <Text className="text-xl mb-4">
        Con rol de: {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
      </Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
