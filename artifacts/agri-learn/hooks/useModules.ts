import { useQuery } from "@tanstack/react-query";
import { supabase, LearningModule } from "@/lib/supabase";

const MOCK_MODULES: LearningModule[] = [
  { id: "1", title: "Intro to Crop Rotation", description: "Improve soil health through strategic crop rotation techniques.", category: "Crops", level: "beginner", content: "", duration_minutes: 15, language: "en", created_at: new Date().toISOString() },
  { id: "2", title: "Water Management Basics", description: "Efficient irrigation strategies for small-scale farms in South Africa.", category: "Irrigation", level: "beginner", content: "", duration_minutes: 20, language: "en", created_at: new Date().toISOString() },
  { id: "3", title: "Soil Testing & pH", description: "Understanding soil composition and how to optimize it for better yields.", category: "Soil", level: "intermediate", content: "", duration_minutes: 25, language: "en", created_at: new Date().toISOString() },
  { id: "4", title: "Pest Identification Guide", description: "Learn to identify and manage common crop pests in Southern Africa.", category: "Pest Control", level: "beginner", content: "", duration_minutes: 18, language: "en", created_at: new Date().toISOString() },
  { id: "5", title: "Selling at Farmers Markets", description: "How to price and present your produce for maximum sales.", category: "Business", level: "beginner", content: "", duration_minutes: 22, language: "en", created_at: new Date().toISOString() },
  { id: "6", title: "Livestock Health Basics", description: "Essential health management for small-scale livestock operations.", category: "Livestock", level: "beginner", content: "", duration_minutes: 30, language: "en", created_at: new Date().toISOString() },
];

async function fetchModules(category?: string): Promise<LearningModule[]> {
  let query = supabase
    .from("learning_modules")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return MOCK_MODULES.filter(
      (m) => !category || category === "All" || m.category === category
    );
  }

  return data as LearningModule[];
}

export function useModules(category?: string) {
  return useQuery({
    queryKey: ["modules", category],
    queryFn: () => fetchModules(category),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useFeaturedModules() {
  return useQuery({
    queryKey: ["modules", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_modules")
        .select("*")
        .eq("is_active", true)
        .limit(5)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) return MOCK_MODULES.slice(0, 3);
      return data as LearningModule[];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
