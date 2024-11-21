// src/screens/Home.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  logoContainer: {
    backgroundColor: '#0000',
    marginTop: 80,
    alignItems: 'center',
    marginLeft: 30,
  },
  welcomeContainer: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 30,
    
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
  },
  graficContainer: {
    marginTop: 50,
  },
  graficPadding: {
    marginTop: 50,
    padding: 50,
  },
  dashboardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#2E4F4F",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: "30%", // Divide o espaço em três partes iguais
  },
  cardTitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  progressBar: {
    marginTop: 10,
    height: 4,
    width: "100%",
    backgroundColor: "#1E1E1E",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00C2CB",
    borderRadius: 2,
  },
});
