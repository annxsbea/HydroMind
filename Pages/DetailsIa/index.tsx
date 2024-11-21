import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert } from "react-native";
import { DetailsIaRouteProp, RootStackParamList } from "../../@types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Cloud, RefreshCcw, CheckCircle, XCircle, Info } from "lucide-react-native";
import { styles } from "./styles";
import { useAuth } from "../../Context/AuthContext";
import { updateIaStatus, fetchRecomendacoes, editarIa, excluirIa } from "../../Services/Ias";
import { Button, Provider, TextInput } from "react-native-paper";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import {ptBR} from "date-fns/locale/pt-BR";
import { Modal } from 'react-native';

type Props = {
  route: DetailsIaRouteProp;
};

export default function DetailsIa({ route }: Props) {
  const { ia } = route.params;
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
  const handleDelete = async () => {
    Alert.alert(
      "Confirmação",
      "Você tem certeza que deseja excluir essa IA?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await excluirIa(ia.uid); // Passe apenas `ia.uid`
              navigation.goBack(); // Volta para a tela anterior após exclusão
            } catch (error) {
              console.error("Erro ao excluir a IA:", error);
            }
          },
        },
      ]
    );
  };
  const handleSaveEdit = async () => {
    try {
      await editarIa(ia.uid, editData);
      Alert.alert("Sucesso", "IA editada com sucesso!");
      setModalVisible(false); // Fecha o modal após salvar
    } catch (error) {
      console.error("Erro ao editar a IA:", error);
    }
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

        {/* Botões de Edição e Exclusão */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
          <Text style={styles.buttonText}>Editar IA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Excluir IA</Text>
        </TouchableOpacity>
      </View>

   
      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar IA</Text>
            
            {/* Campos de Edição */}
            <TextInput
              style={styles.input}
              placeholder="Nome da IA"
              value={editData.nomeIa}
              onChangeText={(text) => setEditData({ ...editData, nomeIa: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={editData.descricao}
              onChangeText={(text) => setEditData({ ...editData, descricao: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Consumo Atual"
              value={editData.consumoAtual}
              onChangeText={(text) => setEditData({ ...editData, consumoAtual: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Status"
              value={editData.status}
              onChangeText={(text) => setEditData({ ...editData, status: text })}
            />

            {/* Botões do Modal */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={handleSaveEdit} style={styles.saveButton}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
