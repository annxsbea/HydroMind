import React from "react";
import { View, Text, ScrollView } from "react-native";
// import Carrossel from "../../Componentes/Carrossel";
import Logo2 from "../../Componentes/imagens/Logo2";
import Grafic1 from "../../Componentes/imagens/grafic1";
import Grafic2 from "../../Componentes/imagens/Grafic2";
import { useAuth } from "../../Context/AuthContext";
import { styles } from "./styles";
import SalesGoal from "../../Componentes/Grafic/pessoal";
import Carrossel from "../../Componentes/Carrossel";

export default function Home() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Logo2 />
      </View>

      {/* Mensagem de boas-vindas */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Bem-vindo, {user?.razao_social || "Usuário"}! 👋🏼
        </Text>
      </View>

    
       {/* Cards do dashboard */}
       <View style={styles.dashboardContainer}>
        {/* Card 1 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Economia em dinheiro</Text>
          <Text style={styles.cardValue}>R$1200</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "70%" }]}></View>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>IAS em Processamento</Text>
          <Text style={styles.cardValue}>3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "40%" }]}></View>
          </View>
        </View>

        {/* Card 3 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tempo implementação </Text>
          <Text style={styles.cardValue}>10h</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "90%" }]}></View>
          </View>
        </View>
      </View>

      {/* Carrossel (se necessário) */}
    

      {/* Gráfico de meta de vendas */}
      <View>
        <SalesGoal />
      </View>
      <Carrossel />
     
    </ScrollView>
  );
}
