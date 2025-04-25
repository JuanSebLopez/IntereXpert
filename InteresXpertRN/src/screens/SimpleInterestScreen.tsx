import React, { useState, useEffect } from 'react';
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
  Alert,
  Switch
} from 'react-native';
import UnitSelector, { TimeUnit } from '../components/UnitSelector';
import {
  calculateInterest,
  calculatePrincipal,
  calculateRate,
  calculateTime
} from '../utils/timeUnitConversion';

enum CalculationType {
  INTEREST = 'interest',
  PRINCIPAL = 'principal',
  RATE = 'rate',
  TIME = 'time'
}

const SimpleInterestScreen: React.FC = () => {
  // Inputs
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [interest, setInterest] = useState('');

  // Units
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('anual');
  const [rateUnit, setRateUnit] = useState<TimeUnit>('anual');
  const [outputRateUnit, setOutputRateUnit] = useState<TimeUnit>('anual');
  const [outputTimeUnit, setOutputTimeUnit] = useState<TimeUnit>('anual');

  // Results
  const [result, setResult] = useState<number | null>(null);
  const [calculationType, setCalculationType] = useState<CalculationType>(CalculationType.INTEREST);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  // Comprobamos qué variable está siendo calculada
  useEffect(() => {
    // Si solo hay una variable sin valor, esa es la que se calculará
    // Si hay más de una, decidimos por prioridad: interés > capital > tasa > tiempo
    let emptyFields = 0;
    let type = CalculationType.INTEREST;

    if (!interest) {
      emptyFields++;
      type = CalculationType.INTEREST;
    }
    if (!principal) {
      emptyFields++;
      type = CalculationType.PRINCIPAL;
    }
    if (!rate) {
      emptyFields++;
      type = CalculationType.RATE;
    }
    if (!time) {
      emptyFields++;
      type = CalculationType.TIME;
    }

    if (emptyFields === 1) {
      setCalculationType(type);
    } else {
      // Si hay más o menos de un campo vacío, reiniciamos el resultado
      setResult(null);
      setTotalAmount(null);
    }
  }, [principal, rate, time, interest]);

  const performCalculation = () => {
    // Verificar que haya exactamente una variable omitida
    const filledFields = [principal, rate, time, interest].filter(Boolean).length;
    if (filledFields !== 3) {
      Alert.alert('Error', 'Debes ingresar exactamente 3 de los 4 valores (Capital, Tasa, Tiempo, Interés)');
      return;
    }

    try {
      switch (calculationType) {
        case CalculationType.INTEREST:
          calculateInterestValue();
          break;
        case CalculationType.PRINCIPAL:
          calculatePrincipalValue();
          break;
        case CalculationType.RATE:
          calculateRateValue();
          break;
        case CalculationType.TIME:
          calculateTimeValue();
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error en el cálculo. Verifica tus valores.');
      console.error(error);
    }
  };

  const calculateInterestValue = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100; // Convertir a decimal
    const t = parseFloat(time);
    
    // Calculamos el interés con las unidades seleccionadas
    const interestValue = calculateInterest(p, r, t, rateUnit, timeUnit);
    
    setResult(interestValue);
    setTotalAmount(p + interestValue);
  };

  const calculatePrincipalValue = () => {
    const i = parseFloat(interest);
    const r = parseFloat(rate) / 100; // Convertir a decimal
    const t = parseFloat(time);
    
    // Calculamos el principal con las unidades seleccionadas
    const principalValue = calculatePrincipal(i, r, t, rateUnit, timeUnit);
    
    setResult(principalValue);
    setTotalAmount(principalValue + i);
  };

  const calculateRateValue = () => {
    const p = parseFloat(principal);
    const t = parseFloat(time);
    const i = parseFloat(interest);
    
    // Para calcular la tasa, usamos la unidad de tiempo como referencia
    // y luego convertimos al tipo de salida deseado
    const rateValue = calculateRate(p, i, t, timeUnit, outputRateUnit);
    
    // Convertimos a porcentaje para mostrar
    setResult(rateValue * 100);
  };

  const calculateTimeValue = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100; // Convertir a decimal
    const i = parseFloat(interest);
    
    // Para calcular el tiempo, usamos la unidad de tasa como referencia
    // y luego convertimos al tipo de salida deseado
    const timeValue = calculateTime(p, i, r, rateUnit, outputTimeUnit);
    
    setResult(timeValue);
  };

  const clearForm = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setInterest('');
    setResult(null);
    setTotalAmount(null);
  };

  const getResultLabel = () => {
    switch (calculationType) {
      case CalculationType.INTEREST:
        return 'Interés:';
      case CalculationType.PRINCIPAL:
        return 'Capital Inicial:';
      case CalculationType.RATE:
        return `Tasa (${outputRateUnit}):`;
      case CalculationType.TIME:
        return `Tiempo (${outputTimeUnit}):`;
      default:
        return 'Resultado:';
    }
  };

  const getResultUnit = () => {
    switch (calculationType) {
      case CalculationType.RATE:
        return '%';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Calculadora de Interés Simple</Text>
            <Text style={styles.subtitle}>Calcula el interés para un capital fijo</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.calculationModeText}>
              Calculando: <Text style={styles.highlightText}>
                {calculationType === CalculationType.INTEREST ? 'Interés' :
                 calculationType === CalculationType.PRINCIPAL ? 'Capital Inicial' :
                 calculationType === CalculationType.RATE ? 'Tasa de Interés' : 'Tiempo'}
              </Text>
            </Text>
            
            {/* Capital Inicial */}
            <View style={styles.inputGroup}>
              <Text style={[
                styles.label, 
                calculationType === CalculationType.PRINCIPAL && styles.disabledLabel
              ]}>
                Capital Inicial (C)
                {calculationType === CalculationType.PRINCIPAL && ' (a calcular)'}
              </Text>
              {calculationType !== CalculationType.PRINCIPAL ? (
                <TextInput
                  style={styles.input}
                  placeholder="Ej. 1000"
                  keyboardType="numeric"
                  value={principal}
                  onChangeText={setPrincipal}
                />
              ) : (
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledText}>Se calculará automáticamente</Text>
                </View>
              )}
            </View>
            
            {/* Tasa de Interés */}
            <View style={styles.inputGroup}>
              <Text style={[
                styles.label, 
                calculationType === CalculationType.RATE && styles.disabledLabel
              ]}>
                Tasa de Interés (i)
                {calculationType === CalculationType.RATE && ' (a calcular)'}
              </Text>
              
              <View style={styles.rowContainer}>
                {calculationType !== CalculationType.RATE ? (
                  <>
                    <TextInput
                      style={[styles.input, { flex: 3, marginRight: 10 }]}
                      placeholder="Ej. 5"
                      keyboardType="numeric"
                      value={rate}
                      onChangeText={setRate}
                    />
                    <UnitSelector
                      label=""
                      selectedUnit={rateUnit}
                      onUnitChange={setRateUnit}
                      accentColor="#4527A0"
                    />
                  </>
                ) : (
                  <View style={styles.disabledInput}>
                    <Text style={styles.disabledText}>Se calculará automáticamente</Text>
                  </View>
                )}
              </View>
              
              {calculationType === CalculationType.RATE && (
                <View style={styles.outputUnitSelector}>
                  <Text style={styles.outputUnitLabel}>Unidad de salida:</Text>
                  <UnitSelector
                    label=""
                    selectedUnit={outputRateUnit}
                    onUnitChange={setOutputRateUnit}
                    accentColor="#4527A0"
                  />
                </View>
              )}
            </View>
            
            {/* Tiempo */}
            <View style={styles.inputGroup}>
              <Text style={[
                styles.label, 
                calculationType === CalculationType.TIME && styles.disabledLabel
              ]}>
                Tiempo (t)
                {calculationType === CalculationType.TIME && ' (a calcular)'}
              </Text>
              
              <View style={styles.rowContainer}>
                {calculationType !== CalculationType.TIME ? (
                  <>
                    <TextInput
                      style={[styles.input, { flex: 3, marginRight: 10 }]}
                      placeholder="Ej. 2"
                      keyboardType="numeric"
                      value={time}
                      onChangeText={setTime}
                    />
                    <UnitSelector
                      label=""
                      selectedUnit={timeUnit}
                      onUnitChange={setTimeUnit}
                      accentColor="#4527A0"
                    />
                  </>
                ) : (
                  <View style={styles.disabledInput}>
                    <Text style={styles.disabledText}>Se calculará automáticamente</Text>
                  </View>
                )}
              </View>
              
              {calculationType === CalculationType.TIME && (
                <View style={styles.outputUnitSelector}>
                  <Text style={styles.outputUnitLabel}>Unidad de salida:</Text>
                  <UnitSelector
                    label=""
                    selectedUnit={outputTimeUnit}
                    onUnitChange={setOutputTimeUnit}
                    accentColor="#4527A0"
                  />
                </View>
              )}
            </View>
            
            {/* Interés */}
            <View style={styles.inputGroup}>
              <Text style={[
                styles.label, 
                calculationType === CalculationType.INTEREST && styles.disabledLabel
              ]}>
                Interés (I)
                {calculationType === CalculationType.INTEREST && ' (a calcular)'}
              </Text>
              {calculationType !== CalculationType.INTEREST ? (
                <TextInput
                  style={styles.input}
                  placeholder="Ej. 100"
                  keyboardType="numeric"
                  value={interest}
                  onChangeText={setInterest}
                />
              ) : (
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledText}>Se calculará automáticamente</Text>
                </View>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.calculateButton} 
                onPress={performCalculation}
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
                    <Text style={styles.resultText}>{getResultLabel()}</Text>
                    <Text style={styles.resultValue}>
                      {calculationType !== CalculationType.RATE && '$'}
                      {result.toFixed(2)}{getResultUnit()}
                    </Text>
                  </View>
                  
                  {totalAmount !== null && calculationType !== CalculationType.RATE && calculationType !== CalculationType.TIME && (
                    <View style={styles.resultRow}>
                      <Text style={styles.resultText}>Monto Total:</Text>
                      <Text style={styles.resultValue}>${totalAmount.toFixed(2)}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.formulaContainer}>
                  <Text style={styles.formulaTitle}>Fórmula Aplicada:</Text>
                  <Text style={styles.formula}>
                    {calculationType === CalculationType.INTEREST && 'I = C × i × t'}
                    {calculationType === CalculationType.PRINCIPAL && 'C = I / (i × t)'}
                    {calculationType === CalculationType.RATE && 'i = I / (C × t)'}
                    {calculationType === CalculationType.TIME && 't = I / (C × i)'}
                  </Text>
                  <Text style={styles.formulaWhere}>
                    Donde: I = Interés, C = Capital inicial, i = Tasa de interés, t = Tiempo
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
    backgroundColor: '#4527A0',
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
  calculationModeText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  highlightText: {
    color: '#4527A0',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  disabledLabel: {
    color: '#4527A0',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    flex: 1,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4527A0',
    borderStyle: 'dashed',
  },
  disabledText: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outputUnitSelector: {
    marginTop: 10,
  },
  outputUnitLabel: {
    fontSize: 14,
    color: '#4527A0',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  calculateButton: {
    backgroundColor: '#4527A0',
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
    borderColor: '#4527A0',
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
    color: '#4527A0',
  },
  formulaContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E1E1F5',
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
    color: '#4527A0',
    fontWeight: 'bold',
  },
  formulaWhere: {
    fontSize: 14,
    color: '#555',
  },
});

export default SimpleInterestScreen; 