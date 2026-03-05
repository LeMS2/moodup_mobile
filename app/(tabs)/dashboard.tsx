import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Linking } from "react-native";
import { api } from "@/src/services/api";
import { router } from "expo-router";

type WeeklySeriesItem = { date: string; avg_level: number | null; count: number };
type AlertItem = { type: "critical" | "warning" | string; title: string; message: string };
type TriggerItem = { trigger: string; count: number };

type WeeklyInsights = {
  range: { start: string; end: string };
  series: WeeklySeriesItem[];
  avg_level_week: number | null;
  low_days: number;
  trend: number | null;
  risk_score: number | null;
  risk_level: "baixo" | "medio" | "alto" | "desconhecido";
  top_triggers: TriggerItem[];
  alerts: AlertItem[];
};

type Resource = {
  id?: number;
  type?: string;
  title?: string;
  description?: string;
  url?: string | null;
  author?: string | null;
  duration_minutes?: number | null;
  tags?: string[] | null;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [insights, setInsights] = useState<WeeklyInsights | null>(null);
  const [rec, setRec] = useState<Resource | null>(null);

  async function load() {
    setErr("");
    setLoading(true);

    try {
      const [a, b] = await Promise.all([
        api.get("/moods/insights/weekly"),
        api.get("/resources/recommendation/history"),
      ]);

      setInsights(a.data);
      setRec(b.data?.recommendation ?? null);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Não foi possível carregar o dashboard.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const bars = useMemo(() => {
    const s = insights?.series ?? [];
    // max para normalizar barrinhas (1..5)
    const max = 5;
    return s.map((it) => {
      const val = it.avg_level ?? 0;
      const pct = Math.max(0, Math.min(1, val / max));
      return { ...it, pct };
    });
  }, [insights]);

  const riskBadge = useMemo(() => {
    const level = insights?.risk_level ?? "desconhecido";
    if (level === "alto") return { label: "ALTO", style: s.badgeHigh };
    if (level === "medio") return { label: "MÉDIO", style: s.badgeMid };
    if (level === "baixo") return { label: "BAIXO", style: s.badgeLow };
    return { label: "—", style: s.badgeUnknown };
  }, [insights]);

  function trendText(v: number | null | undefined) {
    if (v === null || v === undefined) return "Sem dados suficientes";
    if (v > 0.2) return "Melhorando ✅";
    if (v < -0.2) return "Piorando ⚠️";
    return "Estável";
  }

  function safeOpen(url?: string | null) {
    if (!url) return;
    Linking.openURL(url);
  }

  const todayRiskIsHigh = (insights?.risk_level === "alto");

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 28 }}>
      <Text style={s.title}>Dashboard</Text>
      <Text style={s.subtitle}>
        Evolução da semana • risco emocional • gatilhos • recomendação
      </Text>

      {loading ? (
        <View style={{ marginTop: 18, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={s.muted}>Carregando...</Text>
        </View>
      ) : err ? (
        <View style={s.card}>
          <Text style={s.cardTitle}>Erro</Text>
          <Text style={s.muted}>{err}</Text>
          <Pressable onPress={load} style={s.btnPrimary}>
            <Text style={s.btnPrimaryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* Card risco */}
          <View style={s.card}>
            <View style={s.rowBetween}>
              <Text style={s.cardTitle}>Risco da semana</Text>
              <View style={[s.badge, riskBadge.style]}>
                <Text style={s.badgeText}>{riskBadge.label}</Text>
              </View>
            </View>

            <Text style={s.muted}>
              Score: {insights?.risk_score ?? "—"} • Média (level): {insights?.avg_level_week ?? "—"} • Dias baixos: {insights?.low_days ?? 0}
            </Text>

            <Text style={[s.muted, { marginTop: 6 }]}>
              Tendência: {trendText(insights?.trend)}
            </Text>

            {/* Se risco alto, já deixa um bloco de apoio visível */}
            {todayRiskIsHigh && (
              <View style={s.alertCriticalBox}>
                <Text style={s.alertTitle}>Precisa de apoio agora?</Text>
                <Text style={s.alertText}>
                  Se você estiver se sentindo muito mal, conversar com alguém pode ajudar.
                </Text>

                <Pressable
                  style={[s.btnPrimary, { marginTop: 10 }]}
                  onPress={() => Linking.openURL("tel:188")}
                >
                  <Text style={s.btnPrimaryText}>Ligar para o CVV (188)</Text>
                </Pressable>

                {/* Psicóloga: pode virar rota/tela depois */}
                <Pressable style={s.btnGhost} onPress={() => {}}>
                  <Text style={s.btnGhostText}>Contato da psicóloga (em breve)</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Alertas vindos do backend */}
          {(insights?.alerts?.length ?? 0) > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>Alertas</Text>
              {insights!.alerts.map((a, idx) => (
                <View
                  key={idx}
                  style={[s.alertBox, a.type === "critical" ? s.alertCritical : s.alertWarn]}
                >
                  <Text style={s.alertTitle}>{a.title}</Text>
                  <Text style={s.alertText}>{a.message}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Gráfico simples (barrinhas) */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Evolução emocional (7 dias)</Text>
            <Text style={s.muted}>Média do level por dia (1 a 5)</Text>

            <View style={s.chartWrap}>
              {bars.map((b) => (
                <View key={b.date} style={s.chartCol}>
                  <View style={s.chartTrack}>
                    <View style={[s.chartBar, { height: `${Math.round(b.pct * 100)}%` } as any]} />
                  </View>
                  <Text style={s.chartLabel}>
                    {b.date.slice(8, 10)}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={[s.muted, { marginTop: 8 }]}>
              Dica: se um dia ficou “sem barra”, é porque não teve registro naquele dia.
            </Text>
          </View>

          {/* Top triggers */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Gatilhos mais frequentes</Text>
            {(insights?.top_triggers?.length ?? 0) === 0 ? (
              <Text style={s.muted}>Sem gatilhos suficientes esta semana.</Text>
            ) : (
              <View style={{ marginTop: 10, gap: 8 }}>
                {insights!.top_triggers.map((t) => (
                  <View key={t.trigger} style={s.triggerRow}>
                    <Text style={s.triggerText}>{t.trigger}</Text>
                    <Text style={s.triggerCount}>{t.count}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Recomendação da semana */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Recomendação da semana</Text>

            {!rec ? (
              <Text style={s.muted}>Sem recomendação disponível.</Text>
            ) : (
              <>
                <Text style={s.recTitle}>{rec.title}</Text>
                <Text style={s.muted}>
                  {rec.type ? `Tipo: ${rec.type}` : ""}{rec.duration_minutes ? ` • ${rec.duration_minutes} min` : ""}
                </Text>
                {rec.description ? <Text style={[s.muted, { marginTop: 8 }]}>{rec.description}</Text> : null}

                {rec.url ? (
                  <Pressable
  style={s.btnPrimary}
  onPress={() => {
    router.push({
      pathname: "/resource-detail",
      params: {
        title: rec.title,
        description: rec.description,
        author: rec.author,
        type: rec.type,
        duration: String(rec.duration_minutes ?? ""),
        url: rec.url ?? "",
        tags: rec.tags?.join(",") ?? "",
      },
    });
  }}
>
                    <Text style={s.btnPrimaryText}>Abrir</Text>
                  </Pressable>
                ) : (
                  <View style={s.alertBox}>
                    <Text style={s.alertText}>
                      Esse recurso não tem link — é um exercício interno. Você pode mostrar o texto aqui (ou criar uma tela “Detalhe do recurso”).
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0b0f1a" },
  title: { fontSize: 26, fontWeight: "900", color: "#e7ecff", marginTop: 8 },
  subtitle: { color: "#9aa6c3", marginTop: 6 },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  card: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.10)",
    backgroundColor: "rgba(255,255,255,.03)",
  },
  cardTitle: { color: "#e7ecff", fontWeight: "800", fontSize: 16 },

  muted: { color: "#9aa6c3", marginTop: 6, lineHeight: 18 },

  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  badgeText: { color: "#e7ecff", fontWeight: "900", fontSize: 12 },
  badgeHigh: { borderColor: "rgba(255,90,90,.7)", backgroundColor: "rgba(255,90,90,.12)" },
  badgeMid: { borderColor: "rgba(255,200,80,.7)", backgroundColor: "rgba(255,200,80,.12)" },
  badgeLow: { borderColor: "rgba(45,212,191,.7)", backgroundColor: "rgba(45,212,191,.10)" },
  badgeUnknown: { borderColor: "rgba(255,255,255,.18)", backgroundColor: "rgba(255,255,255,.06)" },

  alertBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.10)",
    backgroundColor: "rgba(255,255,255,.04)",
  },
  alertWarn: { borderColor: "rgba(255,200,80,.35)", backgroundColor: "rgba(255,200,80,.06)" },
  alertCritical: { borderColor: "rgba(255,90,90,.35)", backgroundColor: "rgba(255,90,90,.06)" },

  alertCriticalBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,90,90,.35)",
    backgroundColor: "rgba(255,90,90,.06)",
  },
  alertTitle: { color: "#e7ecff", fontWeight: "900" },
  alertText: { color: "#9aa6c3", marginTop: 6, lineHeight: 18 },

  btnPrimary: {
    marginTop: 12,
    backgroundColor: "#2dd4bf",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#08101a", fontWeight: "900" },

  btnGhost: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.12)",
  },
  btnGhostText: { color: "#e7ecff", fontWeight: "800" },

  // gráfico simples
  chartWrap: { marginTop: 12, flexDirection: "row", gap: 10, alignItems: "flex-end" },
  chartCol: { width: 34, alignItems: "center" },
  chartTrack: {
    width: 18,
    height: 90,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,.06)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  chartBar: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "rgba(45,212,191,.85)",
  },
  chartLabel: { color: "#9aa6c3", marginTop: 6, fontSize: 12 },

  // triggers
  triggerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.10)",
    backgroundColor: "rgba(255,255,255,.04)",
  },
  triggerText: { color: "#e7ecff", fontWeight: "800" },
  triggerCount: { color: "#9aa6c3", fontWeight: "900" },

  // recomendação
  recTitle: { color: "#e7ecff", fontWeight: "900", fontSize: 16, marginTop: 10 },
});