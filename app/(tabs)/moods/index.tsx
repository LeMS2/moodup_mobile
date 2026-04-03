import { Image } from "expo-image";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  function handleLogout() {
    router.replace("/(auth)/welcome" as any);
  }

  return (
    <View style={styles.container}>
      {/* IMAGEM */}
      <Image
        source={require("@/assets/images/imagem_moodup.jpeg")}
        style={styles.image}
        contentFit="cover"
      />

      {/* CONTEÚDO */}
      <View style={styles.content}>
        <Text style={styles.title}>MoodUp</Text>

        <Text style={styles.subtitle}>
          Seu diário de apoio emocional
        </Text>

        <Text style={styles.bigText}>
          Aqui você pode pausar, refletir e cuidar do que sente.
        </Text>

        <Text style={styles.description}>
          Registre seus humores, acompanhe sua evolução ao longo do tempo e encontre apoio nos momentos mais difíceis.
        </Text>

        {/* BOTÃO SAIR */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.85 },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },

  image: {
    width: "100%",
    height: 320,
  },

  content: {
    flex: 1,
    padding: 20,
    marginTop: -40,
    backgroundColor: "#0F172A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  title: {
    color: "#E5E7EB",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    color: "#2dd4bf",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  bigText: {
    color: "#E5E7EB",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    marginBottom: 16,
  },

  description: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
  },

  logoutButton: {
    backgroundColor: "#6d5efc", // azul/roxo igual botão anterior
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
});