import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/src/services/api";

const LOCAL_TERMS_KEY = "accepted_terms_local";
const TOKEN_KEY = "token";

export default function Terms() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  async function aceitar() {
    try {
      // 👉 FLUXO DE CADASTRO
      if (mode === "cadastro") {
        await AsyncStorage.setItem(LOCAL_TERMS_KEY, "true");

        // 🔥 VAI DIRETO PRO APP
        router.replace("/(tabs)/moods" as any);
        return;
      }

      // 👉 FLUXO USUÁRIO LOGADO
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        Alert.alert("Erro", "Sessão não encontrada. Faça login novamente.");
        router.replace("/(auth)/login" as any);
        return;
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      await api.post("/auth/accept-terms");

      router.replace("/(tabs)/moods" as any);
    } catch (error: any) {
      console.log(
        "ERRO AO ACEITAR TERMOS:",
        error?.response?.status,
        error?.response?.data,
        error?.message
      );

      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Não foi possível registrar o aceite dos termos."
      );
    }
  }

  function voltar() {
    if (mode === "cadastro") {
      router.replace("/(auth)/cadastro" as any);
      return;
    }

    router.replace("/(auth)/welcome" as any);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.card}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Termos de Uso e Responsabilidade</Text>

        <Text style={styles.text}>
          O MoodUp é um aplicativo de apoio emocional e autocuidado.
        </Text>

        <Text style={styles.text}>
          O aplicativo não realiza diagnóstico, não prescreve medicamentos e não
          substitui acompanhamento profissional.
        </Text>

        <Text style={styles.sectionTitle}>
          Ao utilizar o MoodUp, você declara estar ciente de que:
        </Text>

        <Text style={styles.bullet}>
          • o aplicativo não substitui atendimento profissional;
        </Text>
        <Text style={styles.bullet}>
          • as recomendações são de apoio e autocuidado;
        </Text>
        <Text style={styles.bullet}>
          • em situações críticas, deve-se buscar ajuda especializada;
        </Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Importante</Text>
          <Text style={styles.warningText}>
            Em caso de crise, procure ajuda profissional ou ligue 188 (CVV).
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={aceitar}>
          <Text style={styles.buttonText}>Aceitar e continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={voltar}>
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 16,
    padding: 18,
  },
  title: {
    color: "#E5E7EB",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#E5E7EB",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
  },
  text: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  bullet: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
  },
  warningBox: {
    marginTop: 20,
    backgroundColor: "rgba(250, 204, 21, 0.08)",
    borderColor: "rgba(250, 204, 21, 0.30)",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  warningTitle: {
    color: "#FACC15",
    fontWeight: "800",
    marginBottom: 6,
  },
  warningText: {
    color: "#E5E7EB",
    lineHeight: 21,
    fontSize: 13,
  },
  button: {
    marginTop: 22,
    backgroundColor: "#E91E63",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.12)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#E5E7EB",
    fontWeight: "700",
    fontSize: 15,
  },
});