import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";

const C = Colors.light;

export default function AdminLayout() {
  const { profile, loading, user } = useAuth();

  useEffect(() => {
    if (!loading && profile !== null && profile?.role !== "admin") {
      router.replace("/(tabs)");
    }
  }, [loading, profile]);

  if (loading || (user !== null && profile === null)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.background }}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={{ marginTop: 12, fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary }}>
          Loading admin panel…
        </Text>
      </View>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.background, padding: 32 }}>
        <Feather name="lock" size={48} color={C.error} />
        <Text style={{ fontSize: 20, fontFamily: "Inter_700Bold", color: C.text, marginTop: 16 }}>Access Denied</Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary, textAlign: "center", marginTop: 8 }}>
          You do not have permission to view this area.
        </Text>
        <Pressable
          style={{ marginTop: 24, backgroundColor: C.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15 }}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: C.surface },
        headerTintColor: C.text,
        headerTitleStyle: { fontFamily: "Inter_600SemiBold", fontSize: 17 },
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 4, marginLeft: 4 }}
          >
            <Feather name="arrow-left" size={22} color={C.text} />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Admin Dashboard" }} />
      <Stack.Screen name="users" options={{ title: "User Management" }} />
      <Stack.Screen name="listings" options={{ title: "Marketplace Moderation" }} />
      <Stack.Screen name="modules" options={{ title: "Learning Modules" }} />
      <Stack.Screen name="logs" options={{ title: "Activity Log" }} />
    </Stack>
  );
}
