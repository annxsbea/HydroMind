import React, { useState } from "react";
import {
  Card,
  TextInput,
  Snackbar,
  ActivityIndicator,
} from "react-native-paper";
import { Pressable, View, Text, ScrollView, Alert, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import Logo from "../../Componentes/imagens/Logo";
import Fundo from "../../Componentes/imagens/Fundo";
import { useAuth } from "../../Context/AuthContext";
import { SignInScreenProp } from "../../@types";
import * as Notifications from "expo-notifications"; 

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user} = useAuth();
  const navigationSignUp = useNavigation<SignInScreenProp>();
  const [isFocused, setIsFocused] = useState(false); 

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Você precisa permitir notificações para receber mensagens.'
        );
        return false; 
      }
    }
    return true; 
  };
  const logar = async () => {
    if (!email || !senha) {
      setError("Por favor, insira o email e a senha.");
      return;
    }

    try {
      setLoading(true);
      const hasPermission = await requestNotificationPermission(); 

      if (hasPermission) {
        await signIn(email, senha);
      }
    } catch (error) {
        if (error.response) {
            const message = error.response.data.message || 'Erro ao fazer login. Tente novamente mais tarde.';
            setError(message);
            console.error("API Response Error:", message);
        } else {
            setError('Erro ao fazer login. Verifique sua conexão ou credenciais.');
            console.error("Network or Unexpected Error:", error);
        }
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = () => {
    navigationSignUp.navigate("SignUp");
  };

  return  (
    <ScrollView style={styles.container}>
      <Fundo />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.cardTitle}>Login</Text>
          <Text style={styles.welcomeText}>Glad you're back!</Text>

          <Card.Content style={styles.cardContent}>
            <TextInput
              label="Username"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.textInput}
              placeholderTextColor="#ffffff"
              textColor="#fff"
              mode="outlined"
              outlineColor="#27434B"
            />
             <TextInput
      label="Password"
      value={senha}
      onChangeText={(text) => setSenha(text)}
      secureTextEntry={true}
      style={styles.textInput}
      textColor="#fff"
      mode="outlined"
      outlineColor={isFocused ? '#27434B' : '#27434B'}
      onFocus={() => setIsFocused(true)} 
      onBlur={() => setIsFocused(false)} 
    />
          </Card.Content>

          <View style={styles.buttonContainer}>
            <LinearGradient colors={["#3C6558", "#182A2F"]} style={styles.gradientButton1}>
              <Pressable style={styles.pressable} onPress={logar}>
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>
            </LinearGradient>
          </View>

          <Text style={styles.signUpText}>
            Não possui conta?{" "}
            <Text onPress={handleSignUp} style={styles.signUpLink}>
              Criar conta
            </Text>
          </Text>
        </ScrollView>
        
        <Snackbar
          visible={!!error}
          onDismiss={() => setError("")}
          duration={3000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}