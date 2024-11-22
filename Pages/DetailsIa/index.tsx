import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  GestureResponderEvent,
} from "react-native";
import {
  DetailsIaRouteProp,
  ListIasResponse,
  RootStackParamList,
} from "../../@types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Cloud,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react-native";
import { styles } from "./styles";
import { useAuth } from "../../Context/AuthContext";
import {
  updateIaStatus,
  fetchRecomendacoes,
  editarIa,
  excluirIa,
  obterIas,
  criarRecomendacao,
  ouvirRecomendacoes,
  ouvirAnalisesDesperdicio,
} from "../../Services/Ias";
import { Button, Divider, Menu, Provider, TextInput } from "react-native-paper";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Modal } from "react-native";
import { database } from "../../firebaseConfig";
import { FAB } from "react-native-paper";
import { Dialog, Portal } from "react-native-paper";

type Props = {
  route: DetailsIaRouteProp;
};

export default function DetailsIa({ route }: Props) {
  const { ia } = route.params;
  const { user } = useAuth();
  const [ias, setIas] = useState<ListIasResponse[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    nomeIa: ia.nomeIa,
    descricao: ia.descricao,
    consumoAtual: ia.consumoAtual,
    status: ia.status,
  });
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(ia.status || "Aberto");
  const [clientState, setClientState] = useState(ia);
  const [selectedScript, setSelectedScript] = useState("");
  const [modalVisibleScript, setModalVisibleScript] = useState(false);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [analiseDesperdicio, setAnaliseDesperdicio] = useState([]);
  useEffect(() => {
    if (!user || !ia) return;

    const unsubscribe = ouvirRecomendacoes(user.uid, ia.uid, (dados) => {
      setRecomendacoes(dados);
    });
    return () => unsubscribe();
  }, [user, ia]);

  useEffect(() => {
    if (!user || !ia) return;
    const unsubscribe = ouvirAnalisesDesperdicio(user.uid, ia.uid, (dados) => {
      setAnaliseDesperdicio(dados);
    });

    return () => unsubscribe();
  }, [user, ia]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      collection(database, `usuario/${user.uid}/ias`),
      (snapshot) => {
        const updatedIas: ListIasResponse[] = snapshot.docs.map((doc) => ({
          uid: doc.id,
          nomeIa: doc.data().nomeIa,
          descricao: doc.data().descricao,
          consumoAtual: doc.data().consumoAtual,
          status: doc.data().status,
          dataCriacao: doc.data().dataCriacao?.toDate() || new Date(),
          fileUrl: doc.data().fileUrl,
        }));
        setIas(updatedIas);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return <Text>Carregando...</Text>;
  }

  const openScriptModal = (scriptDescricao: string) => {
    setSelectedScript(scriptDescricao);
    setModalVisibleScript(true);
  };
  const handleDelete = async (ia: any) => {
    try {
      if (!user?.uid) {
        alert("Usuário não autenticado.");
        return;
      }

      await excluirIa(user.uid, ia.uid);
      alert("IA excluída com sucesso!");
      navigation.goBack();
    } catch (error) {
      alert("Erro ao excluir IA: " + error.message);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await editarIa(user.uid, ia.uid, editData);
      Alert.alert("Sucesso", "IA editada com sucesso!");
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao editar a IA:", error);
    }
  };

  const handleImplementRecommendation = async (scriptDescricao: string) => {
    try {
      if (!ia.uid) {
        throw new Error("ID da IA não encontrado.");
      }

      setClientState((prevState) => ({
        ...prevState,
        status: "Aplicando Recomendações",
      }));

      await updateIaStatus(ia.uid, "Aplicando Recomendações");

      console.log(
        `Recomendação "${scriptDescricao}" implementada com sucesso.`
      );
    } catch (error) {
      console.error("Erro ao implementar recomendação:", error);
      if (error instanceof Error) {
        console.error("Detalhes do erro:", error.message);
      }
      alert("Houve um erro ao implementar a recomendação. Tente novamente.");
    }
  };

  const formattedDate =
    ia.dataCriacao instanceof Timestamp
      ? format(ia.dataCriacao.toDate(), "dd 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        })
      : ia.dataCriacao;

  const onPressDelete = (event: GestureResponderEvent) => {
    handleDelete(ia);
  };
  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft color="#fff" size={35} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {/* Informações do Cliente */}
          <View style={styles.clientInfoContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={styles.clientDetailText}>IA:</Text>
                <Text style={styles.clientName}>{ia.nomeIa}</Text>
              </View>
              <View>
                <Text style={styles.clientDetailText}>Estado de Análise:</Text>
                <StatusIndicator
                  status={clientState.status ?? "Não disponível"}
                />
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
          {/* Análises de Desperdício */}
          <Text style={styles.clientDetailText2}>Análises de Desperdício:</Text>

          {analiseDesperdicio.length > 0 ? (
            analiseDesperdicio.map((analise) => (
              <View key={analise.id} style={styles.card}>
                <Text style={styles.recommendationText2}>
                  Descrição: 
                </Text>
                <Text style={styles.analysisText}>
                 {analise.descricao}
                </Text>
                <Text style={styles.recommendationText2}>
                  Data da Análise:{" "}
                </Text>
                <Text style={styles.analysisText}>
                  {analise.dataAnalise?.toDate?.().toLocaleString() || "N/A"}
                </Text>
                <Text style={styles.recommendationText2}>
                  Desperdício Calculado:
                </Text>
                <Text style={styles.analysisText}>
                 {analise.desperdicioCalculado}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>
              Não há análises de desperdício disponíveis.
            </Text>
          )}

          <Text style={styles.clientDetailText2}>Recomendações:</Text>

          {recomendacoes.length > 0 ? (
            recomendacoes.map((rec) => (
              <View key={rec.id} style={styles.card}>
                <Text style={styles.recommendationText2}>
                  Descrição:
                </Text>
                <Text style={styles.recommendationText}>
                   {rec.descricao}
                </Text>
                <Text style={styles.recommendationText2}>
                  Data:{" "}
                </Text>
                <Text style={styles.recommendationText}>
                 
                  {rec.dataRecomendacao?.toDate?.().toLocaleString() || "N/A"}
                </Text>
                <Text style={styles.recommendationText2}>
                   Implementado: 
                </Text>
                <Text style={styles.recommendationText}>
                 {rec.implementada ? "Sim" : "Não"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>
              Não há recomendações disponíveis.
            </Text>
          )}
        </ScrollView>
        <FAB.Group
          visible={true}
          open={menuVisible}
          icon={menuVisible ? "close" : "plus"}
          actions={[
            {
              icon: "pencil",
              label: "Editar IA",
              onPress: () => setModalVisible(true),
            },
            {
              icon: "delete",
              label: "Excluir IA",
              onPress: onPressDelete,
            },
            {
              icon: "check",
              label: "Implementar",
              onPress: () => handleImplementRecommendation(selectedScript),
            },
          ]}
          onStateChange={({ open }) => setMenuVisible(open)}
        />
        <Portal>
          <Dialog
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            style={{ backgroundColor: "white" }}
          >
            <Dialog.Title>Editar IA</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Nome da IA"
                value={editData.nomeIa}
                mode="outlined"
                style={{ marginBottom: 16 }}
                onChangeText={(text) =>
                  setEditData({ ...editData, nomeIa: text })
                }
              />
              <TextInput
                label="Descrição"
                value={editData.descricao}
                mode="outlined"
                style={{ marginBottom: 16 }}
                onChangeText={(text) =>
                  setEditData({ ...editData, descricao: text })
                }
              />
              <TextInput
                label="Consumo Atual"
                value={editData.consumoAtual}
                mode="outlined"
                style={{ marginBottom: 16 }}
                onChangeText={(text) =>
                  setEditData({ ...editData, consumoAtual: text })
                }
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleSaveEdit}>Salvar</Button>
              <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
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
