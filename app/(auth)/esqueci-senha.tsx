import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { api } from "../../src/services/api";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  async function enviar() {
    setErro("");
    setMsg("");
    setLoading(true);

    try {
      // ✅ Ajuste a rota conforme seu backend:
      // comuns: /forgot-password, /password/email, /auth/forgot-password
      await api.post("/forgot-password", { email });

      setMsg("Se esse email existir, você vai receber um link para redefinir a senha.");
    } catch (e: any) {
      setErro(e?.response?.data?.message || "Não foi possível enviar. Verifique o email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Esqueci a senha</Text>
      <Text style={s.subtitle}>
        Digite seu email e enviaremos um link de recuperação.
      </Text>

      <TextInput
        style={s.input}
        placeholder="Email"
        placeholderTextColor="#8da0c9"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {erro ? <Text style={s.error}>{erro}</Text> : null}
      {msg ? <Text style={s.ok}>{msg}</Text> : null}

      <Pressable style={s.btn} onPress={enviar} disabled={loading}>
        <Text style={s.btnText}>{loading ? "Enviando..." : "Enviar link"}</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={s.back}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, backgroundColor: "#0b0f1a" },
  title: { fontSize: 26, fontWeight: "900", color: "#e7ecff", marginTop: 10 },
  subtitle: { color: "#9aa6c3", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.12)",
    borderRadius: 14,
    padding: 12,
    color: "#e7ecff",
  },
  btn: { backgroundColor: "#2dd4bf", padding: 14, borderRadius: 14, alignItems: "center", marginTop: 4 },
  btnText: { fontWeight: "900", color: "#08101a" },
  error: { color: "#ff6b6b" },
  ok: { color: "#2dd4bf" },
  back: { marginTop: 12, color: "#e7ecff", opacity: 0.9, textAlign: "center" },
});