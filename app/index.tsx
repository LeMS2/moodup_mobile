import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={s.container}>
      <Text style={s.logo}>MoodUp</Text>
      <Text style={s.subtitle}>Seu diário de humor, simples e rápido.</Text>

      <Link href="/(auth)/login" asChild>
        <Pressable style={s.btn}>
          <Text style={s.btnText}>Entrar</Text>
        </Pressable>
      </Link>

      <Link href="/(auth)/cadastro" asChild>
        <Pressable style={s.btnSecondary}>
          <Text style={s.btnSecondaryText}>Criar conta</Text>
        </Pressable>
      </Link>

      <Link href="/(auth)/esqueci-senha" style={s.link}>
        Esqueci minha senha
      </Link>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#0b0f1a",
  },
  logo: { fontSize: 40, fontWeight: "900", color: "#e7ecff", letterSpacing: 0.5 },
  subtitle: { color: "#9aa6c3", marginBottom: 14, fontSize: 15 },
  btn: {
    backgroundColor: "#6d5efc",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: { fontWeight: "900", color: "#08101a", fontSize: 16 },
  btnSecondary: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.14)",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,.03)",
  },
  btnSecondaryText: { fontWeight: "900", color: "#e7ecff", fontSize: 16 },
  link: { color: "#e7ecff", opacity: 0.9, marginTop: 8, textAlign: "center" },
});