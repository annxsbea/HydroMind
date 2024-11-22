import React, { useState } from "react";
import { View, Alert } from "react-native";
import { 
  Dialog, 
  Portal, 
  Button, 
  ActivityIndicator, 
  TextInput 
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "../../Pages/Profile/styles";
import { criarIa } from "../../Services/Ias";
import { useAuth } from "../../Context/AuthContext";

interface CreateIaDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

const CreateIaDialog: React.FC<CreateIaDialogProps> = ({ visible, onDismiss }) => {
  const { user } = useAuth();
  const [iaName, setIaName] = useState("");
  const [iaDescription, setIaDescription] = useState("");
  const [iaConsumption, setIaConsumption] = useState("");
  const [fileUri, setFileUri] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
      setFileUri(result.assets[0].uri);
    }
  };

  const handleCreateIa = async () => {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado");
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
        Alert.alert("Erro", "Consumo atual inválido");
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
      Alert.alert("Sucesso", `IA criada com ID: ${iaId}`);
      onDismiss();
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar IA. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (storage: any, user: any, iaName: string, fileUri: string) => {
    const fileRef = ref(storage, `ias/${user.uid}/${iaName}.jpg`);
    const response = await fetch(fileUri);
    const blob = await response.blob();
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Nova IA</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nome da IA"
            mode="outlined"
            value={iaName}
            style={{backgroundColor:"#fff"}}
            onChangeText={setIaName}
          />
          <TextInput
            label="Descrição"
            mode="outlined"
            value={iaDescription}
            onChangeText={setIaDescription}
            style={{backgroundColor:"#fff"}}

          />
          <TextInput
            label="Consumo Atual (em kWh)"
            mode="outlined"
            value={iaConsumption}
            style={{backgroundColor:"#fff"}}

            onChangeText={setIaConsumption}
            keyboardType="numeric"
          />
          <View style={{ marginVertical: 20 }}>
            <Button mode="contained" onPress={escolherArquivo} style={{backgroundColor: "#3C5A65"}}>
              Anexar Arquivo
            </Button>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <Button onPress={handleCreateIa} mode="contained" style={{backgroundColor: "#3C5A65"}}>
                Criar
              </Button>
              <Button onPress={onDismiss} textColor="#3C5A65">Cancelar</Button>
            </>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CreateIaDialog;
