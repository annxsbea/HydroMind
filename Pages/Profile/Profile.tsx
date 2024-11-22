import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dialog, Portal } from "react-native-paper";
import { useAuth } from "../../Context/AuthContext";
import styles from "./styles";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { criarIa } from "../../Services/Ias";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Person from "../../Componentes/imagens/Person";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { FolderOpen } from "lucide-react-native";
import { FAB } from "react-native-paper";

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateProfilePicture, signOut, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [iaName, setIaName] = useState("");
  const [iaDescription, setIaDescription] = useState("");
  const [iaConsumption, setIaConsumption] = useState("");
  const [fileUri, setFileUri] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [visibleIaDialog, setVisibleIaDialog] = useState(false);
  const [visibleImageDialog, setVisibleImageDialog] = useState(false);
  const [visibleEditDialog, setVisibleEditDialog] = useState(false);
  const [error, setError] = useState<string>("");
  const [editedRazaoSocial, setEditedRazaoSocial] = useState(user?.razao_social || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");
  const [editCnpj, setEditCnpj] = useState(user?.cnpj || "");
  const [menuVisible, setMenuVisible] = useState(false);


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
  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateProfile(editedRazaoSocial, editedEmail, editCnpj); 
      setSuccessMessage("Perfil atualizado com sucesso!");
      setVisibleEditDialog(false);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
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
        fileUrl, // Pode ser nulo
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
  
  const pickImage = async (source: "gallery" | "camera") => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Você precisa permitir o acesso à galeria!");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }
  const handlePress = () => {
    // Ação ao pressionar o FAB
    console.log("FAB pressionado!");
  };
    if (!result.canceled) {
      updateProfilePicture(result.assets[0].uri);
      setSuccessMessage("Imagem de perfil atualizada com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    setVisibleImageDialog(false);
  };

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00FF00" />
        </View>
      )}

      <View style={styles.profileContainer}>
        <View style={styles.profileRow}>
          <TouchableOpacity
            onPress={() => setVisibleImageDialog(true)}
            style={styles.personIconContainer}
          >
            {user?.profilePictureUrl ? (
              <Image
                source={{ uri: user.profilePictureUrl }}
                style={styles.profileImage}
              />
            ) : (
              <Person />
            )}
            <View style={styles.editIconContainer}>
              <FontAwesome5 name="pen" size={15} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfoContainer}>
            <Text style={styles.nameText}>{user?.razao_social}</Text>
            <Text style={styles.cpfText}>CNPJ: {user?.cnpj}</Text>
            <Text style={styles.setorText}>{user?.email}</Text>
          </View>
        </View>

       
      </View>

     
  <FAB.Group
  visible={true} 
  open={menuVisible} 
  icon={menuVisible ? "close" : "plus"} 
  actions={[
    {
      icon: "account-edit",
      label: "Editar Perfil",
      onPress: () => setVisibleEditDialog(true),
    },
    {
      icon: "brain",
      label: "Criar IA",
      onPress: () => setVisibleIaDialog(true), 
    },
    {
      icon: "logout",
      label: "Sair",
      onPress: signOut, 
    },
  ]}
  onStateChange={({ open }) => setMenuVisible(open)} 
  onPress={() => {
    if (!menuVisible) {
    }
  }}
  style={{
    position: "absolute", 
    right: 16, 
    bottom: -300, 
    zIndex: 10, 
  }}
/>


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
                <FolderOpen color="#fff" style={{ marginRight: 10 }} />
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
      <View style={styles.container}>
        {successMessage ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>
      <Portal>
        <Dialog
          visible={visibleEditDialog}
          onDismiss={() => setVisibleEditDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Editar Perfil</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#9E9E9E"
              value={editedRazaoSocial}
              onChangeText={setEditedRazaoSocial}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9E9E9E"
              value={editedEmail}
              onChangeText={setEditedEmail}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleUpdateProfile} color="#fff">
              Atualizar
            </Button>
            <Button onPress={() => setVisibleEditDialog(false)} color="#fff">
              Cancelar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={visibleImageDialog}
          onDismiss={() => setVisibleImageDialog(false)}
        >
          <Dialog.Title>Selecionar Imagem</Dialog.Title>
          <Dialog.Content>
            <Text>Escolha uma opção para adicionar sua imagem de perfil:</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => pickImage("camera")}>Câmera</Button>
            <Button onPress={() => pickImage("gallery")}>Galeria</Button>
            <Button onPress={() => setVisibleImageDialog(false)}>
              Cancelar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};
