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
  Alert,
  Switch
} from 'react-native';

enum AnnuityType {
  ORDINARY = 'ordinary', // Pagos al final del periodo
  DUE = 'due', // Pagos al inicio del periodo
}

enum CalculationType {
  PAYMENT = 'payment', // Calcular pago periódico
  FUTURE_VALUE = 'future_value', // Calcular valor futuro
  PRESENT_VALUE = 'present_value', // Calcular valor presente
}

const AnnuityScreen: React.FC = () => {
  const [payment, setPayment] = useState('');
  const [presentValue, setPresentValue] = useState('');
  const [futureValue, setFutureValue] = useState('');
  const [rate, setRate] = useState('');
  const [periods, setPeriods] = useState('');
  const [annuityType, setAnnuityType] = useState<AnnuityType>(AnnuityType.ORDINARY);
  const [calculationType, setCalculationType] = useState<CalculationType>(CalculationType.PAYMENT);
  const [result, setResult] = useState<number | null>(null);

  const toggleAnnuityType = () => {
    setAnnuityType(
      annuityType === AnnuityType.ORDINARY ? AnnuityType.DUE : AnnuityType.ORDINARY
    );
  };

  const selectCalculationType = (type: CalculationType) => {
    setCalculationType(type);
    clearForm();
  };

  const calculateAnnuity = () => {
    try {
      const r = parseFloat(rate) / 100; // Convertir tasa a decimal
      const n = parseFloat(periods);
      
      if (r <= 0 || n <= 0) {
        Alert.alert('Error', 'La tasa de interés y el número de periodos deben ser mayores que cero');
        return;
      }

      // Factor para anualidad vencida o anticipada
      const dueFactor = annuityType === AnnuityType.DUE ? (1 + r) : 1;
      
      switch (calculationType) {
        case CalculationType.PAYMENT:
          if (!presentValue && !futureValue) {
            Alert.alert('Error', 'Debes proporcionar al menos un valor presente o futuro');
            return;
          }
          
          let paymentResult = 0;
          if (presentValue) {
            const pv = parseFloat(presentValue);
            // Fórmula para calcular el pago periódico usando valor presente
            paymentResult = (pv * r) / (dueFactor * (1 - Math.pow(1 + r, -n)));
          } else if (futureValue) {
            const fv = parseFloat(futureValue);
            // Fórmula para calcular el pago periódico usando valor futuro
            paymentResult = (fv * r) / (dueFactor * (Math.pow(1 + r, n) - 1));
          }
          setResult(paymentResult);
          break;
          
        case CalculationType.FUTURE_VALUE:
          if (!payment || !periods || !rate) {
            Alert.alert('Error', 'Por favor, completa todos los campos requeridos');
            return;
          }
          
          const paymentAmount = parseFloat(payment);
          // Fórmula para calcular el valor futuro
          const fv = (paymentAmount * dueFactor * (Math.pow(1 + r, n) - 1)) / r;
          setResult(fv);
          break;
          
        case CalculationType.PRESENT_VALUE:
          if (!payment || !periods || !rate) {
            Alert.alert('Error', 'Por favor, completa todos los campos requeridos');
            return;
          }
          
          const paymentValue = parseFloat(payment);
          // Fórmula para calcular el valor presente
          const pv = (paymentValue * dueFactor * (1 - Math.pow(1 + r, -n))) / r;
          setResult(pv);
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error en el cálculo. Por favor, verifica los valores.');
      console.error(error);
    }
  };

  const clearForm = () => {
    setPayment('');
    setPresentValue('');
    setFutureValue('');
    setRate('');
    setPeriods('');
    setResult(null);
  };

  const renderInputFields = () => {
    switch (calculationType) {
      case CalculationType.PAYMENT:
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor Presente (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 10000"
                keyboardType="numeric"
                value={presentValue}
                onChangeText={setPresentValue}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor Futuro (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 15000"
                keyboardType="numeric"
                value={futureValue}
                onChangeText={setFutureValue}
              />
            </View>
          </>
        );
        
      case CalculationType.FUTURE_VALUE:
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pago Periódico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 500"
              keyboardType="numeric"
              value={payment}
              onChangeText={setPayment}
            />
          </View>
        );
        
      case CalculationType.PRESENT_VALUE:
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pago Periódico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 500"
              keyboardType="numeric"
              value={payment}
              onChangeText={setPayment}
            />
          </View>
        );
        
      default:
        return null;
    }
  };

  const getResultLabel = () => {
    switch (calculationType) {
      case CalculationType.PAYMENT:
        return 'Pago Periódico:';
      case CalculationType.FUTURE_VALUE:
        return 'Valor Futuro:';
      case CalculationType.PRESENT_VALUE:
        return 'Valor Presente:';
      default:
        return 'Resultado:';
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
            <Text style={styles.title}>Calculadora de Anualidades</Text>
            <Text style={styles.subtitle}>Calcula pagos o recibos periódicos</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.calculationTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.calculationTypeButton,
                  calculationType === CalculationType.PAYMENT && styles.activeCalculationType
                ]}
                onPress={() => selectCalculationType(CalculationType.PAYMENT)}
              >
                <Text 
                  style={[
                    styles.calculationTypeText,
                    calculationType === CalculationType.PAYMENT && styles.activeCalculationTypeText
                  ]}
                >
                  Calcular Pago
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.calculationTypeButton,
                  calculationType === CalculationType.FUTURE_VALUE && styles.activeCalculationType
                ]}
                onPress={() => selectCalculationType(CalculationType.FUTURE_VALUE)}
              >
                <Text 
                  style={[
                    styles.calculationTypeText,
                    calculationType === CalculationType.FUTURE_VALUE && styles.activeCalculationTypeText
                  ]}
                >
                  Calcular Valor Futuro
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.calculationTypeButton,
                  calculationType === CalculationType.PRESENT_VALUE && styles.activeCalculationType
                ]}
                onPress={() => selectCalculationType(CalculationType.PRESENT_VALUE)}
              >
                <Text 
                  style={[
                    styles.calculationTypeText,
                    calculationType === CalculationType.PRESENT_VALUE && styles.activeCalculationTypeText
                  ]}
                >
                  Calcular Valor Presente
                </Text>
              </TouchableOpacity>
            </View>
            
            {renderInputFields()}
            
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
              <Text style={styles.label}>Número de Periodos</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 12"
                keyboardType="numeric"
                value={periods}
                onChangeText={setPeriods}
              />
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                Anualidad {annuityType === AnnuityType.ORDINARY ? 'Vencida' : 'Anticipada'}
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#3F51B5' }}
                thumbColor={annuityType === AnnuityType.DUE ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleAnnuityType}
                value={annuityType === AnnuityType.DUE}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.calculateButton} 
                onPress={calculateAnnuity}
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
                    <Text style={styles.resultText}>{getResultLabel()}</Text>
                    <Text style={styles.resultValue}>${result.toFixed(2)}</Text>
                  </View>
                </View>
                
                <View style={styles.formulaContainer}>
                  <Text style={styles.formulaTitle}>Nota Importante:</Text>
                  <Text style={styles.formulaWhere}>
                    Las anualidades vencidas tienen pagos al final de cada periodo.
                    Las anualidades anticipadas tienen pagos al inicio de cada periodo.
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
    backgroundColor: '#3F51B5',
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
  calculationTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calculationTypeButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  calculationTypeText: {
    textAlign: 'center',
    color: '#555',
    fontWeight: '500',
  },
  activeCalculationType: {
    backgroundColor: '#3F51B5',
  },
  activeCalculationTypeText: {
    color: '#fff',
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  calculateButton: {
    backgroundColor: '#3F51B5',
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
    marginTop: 10,
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
    borderColor: '#3F51B5',
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
    color: '#3F51B5',
  },
  formulaContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E8EAF6',
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
    color: '#3F51B5',
    fontWeight: 'bold',
  },
  formulaWhere: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default AnnuityScreen; 