import React from "react";
import { View, Text, ScrollView } from "react-native";
// import Carrossel from "../../Componentes/Carrossel";
import Logo2 from "../../Componentes/imagens/Logo2";
import Grafic1 from "../../Componentes/imagens/grafic1";
import Grafic2 from "../../Componentes/imagens/Grafic2";
import { useAuth } from "../../Context/AuthContext";
import { styles } from "./styles";
import SalesGoal from "../../Componentes/Grafic/pessoal";
import DashboardGlobal from "../../Componentes/Grafic/empresa";

export default function Home() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo2 />
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Bem-vindo, {user?.razao_social || "Usuário"}! 👋🏼
        </Text>
      </View>

      {/* <Carrossel /> */}

      
    </ScrollView>
  );
}
