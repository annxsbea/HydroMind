import React from "react";
import { View, Text, ScrollView } from "react-native";
import Logo2 from "../../Componentes/imagens/Logo2";
import { useAuth } from "../../Context/AuthContext";
import { styles } from "./styles";
import SalesGoal from "../../Componentes/Grafic/pessoal";
import Carrossel from "../../Componentes/Carrossel";

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

    
       <View style={styles.dashboardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Economia em dinheiro</Text>
          <Text style={styles.cardValue}>R$1200</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "70%" }]}></View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>IAS em Processamento</Text>
          <Text style={styles.cardValue}>3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "40%" }]}></View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tempo implementação </Text>
          <Text style={styles.cardValue}>10h</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "90%" }]}></View>
          </View>
        </View>
      </View>

      <View>
        <SalesGoal />
      </View>
     
    </ScrollView>
  );
}
