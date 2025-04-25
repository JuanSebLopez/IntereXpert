import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/AppNavigator';
import { useAuth } from '../services/AuthContext';

type DashboardNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Dashboard'>;

interface CalculatorOption {
  title: string;
  description: string;
  screen: keyof MainTabParamList;
  color: string;
}

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user, logout, isBiometricAvailable, enableBiometrics, checkBiometricAvailability } = useAuth();
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      const available = await checkBiometricAvailability();
      setBiometricsAvailable(available);
    };
    
    checkBiometrics();
  }, []);

  const handleEnableBiometrics = async () => {
    if (!user) return;
    
    try {
      const success = await enableBiometrics(user.username);
      if (success) {
        Alert.alert('Éxito', 'Autenticación biométrica habilitada correctamente');
      } else {
        Alert.alert('Error', 'No se pudo habilitar la autenticación biométrica');
      }
    } catch (error) {
      console.error('Error al habilitar biometría:', error);
      Alert.alert('Error', 'Ocurrió un error al habilitar la biometría');
    }
  };

  const calculatorOptions: CalculatorOption[] = [
    {
      title: "Interés Simple",
      description: "Calcula el interés sobre un capital fijo",
      screen: "SimpleInterest",
      color: "#4527A0",
    },
    {
      title: "Interés Compuesto",
      description: "Calcula el interés que se suma al capital",
      screen: "CompoundRateInterest",
      color: "#7B1FA2",
    },
    {
      title: "Anualidades",
      description: "Calcula pagos o recibos periódicos",
      screen: "Annuity",
      color: "#3F51B5",
    },
    {
      title: "Cálculo de Gradiente",
      description: "Encuentra la gradiente de una serie de pagos",
      screen: "GradientScreen",
      color: "#9C27B0",
    },
    {
      title: "Cálculo de Amortización",
      description: "Encuentra la amortización de un préstamo",
      screen: "AmortizationScreen",
      color: "#9C27B0",
    },
    {
      title: "Capitalizaciones",
      description: "Simple, compuesta, continua y más",
      screen: "AdvancedCalculations",
      color: "#673AB7",
    },
    {
      title: "Tasa Interna de Retorno",
      description: "Calcula la TIR de un proyecto",
      screen: "TIR",
      color: "#E91E63",
    },
  ];

  const handleNavigation = (option: CalculatorOption) => {
    navigation.navigate(option.screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>InteresXpert</Text>
        <View style={styles.userInfo}>
          <Text style={styles.welcome}>Bienvenido, {user?.name || user?.username}</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {biometricsAvailable && (
        <View style={styles.biometricOption}>
          <Text style={styles.biometricText}>Habilitar inicio de sesión con biometría:</Text>
          <Switch
            value={user?.useBiometrics || false}
            onValueChange={handleEnableBiometrics}
            trackColor={{ false: "#ddd", true: "#7B1FA2" }}
            thumbColor={user?.useBiometrics ? "#4527A0" : "#f4f3f4"}
            disabled={user?.useBiometrics}
          />
        </View>
      )}

      <Text style={styles.subtitle}>Selecciona una calculadora</Text>

      <ScrollView style={styles.scrollView}>
        <View style={styles.cardsContainer}>
          {calculatorOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: option.color }]}
              onPress={() => handleNavigation(option)}
            >
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4527A0',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  welcome: {
    fontSize: 16,
    color: '#E1E1F5',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  biometricOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  biometricText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 15,
    marginLeft: 20,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: 15,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#E1E1F5',
  },
});

export default DashboardScreen; 