import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, ActivityIndicator } from "react-native";
import { api } from "@/src/services/api";
import { useRouter } from "expo-router";

type Mood = {
  id: number;
  level: number;
};

type Item = { title: string; desc: string; url?: string };

const EXERCICIOS: Item[] = [
  { title: "Respiração 4-7-8", desc: "Inspire 4s, segure 7s, solte 8s — repita 4 vezes." },
  { title: "Grounding 5-4-3-2-1", desc: "5 coisas que vê, 4 que sente, 3 que ouve, 2 que cheira, 1 que prova." },
];

const VIDEOS: Item[] = [
  { title: "Mindfulness para iniciantes", desc: "Prática leve para atenção plena.", url: "https://www.youtube.com/results?search_query=mindfulness+iniciante" },
];

const LIVROS: Item[] = [
  { title: "Inteligência Emocional (Daniel Goleman)", desc: "Base clássica sobre emoções e autocontrole." },
];

export default function AjudaScreen() {
  const router = useRouter();
  const [lastMood, setLastMood] = useState<Mood | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLastMood() {
      try {
        const res = await api.get("/moods?per_page=1");
        const mood = res.data?.data?.[0];
        setLastMood(mood ?? null);
      } catch (e) {
        console.log("Erro ao buscar mood:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchLastMood();
  }, []);

  function renderSection(title: string, items: Item[]) {
    return (
      <View style={{ marginTop: 20 }}>
        <Text style={s.sectionTitle}>{title}</Text>
        <View style={{ gap: 10, marginTop: 10 }}>
          {items.map((it) => (
            <View key={it.title} style={s.card}>
              <Text style={s.cardTitle}>{it.title}</Text>
              <Text style={s.cardDesc}>{it.desc}</Text>

              {it.url && (
                <Pressable style={s.btn} onPress={() => Linking.openURL(it.url!)}>
                  <Text style={s.btnText}>Abrir</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={s.loading}>
        <ActivityIndicator size="large" color="#2dd4bf" />
      </View>
    );
  }

  const level = lastMood?.level ?? 3;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
      <Text style={s.title}>Auxílio Personalizado</Text>

      {level <= 2 && (
        <>
          <Text style={s.alert}>
            Percebemos que seu último registro indica um momento difícil.
          </Text>

          <Pressable style={s.aiBtn} onPress={() => router.push("/ai")}>
            <Text style={s.aiBtnText}>Conversar com a IA agora</Text>
          </Pressable>

          {renderSection("Exercícios rápidos", EXERCICIOS)}
        </>
      )}

      {level === 3 && (
        <>
          {renderSection("Exercícios leves", EXERCICIOS)}
          {renderSection("Vídeos recomendados", VIDEOS)}
        </>
      )}

      {level >= 4 && (
        <>
          {renderSection("Desenvolvimento pessoal", LIVROS)}
          {renderSection("Conteúdos complementares", VIDEOS)}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F19" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0B0F19" },

  title: { color: "#E5E7EB", fontSize: 24, fontWeight: "900" },

  alert: {
    color: "#facc15",
    marginTop: 12,
    fontWeight: "600",
  },

  sectionTitle: { color: "#E5E7EB", fontSize: 16, fontWeight: "800" },

  card: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.08)",
  },

  cardTitle: { color: "#E5E7EB", fontWeight: "900" },
  cardDesc: { color: "#94A3B8", marginTop: 6 },

  btn: {
    marginTop: 12,
    backgroundColor: "#2dd4bf",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: { color: "#08101a", fontWeight: "900" },

  aiBtn: {
    marginTop: 14,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  aiBtnText: { color: "#fff", fontWeight: "900" },
});