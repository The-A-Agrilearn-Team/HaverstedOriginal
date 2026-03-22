import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";
import { useCreateListing } from "@/hooks/useListings";

const C = Colors.light;

const CATEGORIES = [
  { key: "Vegetables", icon: "layers" },
  { key: "Fruits",     icon: "sun" },
  { key: "Grains",     icon: "wind" },
  { key: "Livestock",  icon: "heart" },
  { key: "Poultry",    icon: "feather" },
  { key: "Dairy",      icon: "droplet" },
  { key: "Other",      icon: "package" },
];

const UNITS = ["kg", "litre", "dozen", "unit", "bag", "ton", "crate"];

const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

export default function CreateListingScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const createListing = useCreateListing();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user || (profile?.role !== "farmer" && profile?.role !== "admin")) {
    return (
      <View style={[styles.accessDenied, { paddingTop: insets.top + 60 }]}>
        <Feather name="lock" size={40} color={C.textTertiary} />
        <Text style={styles.accessTitle}>Farmers Only</Text>
        <Text style={styles.accessText}>
          Only registered farmers can list produce on the marketplace.
        </Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 3) e.title = "Title must be at least 3 characters";
    if (!description.trim() || description.trim().length < 10) e.description = "Description must be at least 10 characters";
    if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = "Enter a valid price greater than 0";
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0 || !Number.isInteger(Number(quantity))) e.quantity = "Enter a whole number greater than 0";
    if (!location.trim()) e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await createListing.mutateAsync({
        farmer_id: user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        unit,
        location: location.trim(),
        status: "active",
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Listing Published!",
        `"${title.trim()}" is now live on the marketplace.`,
        [{ text: "View Marketplace", onPress: () => router.replace("/(tabs)/market") }]
      );
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Failed to publish", err?.message ?? "Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.navBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.navTitle}>New Listing</Text>
        <View style={styles.navBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        <Text style={styles.sectionLabel}>Product Details</Text>
        <View style={styles.card}>
          <Field
            label="Product Name"
            placeholder="e.g. Fresh Tomatoes, Grade A Maize"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
            maxLength={100}
          />
          <View style={styles.fieldDivider} />
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              placeholder="Describe your product — freshness, farming method, pickup/delivery options..."
              placeholderTextColor={C.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <View style={styles.charCount}>
              <Text style={[styles.charCountText, description.length > 450 && { color: C.warning }]}>
                {description.length}/500
              </Text>
            </View>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
        </View>

        <Text style={styles.sectionLabel}>Category</Text>
        <View style={styles.card}>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.key}
                style={({ pressed }) => [
                  styles.categoryChip,
                  category === cat.key && styles.categoryChipActive,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
                onPress={() => {
                  setCategory(cat.key);
                  Haptics.selectionAsync();
                }}
              >
                <Feather
                  name={cat.icon as any}
                  size={16}
                  color={category === cat.key ? "#fff" : C.textSecondary}
                />
                <Text style={[
                  styles.categoryChipText,
                  category === cat.key && styles.categoryChipTextActive,
                ]}>
                  {cat.key}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionLabel}>Pricing & Quantity</Text>
        <View style={styles.card}>
          <View style={styles.rowFields}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Price (R)</Text>
              <View style={[styles.inputWrapper, errors.price && styles.inputError]}>
                <Text style={styles.currencyPrefix}>R</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={C.textTertiary}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Quantity</Text>
              <View style={[styles.inputWrapper, errors.quantity && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={C.textTertiary}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
            </View>
          </View>

          <View style={styles.fieldDivider} />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Unit of Measure</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.unitRow}
            >
              {UNITS.map((u) => (
                <Pressable
                  key={u}
                  style={[styles.unitChip, unit === u && styles.unitChipActive]}
                  onPress={() => {
                    setUnit(u);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[styles.unitChipText, unit === u && styles.unitChipTextActive]}>{u}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.priceSummary}>
            <Text style={styles.priceSummaryLabel}>Price per {unit}</Text>
            <Text style={styles.priceSummaryValue}>
              R{price ? parseFloat(price || "0").toFixed(2) : "0.00"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Location</Text>
        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Farm / City Location</Text>
            <View style={[styles.inputWrapper, errors.location && styles.inputError]}>
              <Feather name="map-pin" size={16} color={C.textSecondary} style={{ marginLeft: 14 }} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Durban, KZN"
                placeholderTextColor={C.textTertiary}
                value={location}
                onChangeText={setLocation}
              />
            </View>
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          <View style={styles.fieldDivider} />

          <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>Or select a province</Text>
          <View style={styles.provincesGrid}>
            {SA_PROVINCES.map((prov) => (
              <Pressable
                key={prov}
                style={({ pressed }) => [
                  styles.provinceChip,
                  location === prov && styles.provinceChipActive,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => {
                  setLocation(prov);
                  setErrors((e) => ({ ...e, location: "" }));
                  Haptics.selectionAsync();
                }}
              >
                <Text style={[
                  styles.provinceChipText,
                  location === prov && styles.provinceChipTextActive,
                ]}>
                  {prov}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Preview</Text>
          <View style={styles.previewContent}>
            <View style={styles.previewIconBox}>
              <Feather
                name={(CATEGORIES.find((c) => c.key === category)?.icon ?? "package") as any}
                size={24}
                color={C.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.previewTitle}>{title || "Product name"}</Text>
              <Text style={styles.previewMeta}>
                {location || "Location"} · {profile?.full_name ?? "You"}
              </Text>
            </View>
            <Text style={styles.previewPrice}>
              R{price ? parseFloat(price).toFixed(2) : "—"}
              {"\n"}
              <Text style={styles.previewUnit}>per {unit}</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            { opacity: pressed || createListing.isPending ? 0.85 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={createListing.isPending}
        >
          {createListing.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="upload" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Publish Listing</Text>
            </>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({
  label, placeholder, value, onChangeText, error, maxLength,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  maxLength?: number;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrapper, !!error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={C.textTertiary}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  accessDenied: {
    flex: 1,
    backgroundColor: C.background,
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  accessTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: C.text },
  accessText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: C.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  backBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  backBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: C.background,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: C.text },
  scrollContent: { padding: 20, gap: 8 },
  sectionLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: C.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    gap: 0,
    marginBottom: 4,
  },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: C.text },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surfaceSecondary,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    minHeight: 46,
  },
  inputError: { borderColor: C.error },
  currencyPrefix: {
    paddingLeft: 14,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: C.primary,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: C.text,
  },
  textArea: {
    backgroundColor: C.surfaceSecondary,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    padding: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: C.text,
    minHeight: 100,
    lineHeight: 22,
  },
  charCount: { alignItems: "flex-end" },
  charCountText: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textTertiary },
  errorText: { fontSize: 12, fontFamily: "Inter_500Medium", color: C.error },
  fieldDivider: { height: 1, backgroundColor: C.borderLight, marginVertical: 14 },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surfaceSecondary,
  },
  categoryChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  categoryChipText: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.textSecondary },
  categoryChipTextActive: { color: "#fff" },
  rowFields: { flexDirection: "row", gap: 12 },
  unitRow: { gap: 8, paddingVertical: 2 },
  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surfaceSecondary,
  },
  unitChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  unitChipText: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.textSecondary },
  unitChipTextActive: { color: "#fff" },
  priceSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: `${C.primary}08`,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
  },
  priceSummaryLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.textSecondary },
  priceSummaryValue: { fontSize: 18, fontFamily: "Inter_700Bold", color: C.primary },
  provincesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  provinceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surfaceSecondary,
  },
  provinceChipActive: { backgroundColor: `${C.primary}14`, borderColor: C.primary },
  provinceChipText: { fontSize: 12, fontFamily: "Inter_500Medium", color: C.textSecondary },
  provinceChipTextActive: { color: C.primary },
  previewCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.primary,
    padding: 16,
    marginTop: 8,
    gap: 10,
  },
  previewLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: C.primary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  previewContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  previewIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${C.primary}12`,
    alignItems: "center",
    justifyContent: "center",
  },
  previewTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: C.text },
  previewMeta: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary, marginTop: 2 },
  previewPrice: { fontSize: 16, fontFamily: "Inter_700Bold", color: C.primary, textAlign: "right" },
  previewUnit: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textSecondary },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: C.background,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: C.primary,
    borderRadius: 14,
    padding: 16,
  },
  submitBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
