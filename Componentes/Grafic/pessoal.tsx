import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { useAuth } from '../../Context/AuthContext';

const SalesGoal: React.FC = () => {
  const { user } = useAuth();

  // Valores seguros
  const totalEconomizado = user?.Total_economizado || 0;
  const metaEconomia = user?.meta_economia || 1; 
  const progress = Math.min(1, Math.max(0, totalEconomizado / metaEconomia));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meta de Economia Ia</Text>
      <Progress.Circle
        size={Dimensions.get('window').width * 0.5}
        progress={progress}
        showsText={true}
        formatText={() => `${Math.round(progress * 100) || 0}%`}
        color="#178064"
        unfilledColor="#0F252C"
        borderWidth={0}
        thickness={20}
        textStyle={styles.percentage}
      />
      <Text style={styles.label}>Total Economizado: {totalEconomizado} /Litros</Text>
      <Text style={styles.label}>Metas de Economia: {metaEconomia}/Litros</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
    marginTop: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    color: '#b2bec3',
    fontSize: 16,
    marginTop: 10,
  },
  percentage: {
    fontSize: 18,
    color: '#fff',
  },
});

export default SalesGoal;
