import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Button, FAB, Snackbar, TextInput } from "react-native-paper";
import { ListIasResponse } from "../../@types/apis";
import { useNavigation } from "@react-navigation/native";
import { DetailsIaNavigationProp } from "../../@types";
import Fundo from "../../Componentes/imagens/Fundo";
import Logo from "../../Componentes/imagens/Logo";
import { criarIa, obterIas, editarIa } from "../../Services/Ias";
import styles from "./styles";
import { useAuth } from "../../Context/AuthContext";
import {
  CheckCircle,
  Cloud,
  FolderOpen,
  Info,
  RefreshCcw,
  XCircle,
} from "lucide-react-native";
import { Dialog, Portal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import { Image } from "react-native";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export default function Search() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ias, setIas] = useState<ListIasResponse[]>([]);
  const navigationDetailsIA = useNavigation<DetailsIaNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [visibleIaDialog, setVisibleIaDialog] = useState(false);
  const [iaName, setIaName] = useState("");
  const [iaDescription, setIaDescription] = useState("");
  const [iaConsumption, setIaConsumption] = useState("");
  const [fileUri, setFileUri] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { user } = useAuth();
  const escolherArquivo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar sua galeria."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const fileUrl = result.assets[0].uri;
      setFileUri(fileUrl);
      console.log("Arquivo selecionado:", fileUrl);
    }
  };
  const uploadFile = async (storage, user, iaName, fileUri) => {
    try {
      console.log("Iniciando upload...");
      const fileRef = ref(storage, `ias/${user.uid}/${iaName}.jpg`);
      console.log("Referencia criada:", fileRef);

      const response = await fetch(fileUri);
      const blob = await response.blob();
      console.log("Blob criado:", blob);

      await uploadBytes(fileRef, blob);
      const fileUrl = await getDownloadURL(fileRef);
      console.log("Upload concluído. URL:", fileUrl);

      return fileUrl;
    } catch (error) {
      console.error("Erro no upload:", error);
      throw error;
    }
  };

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
  const handleCreateIa = async () => {
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    setLoading(true);
    try {
      let fileUrl = null;
      if (fileUri) {
        const storage = getStorage();
        fileUrl = await uploadFile(storage, user, iaName, fileUri);
      }

      const consumoAtualNumber = parseFloat(iaConsumption);
      if (isNaN(consumoAtualNumber)) {
        console.error("Consumo atual inválido");
        setLoading(false);
        return;
      }

      const iaData = {
        nomeIa: iaName,
        descricao: iaDescription,
        consumoAtual: consumoAtualNumber,
        status: "ativo",
        fileUrl,
      };

      const iaId = await criarIa(user.uid, iaData);
      console.log("Nova IA criada com ID:", iaId);

      setSuccessMessage("IA criada com sucesso!");
      Alert.alert("Sucesso", `IA criada com ID: ${iaId}`);
      setVisibleIaDialog(false);
    } catch (error) {
      console.error("Erro ao criar IA:", error);
      setSuccessMessage("Erro ao criar IA. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
      <FAB.Group
        visible={true}
        open={menuVisible}
        icon={menuVisible ? "close" : "plus"}
        actions={[
          {
            icon: "brain",
            label: "Criar IA",
            onPress: () => setVisibleIaDialog(true),
          },
        ]}
        onStateChange={({ open }) => {
          setMenuVisible(open);
          console.log("Menu visível: ", open);
        }}
        onPress={() => {
          if (!menuVisible) {
          }
        }}
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          zIndex: 10,
        }}
      />
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>

      <Portal>
        <Dialog
          visible={visibleIaDialog}
          onDismiss={() => setVisibleIaDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Nova IA</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={styles.input}
              placeholder="Nome da IA"
              placeholderTextColor="#9E9E9E"
              value={iaName}
              onChangeText={setIaName}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              placeholderTextColor="#9E9E9E"
              value={iaDescription}
              onChangeText={setIaDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Consumo Atual (em kWh)"
              placeholderTextColor="#9E9E9E"
              value={iaConsumption}
              onChangeText={setIaConsumption}
              keyboardType="numeric"
            />
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: "#fff", marginBottom: 10 }}>
                Anexar arquivo com dados de consumo:
              </Text>
              <Button
                mode="contained"
                onPress={escolherArquivo}
                contentStyle={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#1B2736",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  Escolher Arquivo
                </Text>
              </Button>
            </View>
            <Button
              mode="contained"
              onPress={handleCreateIa}
              style={styles.createButton}
            >
              Criar IA
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleIaDialog(false)} color="#fff">
              Cancelar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
