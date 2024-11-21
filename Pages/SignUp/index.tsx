import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import {
  Card,
  TextInput,
  Snackbar,
  Portal,
  Dialog,
  Button,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { SignInScreenProp } from "../../@types";
import { cnpjValidator, formatCNPJ } from "../../lib";
import Logo from "../../Componentes/imagens/Logo";
import { LinearGradient } from "expo-linear-gradient";
import Fundo from "../../Componentes/imagens/Fundo";
import styles from "./styles";
import { useAuth } from "../../Context/AuthContext";
import * as ImagePicker from "expo-image-picker";

export default function SignUpScreen({ setUserLogged }) {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [razao_social, setRazao_social] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigationSingin = useNavigation<SignInScreenProp>();
  const { createAccount } = useAuth();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const showDialog = () => setVisibleDialog(true);



  const hideDialog = () => setVisibleDialog(false);const selectProfileImage = async (source: "camera" | "gallery") => {
    let result;
    const imageOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1] as [number, number], 
      maxWidth: 1000,
      maxHeight: 1000,
    };
  
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync(imageOptions);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(imageOptions);
    }
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      const fileSize = result.assets[0].fileSize || 0;
  
      if (fileSize > 5 * 1024 * 1024) { 
        Alert.alert("Erro", "A imagem selecionada é muito grande. Por favor, escolha uma imagem menor.");
        return;
      }
      setProfileImage(uri);
    }
    hideDialog();
  };
  const cadastrarUsuario = async () => {
    if (!email || !cnpj || !razao_social || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      await createAccount(email, senha, razao_social, cnpj);
      setError("Usuário cadastrado com sucesso!");
    } catch (error) {
        if (error.response && error.response.data) {
            setError(error.response.data.message || "Erro ao cadastrar usuário. Tente novamente mais tarde.");
        } else {
            setError("Erro ao cadastrar usuário. Tente novamente mais tarde.");
        }
    } finally {
        setLoading(false);
    }
};
const requestPermission = async (type: 'camera' | 'gallery') => {
  try {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à câmera para esta funcionalidade."
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à galeria para esta funcionalidade."
        );
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

  const Logar = () => {
    navigationSingin.navigate("SignIn");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backgroundImage}>
        <Fundo />
      </View>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
       
        <View style={styles.contentContainer}>
          <Text style={styles.cardTitle}>Criar Conta</Text>
          <Text style={styles.welcomeText}>Seja Bem-vindo!</Text>
          <View style={styles.profileImageContainer}>
            <Pressable
              onPress={showDialog}
              accessible={true}
              accessibilityLabel="Selecionar imagem de perfil"
              accessibilityHint="Toque para escolher uma foto da câmera ou galeria">

              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  accessibilityLabel="Imagem de perfil selecionada"
                  onLoadStart={() => setLoading(true)}
                  onLoadEnd={() => setLoading(false)} />
              ) : (
                <Text style={styles.profileImagePlaceholder}>Imagem De Perfil</Text>
              )}
            </Pressable>
          </View>
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
              placeholderTextColor="#ffffff"
              textColor="#fff"
              mode="outlined"
              outlineColor="#27434B"
            />
            <TextInput
              label="CNPJ"
              value={cnpj}
              onChangeText={(text) => {
                const formattedText = formatCNPJ(text); 
                setCnpj(formattedText); 
              }}
              style={styles.textInput}
              placeholderTextColor="#ffffff"
              textColor="#fff"
              mode="outlined"
              outlineColor="#27434B"
            />
            <TextInput
              label="Nome"
              value={razao_social}
              onChangeText={setRazao_social}
              style={styles.textInput}
              placeholderTextColor="#ffffff"
              textColor="#fff"
              mode="outlined"
              outlineColor="#27434B"
            />

            <TextInput
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              style={styles.textInput}
              placeholderTextColor="#ffffff"
              textColor="#fff"
              mode="outlined"
              outlineColor="#27434B"
            />
          </Card.Content>

          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={["#3C6558", "#182A2F"]}
              style={styles.gradientButton1}
            >
              <Pressable style={styles.pressable} onPress={cadastrarUsuario}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </Pressable>
            </LinearGradient>
          </View>

          <Text style={styles.signInText}>
            Já tem conta?{" "}
            <Text onPress={Logar} style={styles.signInLink}>
              Entrar
            </Text>
          </Text>
        </View>
        <Snackbar visible={!!error} onDismiss={() => setError("")}>
          {error}
        </Snackbar>
        {loading && <ActivityIndicator size="large" />}
      </SafeAreaView>
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
          <Dialog.Title>Selecionar Imagem</Dialog.Title>
          <Dialog.Content>
            <Text>Escolha uma opção para adicionar sua imagem de perfil:</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={async () => {
                if (await requestPermission('camera')) {
                  setLoading(true);
                  await selectProfileImage("camera");
                  setLoading(false);
                }
              }}
              loading={loading}>
              Câmera
            </Button>
            <Button
              onPress={async () => {
                if (await requestPermission('gallery')) {
                  setLoading(true);
                  await selectProfileImage("gallery");
                  setLoading(false);
                }
              }}
              loading={loading}>
              Galeria
            </Button>
            <Button onPress={hideDialog}>Cancelar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal >
    </ScrollView>
  );
}
