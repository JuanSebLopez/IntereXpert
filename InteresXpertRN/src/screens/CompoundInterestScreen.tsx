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

const CompoundInterestScreen: React.FC = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compounds, setCompounds] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  const calculateCompoundInterest = () => {
    if (!principal || !rate || !time || !compounds) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100; // Convertir a decimal
    const t = parseFloat(time);
    const n = parseFloat(compounds);
    
    // Fórmula de interés compuesto: A = P(1 + r/n)^(nt)
    const amount = p * Math.pow(1 + r / n, n * t);
    const interest = amount - p;
    
    setResult(interest);
    setTotalAmount(amount);
  };

  const clearForm = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setCompounds('');
    setResult(null);
    setTotalAmount(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Calculadora de Interés Compuesto</Text>
            <Text style={styles.subtitle}>Calcula el interés que se suma al capital</Text>
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
              <Text style={styles.label}>Tasa de Interés Anual (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 5"
                keyboardType="numeric"
                value={rate}
                onChangeText={setRate}
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
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Periodos de Capitalización por Año</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 12 (mensual), 4 (trimestral), 1 (anual)"
                keyboardType="numeric"
                value={compounds}
                onChangeText={setCompounds}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.calculateButton} 
                onPress={calculateCompoundInterest}
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
                <Text style={styles.resultLabel}>Resultados:</Text>
                <View style={styles.resultBox}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultText}>Interés:</Text>
                    <Text style={styles.resultValue}>${result.toFixed(2)}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultText}>Monto Total:</Text>
                    <Text style={styles.resultValue}>${totalAmount?.toFixed(2)}</Text>
                  </View>
                </View>
                
                <View style={styles.formulaContainer}>
                  <Text style={styles.formulaTitle}>Fórmula Aplicada:</Text>
                  <Text style={styles.formula}>A = P(1 + r/n)^(nt)</Text>
                  <Text style={styles.formulaWhere}>
                    Donde: A = Monto final, P = Principal, r = Tasa de interés (decimal), n = Períodos de capitalización por año, t = Tiempo (años)
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
    backgroundColor: '#7B1FA2',
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
    backgroundColor: '#7B1FA2',
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
    borderColor: '#7B1FA2',
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
    color: '#7B1FA2',
  },
  formulaContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F3E5F5',
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
    color: '#7B1FA2',
    fontWeight: 'bold',
  },
  formulaWhere: {
    fontSize: 14,
    color: '#555',
  },
});

export default CompoundInterestScreen; 