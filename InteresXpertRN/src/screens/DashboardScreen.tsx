import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/AppNavigator';

type DashboardNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Dashboard'>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();

  const calculatorOptions = [
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
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>InteresXpert</Text>
        <Text style={styles.subtitle}>Selecciona una calculadora</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.cardsContainer}>
          {calculatorOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: option.color }]}
              onPress={() => navigation.navigate(option.screen as keyof MainTabParamList)}
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
  subtitle: {
    fontSize: 16,
    color: '#E1E1F5',
    marginTop: 5,
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