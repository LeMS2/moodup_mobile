import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/src/services/api";

const TOKEN_KEY = "token";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);

        if (!token) {
          router.replace("/(auth)/welcome" as any);
          return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        const res = await api.get("/me");

        const accepted = Boolean(
          res.data?.accepted_terms ??
          !!res.data?.user?.accepted_terms_at
        );

        if (accepted) {
          router.replace("/(tabs)/moods" as any);
        } else {
          router.replace("/terms?mode=auth" as any);
        }
      } catch (error) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        delete api.defaults.headers.common.Authorization;
        router.replace("/(auth)/welcome" as any);
      }
    }

    checkAuth();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6d5efc" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f1a",
    justifyContent: "center",
    alignItems: "center",
  },
});