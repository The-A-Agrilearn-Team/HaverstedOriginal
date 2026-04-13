import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "@/constants/colors";
import { useAllModulesAdmin, useDeleteModule } from "@/hooks/useAdmin";

const C = Colors.light;

const LEVEL_COLORS = {
  beginner:     { bg: "#D1FAE5", text: "#059669" },
  intermediate: { bg: "#FEF3C7", text: "#D97706" },
  advanced:     { bg: "#FCE7F3", text: "#DB2777" },
};

export default function ModulesScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: modules = [], isLoading, refetch } = useAllModulesAdmin();
  const deleteModule = useDeleteModule();

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Delete Module",
      `Permanently delete "${title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteModule.mutate(id),
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
      <View style={styles.topRow}>
        <Text style={styles.count}>{modules.length} module{modules.length !== 1 ? "s" : ""}</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() =>
            Alert.alert("Add Module", "Create new modules directly in your Supabase database under the learning_modules table.")
          }
        >
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.addBtnText}>Add Module</Text>
        </Pressable>
      </View>

      {isLoading && <ActivityIndicator color={C.primary} style={{ padding: 32 }} />}

      <View style={styles.list}>
        {modules.map((mod: any, i: number) => {
          const levelStyle = LEVEL_COLORS[mod.level as keyof typeof LEVEL_COLORS] ?? LEVEL_COLORS.beginner;
          const isExpanded = expandedId === mod.id;

          return (
            <View key={mod.id} style={[styles.card, i < modules.length - 1 && styles.cardBorder]}>
              <Pressable
                style={styles.cardHeader}
                onPress={() => setExpandedId(isExpanded ? null : mod.id)}
              >
                <View style={styles.cardIcon}>
                  <Feather name="book-open" size={18} color={C.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{mod.title}</Text>
                  <View style={styles.cardMeta}>
                    <View style={[styles.levelBadge, { backgroundColor: levelStyle.bg }]}>
                      <Text style={[styles.levelText, { color: levelStyle.text }]}>{mod.level}</Text>
                    </View>
                    <Text style={styles.metaText}>{mod.category}</Text>
                    <Text style={styles.metaText}>
                      <Feather name="clock" size={11} color={C.textTertiary} /> {mod.duration_minutes}m
                    </Text>
                  </View>
                </View>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={C.textTertiary} />
              </Pressable>

              {isExpanded && (
                <View style={styles.expanded}>
                  <Text style={styles.expandedDesc}>{mod.description}</Text>
                  <Text style={styles.expandedMeta}>
                    Language: {mod.language ?? "English"} · Published {new Date(mod.created_at).toLocaleDateString("en-ZA")}
                  </Text>
                  <View style={styles.cardActions}>
                    <Pressable
                      style={styles.viewBtn}
                      onPress={() => router.push(`/module/${mod.id}`)}
                    >
                      <Feather name="eye" size={14} color={C.primary} />
                      <Text style={styles.viewBtnText}>Preview</Text>
                    </Pressable>
                    <Pressable
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(mod.id, mod.title)}
                    >
                      <Feather name="trash-2" size={14} color={C.error} />
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginHorizontal: 16, marginTop: 16, marginBottom: 10,
  },
  count: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary },
  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
  },
  addBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
  list: { marginHorizontal: 16, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  card: { padding: 14 },
  cardBorder: { borderBottomWidth: 1, borderBottomColor: C.borderLight },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  cardIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: `${C.primary}12`, alignItems: "center", justifyContent: "center",
  },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: C.text, marginBottom: 6 },
  cardMeta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  levelText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textTertiary },
  expanded: { paddingTop: 12, paddingLeft: 52, gap: 8 },
  expandedDesc: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary, lineHeight: 18 },
  expandedMeta: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textTertiary },
  cardActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  viewBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    borderRadius: 10, paddingVertical: 8, backgroundColor: `${C.primary}10`,
    borderWidth: 1, borderColor: `${C.primary}20`,
  },
  viewBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: C.primary },
  deleteBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    borderRadius: 10, paddingVertical: 8, backgroundColor: `${C.error}08`,
    borderWidth: 1, borderColor: `${C.error}20`,
  },
  deleteBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: C.error },
});
