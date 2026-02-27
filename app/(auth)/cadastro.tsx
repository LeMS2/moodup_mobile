import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../src/services/api";

const TOKEN_KEY = "token";

function firstLaravelError(data: any) {
  // Laravel 422 costuma vir: { message, errors: { field: ["msg"] } }
  const errs = data?.errors;
  if (!errs || typeof errs !== "object") return null;

  const firstKey = Object.keys(errs)[0];
  const firstMsg = Array.isArray(errs[firstKey]) ? errs[firstKey][0] : null;
  return firstMsg || null;
}

export default function Cadastro() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleCadastro() {
    setErro("");

    const nameClean = name.trim();
    const emailClean = email.trim().toLowerCase();
    const passClean = password.trim();
    const passConfClean = passwordConfirmation.trim();

    if (!nameClean || !emailClean || !passClean || !passConfClean) {
      setErro("Preencha nome, email, senha e confirmação.");
      return;
    }

    // ✅ seu backend exige min:8
    if (passClean.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (passClean !== passConfClean) {
      setErro("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: nameClean,
        email: emailClean,
        password: passClean,
        password_confirmation: passConfClean,
      });

      const token =
        res.data?.token ??
        res.data?.access_token ??
        res.data?.data?.token ??
        null;

      if (token && typeof token === "string") {
        await AsyncStorage.setItem(TOKEN_KEY, token);

        // ✅ crucial: seta o header em memória (evita race condition)
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        // ✅ opcional: web às vezes precisa de um tiquinho
        await new Promise((r) => setTimeout(r, 150));

        const saved = await AsyncStorage.getItem(TOKEN_KEY);
        console.log("TOKEN SALVO (cadastro):", saved);

        router.replace("/(tabs)/moods" as any);
        return;
      }

      // Se não veio token (não é seu caso, seu backend retorna), manda pro login
      router.replace("/(auth)/login" as any);
    } catch (e: any) {
      console.log("ERRO CADASTRO:", e?.response?.status, e?.response?.data, e?.message);

      const laravelMsg = firstLaravelError(e?.response?.data);

      const msg =
        laravelMsg ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        e?.message ||
        "Não foi possível cadastrar.";

      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>Crie sua conta no MoodUp</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seuemail@exemplo.com"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="mínimo 8 caracteres"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
          placeholder="repita a senha"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />

        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

        <Pressable
          onPress={handleCadastro}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.85 },
            loading && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? "CRIANDO..." : "CRIAR CONTA"}
          </Text>
        </Pressable>

        <Link href="/(auth)/login" style={styles.linkCenter}>
          Já tenho conta → Entrar
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#0F172A",
    borderColor: "#1F2937",
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  title: {
    color: "#E5E7EB",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#94A3B8",
    marginBottom: 18,
  },
  label: {
    color: "#CBD5E1",
    marginBottom: 6,
    marginTop: 10,
    fontSize: 13,
  },
  input: {
    backgroundColor: "#0B1220",
    borderColor: "#243041",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#E5E7EB",
  },
  errorText: {
    color: "#ff6b6b",
    marginTop: 10,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#2dd4bf",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#08101a",
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  linkCenter: {
    color: "#E5E7EB",
    opacity: 0.9,
    marginTop: 12,
    textAlign: "center",
  },
});