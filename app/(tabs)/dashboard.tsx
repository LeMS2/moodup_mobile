import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Dashboard() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Dashboard</Text>
      <Text style={s.subtitle}>
        Aqui vai entrar: média, distribuição e melhor/pior dia.
      </Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>Em breve</Text>
        <Text style={s.muted}>
          Primeiro vamos resolver login/cadastro e a lista de moods.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0b0f1a" },
  title: { fontSize: 26, fontWeight: "900", color: "#e7ecff", marginTop: 8 },
  subtitle: { color: "#9aa6c3", marginTop: 6 },
  card: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.10)",
    backgroundColor: "rgba(255,255,255,.03)",
  },
  cardTitle: { color: "#e7ecff", fontWeight: "800", fontSize: 16 },
  muted: { color: "#9aa6c3", marginTop: 6 },
});