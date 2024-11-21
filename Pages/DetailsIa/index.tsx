import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { DetailsIaRouteProp, RootStackParamList } from "../../@types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Cloud, RefreshCcw, CheckCircle, XCircle, Info } from "lucide-react-native";
import { styles } from "./styles";
import { useAuth } from "../../Context/AuthContext";
import { updateIaStatus, fetchRecomendacoes } from "../../Services/Ias";
import { Button, Modal, Provider } from "react-native-paper";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import {ptBR} from "date-fns/locale/pt-BR";

type Props = {
  route: DetailsIaRouteProp;
};

export default function DetailsIa({ route }: Props) {
  const { ia } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(ia.status || "Aberto");
  const [clientState, setClientState] = useState(ia);
  const [selectedScript, setSelectedScript] = useState("");
  const [modalVisibleScript, setModalVisibleScript] = useState(false);
  const [recomendacoes, setRecomendacoes] = useState([]);

  useEffect(() => {
    async function loadRecomendacoes() {
      const fetchedRecomendacoes = await fetchRecomendacoes(ia.uid);
      console.log(fetchedRecomendacoes); 
      setRecomendacoes(fetchedRecomendacoes || []);
    }
    loadRecomendacoes();
  }, [ia.uid]);

  const openScriptModal = (scriptDescricao: string) => {
    setSelectedScript(scriptDescricao);
    setModalVisibleScript(true);
  };

  const handleImplementRecommendation = async (scriptDescricao: string) => {
    try {
      setClientState((prevState) => ({
        ...prevState,
        status: "Aplicando Recomendações",
      }));
      await updateIaStatus(ia.uid, "Aplicando Recomendações");
      console.log(`Recomendação "${scriptDescricao}" implementada com sucesso.`);
    } catch (error) {
      console.error("Erro ao implementar recomendação:", error);
    }
  };

  const formattedDate =
    ia.dataCriacao instanceof Timestamp
      ? format(ia.dataCriacao.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      : ia.dataCriacao;

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color="#fff" size={35} />
          </TouchableOpacity>
        </View>

        {/* Informações do Cliente */}
        <View style={styles.clientInfoContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={styles.clientDetailText}>IA:</Text>
              <Text style={styles.clientName}>{ia.nomeIa}</Text>
            </View>
            <View>
              <Text style={styles.clientDetailText}>Estado de Análise:</Text>
              <StatusIndicator status={clientState.status ?? "Não disponível"} />
            </View>
          </View>
        </View>

        {/* Detalhes da IA */}
        <View style={styles.clientDetailCard}>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Text style={styles.clientDetailText}>Descrição:</Text>
            <Text style={styles.clientDetailValue}>{ia.descricao}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Text style={styles.clientDetailText}>Consumo Atual:</Text>
            <Text style={styles.clientDetailValue}>{ia.consumoAtual}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Text style={styles.clientDetailText}>Data de Criação:</Text>
            <Text style={styles.clientDetailValue}>{formattedDate}</Text>
          </View>
        </View>

        {/* Recomendações */}
        <View style={styles.scriptContainer}>
          <FlatList
            data={recomendacoes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginTop: 10, alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => openScriptModal(item.descricao)}
                  style={styles.scriptCard}
                >
                  <Text style={styles.scriptTitle}>Recomendação</Text>
                  <Text>{item.descricao}</Text>
                  <Button onPress={() => handleImplementRecommendation(item.descricao)} mode="contained">
                    Implementar
                  </Button>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noDataText}>
                <Info color="gray" size={20} /> Sem recomendações disponíveis.
              </Text>
            }
          />
        </View>
      </View>

      {/* Modal de Recomendação */}
      <Modal visible={modalVisibleScript} onDismiss={() => setModalVisibleScript(false)}>
        <View style={styles.modalContent}>
          <Text>{selectedScript}</Text>
          <Button onPress={() => setModalVisibleScript(false)}>Fechar</Button>
        </View>
      </Modal>
    </Provider>
  );
}

const StatusIndicator = ({ status }: { status: string }) => {
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
      break;
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
