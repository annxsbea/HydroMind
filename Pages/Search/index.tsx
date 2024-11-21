import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { ListIasResponse } from "../../@types/apis";
import { useNavigation } from "@react-navigation/native";
import { DetailsIaNavigationProp } from "../../@types";
import Fundo from "../../Componentes/imagens/Fundo";
import Logo from "../../Componentes/imagens/Logo";
import { obterIas } from "../../Services/Ias";
import styles from "./styles";
import { useAuth } from "../../Context/AuthContext";
import { CheckCircle, Cloud, Info, RefreshCcw, XCircle } from "lucide-react-native";

import { Image } from "react-native";

export default function Search() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ias, setIas] = useState<ListIasResponse[]>([]);
  const navigationDetailsIA = useNavigation<DetailsIaNavigationProp>();

  const { user } = useAuth();

  useEffect(() => {
    const fetchIas = async () => {
      try {
        if (user?.uid) {
          const result = await obterIas(user.uid);

          const iasCompletas: ListIasResponse[] = result.map((ia) => ({
            uid: ia.uid,
            nomeIa: ia.nomeIa ?? "",
            descricao: ia.descricao ?? "",
            consumoAtual: ia.consumoAtual ?? "0",
            dataCriacao: ia.dataCriacao ?? new Date().toISOString(),
            status: ia.status ?? "ativo",
            analiseDesperdicio: ia.analiseDesperdicio ?? [],
            recomendacao: ia.recomendacao ?? [],
          }));

          setIas(iasCompletas);
        }
      } catch (error) {
        console.error("Erro ao carregar IAs:", error);
        setError("Erro ao carregar IAs");
      } finally {
        setLoading(false);
      }
    };

    fetchIas();
  }, [user?.uid]);

  const viewDetailsIa = (ia: ListIasResponse) => {
    navigationDetailsIA.navigate("DetailsIa", { ia });
  };

  const StatusIndicator = ({ status }) => {
    let color;
    let icon;

    switch (status) {
      case "Em Análise":
        color = "pink";
        icon = <Cloud color={color} />;
        break;
      case "Aplicando Recomendações":
        color = "yellow";
        icon = <RefreshCcw color={color} />;
        break;
      case "Monitorando":
        color = "green";
        icon = <CheckCircle color={color} />;
        break;
      case "Aguardando Dados":
        color = "gray";
        icon = <Info color={color} />;

      default:
        color = "gray";
        icon = <XCircle color={color} />;
    }

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon}
        <Text style={{ color, marginLeft: 8 }}>{status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.clientListContainer}>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>IAs Cadastradas</Text>

 
  </View>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          <FlatList
            data={ias}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({ item: ia }) => (
              <TouchableOpacity onPress={() => viewDetailsIa(ia)}>
                <View style={styles.clientCard}>
                  <Text style={styles.clientName}>{ia.nomeIa}</Text>
                  <Text style={styles.clientDetails}>
                    <StatusIndicator status={ia.status} />
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.uid}
          />
        )}
      </View>
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </View>
  );
}
