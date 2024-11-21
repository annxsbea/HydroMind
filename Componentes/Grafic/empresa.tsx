// DashboardGlobal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCompanyData } from '../../Services/Empresa';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../Context/AuthContext';

const DashboardGlobal: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Global</Text>
      {loading ? (
        <Text style={styles.info}>Carregando dados das IAS...</Text>
      ) : user ? (
        <>
          <Text style={styles.companyTitle}>Informações da Economia de Ia</Text>
          <Text style={styles.info}>Meta de Vendas: {user.Total_economizado}</Text>
          <Text style={styles.info}>Quantidade de Vendas: {user.Total_economizado 
          }</Text>
        </>
      ) : (
        <Text style={styles.info}>Dados da empresa não disponíveis</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2d3436',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  companyTitle: {
    fontSize: 20,
    color: '#00b894',
    marginTop: 20,
  },
  info: {
    fontSize: 16,
    color: '#b2bec3',
    marginVertical: 5,
  },
});

export default DashboardGlobal;
