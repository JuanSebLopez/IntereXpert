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

const CompoundRateInterestScreen: React.FC = () => {
  const [principal, setPrincipal] = useState('');
  const [finalAmount, setFinalAmount] = useState('');
  const [time, setTime] = useState('');
  const [compounds, setCompounds] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculateRate = () => {
    if (!principal || !finalAmount || !time || !compounds) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const p = parseFloat(principal);
    const a = parseFloat(finalAmount);
    const t = parseFloat(time);
    const n = parseFloat(compounds);
    
    if (p <= 0 || a <= 0 || t <= 0 || n <= 0) {
      Alert.alert('Error', 'Todos los valores deben ser mayores que cero');
      return;
    }
    
    if (a <= p) {
      Alert.alert('Error', 'El monto final debe ser mayor que el capital inicial');
      return;
    }
    
    // Fórmula para calcular la tasa de interés compuesto: r = n * [(A/P)^(1/(n*t)) - 1]
    const base = a / p;
    const exponent = 1 / (n * t);
    const rate = n * (Math.pow(base, exponent) - 1);
    const ratePercentage = rate * 100;
    
    setResult(ratePercentage);
  };

  const clearForm = () => {
    setPrincipal('');
    setFinalAmount('');
    setTime('');
    setCompounds('');
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
            <Text style={styles.title}>Calculadora de Tasa de Interés Compuesto</Text>
            <Text style={styles.subtitle}>Calcula la tasa para un interés compuesto</Text>
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
              <Text style={styles.label}>Monto Final (A)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 1500"
                keyboardType="numeric"
                value={finalAmount}
                onChangeText={setFinalAmount}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tiempo (años)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 5"
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
                  <Text style={styles.formula}>r = n × [(A/P)^(1/(n×t)) - 1]</Text>
                  <Text style={styles.formulaWhere}>
                    Donde: r = Tasa de interés, A = Monto final, P = Capital inicial, n = Periodos de capitalización por año, t = Tiempo (años)
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
    backgroundColor: '#9C27B0',
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
    backgroundColor: '#9C27B0',
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
    borderColor: '#9C27B0',
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
    color: '#9C27B0',
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
    color: '#9C27B0',
    fontWeight: 'bold',
  },
  formulaWhere: {
    fontSize: 14,
    color: '#555',
  },
});

export default CompoundRateInterestScreen; 