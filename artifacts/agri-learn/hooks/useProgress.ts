import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export interface Progress {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  progress_pct: number;
  last_accessed: string;
}

export function useProgress(moduleId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["progress", user?.id, moduleId],
    enabled: !!user,
    queryFn: async () => {
      let query = supabase
        .from("learning_progress")
        .select("*")
        .eq("user_id", user!.id);

      if (moduleId) query = query.eq("module_id", moduleId).single();

      const { data } = await query;
      return data;
    },
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useMarkComplete() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (moduleId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("learning_progress")
        .upsert(
          {
            user_id: user.id,
            module_id: moduleId,
            completed: true,
            progress_pct: 100,
            last_accessed: new Date().toISOString(),
          },
          { onConflict: "user_id,module_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, moduleId) => {
      queryClient.invalidateQueries({ queryKey: ["progress", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["progress", user?.id, moduleId] });
    },
  });
}

export function useBookmarks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookmarks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("module_id")
        .eq("user_id", user!.id);

      if (error) return [] as string[];
      return (data ?? []).map((b: any) => b.module_id as string);
    },
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ moduleId, isBookmarked }: { moduleId: string; isBookmarked: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      if (isBookmarked) {
        await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("module_id", moduleId);
      } else {
        await supabase.from("bookmarks").insert({ user_id: user.id, module_id: moduleId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] });
    },
  });
}

export function useProfileStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profileStats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [progressRes, bookmarksRes, listingsRes] = await Promise.all([
        supabase.from("learning_progress").select("id").eq("user_id", user!.id).eq("completed", true),
        supabase.from("bookmarks").select("id").eq("user_id", user!.id),
        supabase.from("product_listings").select("id").eq("farmer_id", user!.id),
      ]);
      return {
        completed: progressRes.data?.length ?? 0,
        bookmarks: bookmarksRes.data?.length ?? 0,
        listings: listingsRes.data?.length ?? 0,
      };
    },
    staleTime: 30 * 1000,
    retry: false,
  });
}
