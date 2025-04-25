import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

const SimpleRateInterestScreen: React.FC = () => {
  const [principal, setPrincipal] = useState('');
  const [interest, setInterest] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculateRate = () => {
    if (!principal || !interest || !time) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const p = parseFloat(principal);
    const i = parseFloat(interest);
    const t = parseFloat(time);
    
    if (p <= 0 || i <= 0 || t <= 0) {
      Alert.alert('Error', 'Todos los valores deben ser mayores que cero');
      return;
    }
    
    // Fórmula para calcular la tasa de interés simple: r = I / (P * t)
    const rate = i / (p * t);
    const ratePercentage = rate * 100;
    
    setResult(ratePercentage);
  };

  const clearForm = () => {
    setPrincipal('');
    setInterest('');
    setTime('');
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Calculadora de Tasa de Interés Simple</Text>
            <Text style={styles.subtitle}>Calcula la tasa de interés necesaria</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Capital Inicial (P)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 1000"
                keyboardType="numeric"
                value={principal}
                onChangeText={setPrincipal}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Interés Generado (I)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 200"
                keyboardType="numeric"
                value={interest}
                onChangeText={setInterest}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tiempo (años)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 2"
                keyboardType="numeric"
                value={time}
                onChangeText={setTime}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.calculateButton} 
                onPress={calculateRate}
              >
                <Text style={styles.buttonText}>Calcular</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={clearForm}
              >
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
            
            {result !== null && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Resultado:</Text>
                <View style={styles.resultBox}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultText}>Tasa de Interés Anual:</Text>
                    <Text style={styles.resultValue}>{result.toFixed(2)}%</Text>
                  </View>
                </View>
                
                <View style={styles.formulaContainer}>
                  <Text style={styles.formulaTitle}>Fórmula Aplicada:</Text>
                  <Text style={styles.formula}>r = I / (P × t)</Text>
                  <Text style={styles.formulaWhere}>
                    Donde: r = Tasa de interés, I = Interés generado, P = Principal, t = Tiempo (años)
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#673AB7',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#E1E1F5',
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  calculateButton: {
    backgroundColor: '#673AB7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 25,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#673AB7',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#673AB7',
  },
  formulaContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#EDE7F6',
    borderRadius: 8,
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  formula: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 8,
    color: '#673AB7',
    fontWeight: 'bold',
  },
  formulaWhere: {
    fontSize: 14,
    color: '#555',
  },
});

export default SimpleRateInterestScreen; 