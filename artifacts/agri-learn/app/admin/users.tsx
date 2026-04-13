import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAllUsers, useUpdateUserRole, useDeactivateUser } from "@/hooks/useAdmin";

const C = Colors.light;

const ROLES = ["farmer", "buyer", "retailer", "admin"] as const;

const ROLE_COLORS: Record<string, string> = {
  farmer: "#059669",
  buyer: "#F2994A",
  retailer: "#7C3AED",
  admin: "#DC2626",
  deactivated: "#9CA3AF",
};

export default function UsersScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading, refetch } = useAllUsers();
  const updateRole = useUpdateUserRole();
  const deactivate = useDeactivateUser();

  const filtered = users.filter((u: any) =>
    (u.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, currentRole: string) => {
    Alert.alert(
      "Change Role",
      "Select a new role for this user:",
      ROLES.map((role) => ({
        text: role.charAt(0).toUpperCase() + role.slice(1),
        style: role === currentRole ? "cancel" : "default" as "cancel",
        onPress: () => updateRole.mutate({ userId, role }),
       })).concat([{ text: "Cancel", style: "cancel" as const, onPress: () => {} }])
    );
  };

  const handleDeactivate = (userId: string, name: string) => {
    Alert.alert(
      "Deactivate User",
      `Deactivate ${name}? They will lose access to all features.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: () => deactivate.mutate(userId),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.background }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={C.primary} />}
    >
      <View style={[styles.searchBar, { marginTop: 16 }]}>
        <Feather name="search" size={16} color={C.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email…"
          placeholderTextColor={C.textTertiary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={C.textTertiary} />
          </Pressable>
        )}
      </View>

      <Text style={styles.count}>{filtered.length} user{filtered.length !== 1 ? "s" : ""}</Text>

      {isLoading && <ActivityIndicator color={C.primary} style={{ padding: 32 }} />}

      <View style={styles.list}>
        {filtered.map((user: any, i: number) => {
          const initials = (user.full_name ?? user.email ?? "?")
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          const roleColor = ROLE_COLORS[user.role] ?? C.textSecondary;

          return (
            <View
              key={user.id}
              style={[styles.userCard, i < filtered.length - 1 && styles.userCardBorder]}
            >
              <View style={[styles.avatar, { backgroundColor: `${roleColor}20` }]}>
                <Text style={[styles.avatarText, { color: roleColor }]}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{user.full_name ?? "—"}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userMeta}>
                  {user.location ?? "No location"} · Joined {new Date(user.created_at).toLocaleDateString("en-ZA")}
                </Text>
              </View>
              <View style={styles.actions}>
                <Pressable
                  style={[styles.rolePill, { backgroundColor: `${roleColor}15` }]}
                  onPress={() => handleRoleChange(user.id, user.role)}
                >
                  <Text style={[styles.rolePillText, { color: roleColor }]}>
                    {user.role}
                  </Text>
                  <Feather name="chevron-down" size={12} color={roleColor} />
                </Pressable>
                {user.role !== "deactivated" && (
                  <Pressable
                    style={styles.deactivateBtn}
                    onPress={() => handleDeactivate(user.id, user.full_name ?? user.email)}
                  >
                    <Feather name="user-x" size={16} color={C.error} />
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: C.text,
  },
  count: {
    fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary,
    marginHorizontal: 20, marginBottom: 10,
  },
  list: {
    marginHorizontal: 16,
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  userCardBorder: { borderBottomWidth: 1, borderBottomColor: C.borderLight },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  userName: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: C.text },
  userEmail: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary, marginTop: 1 },
  userMeta: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textTertiary, marginTop: 2 },
  actions: { alignItems: "flex-end", gap: 8 },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rolePillText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  deactivateBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${Colors.light.error}10`,
    alignItems: "center",
    justifyContent: "center",
  },
});
